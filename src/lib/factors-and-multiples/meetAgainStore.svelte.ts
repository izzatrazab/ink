// The rune adapter over Meet Again's rules (meetAgain.ts): one live object per game
// that a page reads and drives. It owns what the pure module does not — the beat
// clock, the current Round, the score, the session's streak — and is the only place
// that touches storage or a timer, so the rules stay framework-free. Storage is
// injected so tests run without a browser; the clock is the global setInterval,
// which tests fake.
//
// The clock is a student's choice: `slow` and `normal` tick by themselves, `step`
// waits for "Next beat", so nobody is shut out of the game by speed. There is no
// Round until `start()` runs on mount (a random Round drawn during server
// rendering would not match the browser's).

import { silent, type Sounds } from './sound';
import {
	BEAT_MS,
	KINDS,
	advance,
	applyRound,
	dark,
	freshPlay,
	isLit,
	lastBeat,
	makeRound,
	parseProgress,
	parseTempo,
	scoreRound,
	tap,
	unlockedKinds,
	type Kind,
	type Mistake,
	type Progress,
	type Random,
	type Round,
	type RoundPlay,
	type RoundResult,
	type Tempo
} from './meetAgain';

export const PROGRESS_KEY = 'meet-again-progress';
export const MUTED_KEY = 'meet-again-muted';
export const TEMPO_KEY = 'meet-again-tempo';

/** Where progress and the settings are kept. Both calls may throw (blocked storage); the game carries on. */
export interface MeetAgainStorage {
	read(key: string): string | null;
	write(key: string, value: string): void;
}

const browserStorage: MeetAgainStorage = {
	read: (key) => localStorage.getItem(key),
	write: (key, value) => localStorage.setItem(key, value)
};

export interface MeetAgainOptions {
	rng?: Random;
	storage?: MeetAgainStorage;
	/** What plays on a tap or a beat. Silent unless the page passes real sounds. */
	sounds?: Sounds;
}

class MeetAgainGame {
	#rng: Random;
	#storage: MeetAgainStorage;
	#sounds: Sounds;
	#timer: ReturnType<typeof setInterval> | undefined;

	/** Per kind: Rounds finished with no mistake. */
	progress = $state<Progress>({});
	kind = $state<Kind>(KINDS[0]);
	tempo = $state<Tempo>('slow');
	/** The Round's lights; empty until `start()`. */
	round = $state<Round>({ periods: [], meetings: 0 });
	play = $state<RoundPlay>(freshPlay());
	/** Whether the student has pressed Start on this Round. */
	started = $state(false);
	/** Whether a timed Round is held. */
	paused = $state(false);
	/** The score, once the Round is over; null while it is in play. */
	result = $state<RoundResult | null>(null);
	/** The last mistake, until the next meeting is caught; the page explains it. */
	lastMistake = $state<Mistake | null>(null);
	/** Perfect Rounds in a row this visit. */
	streak = $state(0);
	/** The kind this Round just unlocked, until the next Round is dealt. */
	justUnlocked = $state<Kind | null>(null);
	muted = $state(false);

	constructor({ rng = Math.random, storage = browserStorage, sounds = silent }: MeetAgainOptions) {
		this.#rng = rng;
		this.#storage = storage;
		this.#sounds = sounds;
	}

	readonly beat = $derived(this.play.beat);
	readonly end = $derived(this.round.periods.length ? lastBeat(this.round) : 0);
	/** Which lights are lit on this beat, one per period. */
	readonly lit = $derived(this.round.periods.map((p) => isLit(p, this.play.beat)));
	readonly mistakes = $derived(this.play.mistakes.length);
	readonly met = $derived(this.play.met);
	readonly unlocked = $derived(unlockedKinds(this.progress));
	/** Mistake-free Rounds finished in the current kind. */
	readonly clean = $derived(this.progress[this.kind] ?? 0);
	/** Whether a Round is under way: begun, not over. */
	readonly inPlay = $derived(this.started && this.result === null);
	/** Whether the beats come by themselves. */
	readonly timed = $derived(BEAT_MS[this.tempo] !== null);

	/** Loads saved progress and settings, and deals the first Round. Call from onMount. */
	start() {
		try {
			this.progress = parseProgress(this.#storage.read(PROGRESS_KEY));
			this.muted = this.#storage.read(MUTED_KEY) === '1';
			this.tempo = parseTempo(this.#storage.read(TEMPO_KEY));
		} catch {
			// storage blocked — progress and the settings just will not persist
		}
		this.#deal();
	}

	/** Starts the Round: the first beat lights at once, then the clock (if any) takes over. */
	begin() {
		if (this.started || this.round.periods.length === 0) return;
		this.started = true;
		this.paused = false;
		this.#tick();
		this.#run();
	}

	/** Step mode: on to the next beat. */
	step() {
		if (!this.started || this.timed || this.result) return;
		this.#tick();
	}

	/** The student taps "Together!": judged against the beat now lit. */
	tapTogether() {
		if (!this.inPlay || this.paused) return;
		const { play, outcome } = tap(this.round, this.play);
		if (outcome === 'ignored') return;
		this.play = play;
		if (outcome === 'met') {
			this.lastMistake = null;
			this.#sound((s) => s.success(play.met.length - 1));
		} else {
			this.lastMistake = { beat: play.beat, kind: 'early' };
			this.#sound((s) => s.wrong());
		}
		if (play.done) this.#finish();
	}

	/** Holds a timed Round, e.g. when the tab is hidden. */
	pause() {
		if (!this.inPlay || !this.timed || this.paused) return;
		this.#halt();
		this.paused = true;
	}

	resume() {
		if (!this.paused) return;
		this.paused = false;
		this.#run();
	}

	/** Deals a fresh Round of the same kind, abandoning the one in play. */
	next() {
		this.#deal();
	}

	selectKind(kind: Kind) {
		if (!this.unlocked.includes(kind) || kind === this.kind) return;
		this.kind = kind;
		this.#deal();
	}

	/** Changes the clock; held while a Round is in play so a Round is never half one speed. */
	setTempo(tempo: Tempo) {
		if (this.inPlay || tempo === this.tempo) return;
		this.tempo = tempo;
		this.#save(TEMPO_KEY, tempo);
	}

	toggleMute() {
		this.muted = !this.muted;
		this.#save(MUTED_KEY, this.muted ? '1' : '0');
	}

	/** Ends the clock; call when the page is destroyed. */
	stop() {
		this.#halt();
	}

	#run() {
		const ms = BEAT_MS[this.tempo];
		this.#halt();
		if (ms === null || this.result) return;
		this.#timer = setInterval(() => this.#tick(), ms);
	}

	#halt() {
		clearInterval(this.#timer);
		this.#timer = undefined;
	}

	#tick() {
		const before = this.play.mistakes.length;
		this.play = advance(this.round, this.play);
		if (this.play.mistakes.length > before) {
			this.lastMistake = this.play.mistakes[this.play.mistakes.length - 1];
			this.#sound((s) => s.wrong());
		} else if (!this.play.done) {
			this.#sound((s) => s.tick?.());
		}
		if (this.play.done) this.#finish();
	}

	#finish() {
		this.#halt();
		const result = scoreRound(this.play.mistakes.length);
		const before = unlockedKinds(this.progress);
		this.progress = applyRound(this.progress, this.kind, result.mistakes);
		this.result = result;
		this.streak = result.stars === 3 ? this.streak + 1 : 0;
		this.justUnlocked = unlockedKinds(this.progress).find((k) => !before.includes(k)) ?? null;
		this.#save(PROGRESS_KEY, JSON.stringify(this.progress));
		this.#sound((s) => s.done());
	}

	#sound(play: (sounds: Sounds) => void) {
		if (!this.muted) play(this.#sounds);
	}

	#save(key: string, value: string) {
		try {
			this.#storage.write(key, value);
		} catch {
			// ignore
		}
	}

	#deal() {
		this.#halt();
		this.round = makeRound(this.kind, this.#rng, this.round.periods);
		this.play = freshPlay();
		this.started = false;
		this.paused = false;
		this.result = null;
		this.lastMistake = null;
		this.justUnlocked = null;
	}
}

export type StartedMeetAgain = MeetAgainGame;

/** Starts a Meet Again game; call `start()` once mounted and `stop()` when destroyed. */
export function startMeetAgain(options: MeetAgainOptions = {}): StartedMeetAgain {
	return new MeetAgainGame(options);
}

/** Why a mistake was a mistake, in numbers the page can word: the dark light, or the meeting that passed. */
export function explainMistake(round: Round, m: Mistake) {
	return m.kind === 'early'
		? { kind: 'early' as const, beat: m.beat, off: dark(round.periods, m.beat) }
		: { kind: 'missed' as const, beat: m.beat, off: null };
}
