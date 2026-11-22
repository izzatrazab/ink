// The rune adapter over Multiples Hunt's rules (multiplesHunt.ts): one live object
// per game that a page reads and drives. It owns what the pure module does not —
// the current Board, what has been tapped, the score, the session's streak — and
// is the only place that touches storage, so the rules stay framework-free.
// Storage is injected so tests run without a browser.
//
// There is no Board until `start()` runs on mount: a random Board drawn during
// server rendering would not match the one the browser draws, so both sides
// render the same empty game first.

import { silent, type Sounds } from './sound';
import {
	KINDS,
	applyBoard,
	freshPlay,
	isComplete,
	makeRound,
	multiplesOn,
	parseProgress,
	scoreBoard,
	tapNumber,
	unlockedKinds,
	type BoardPlay,
	type BoardResult,
	type Kind,
	type Progress,
	type Random,
	type Round
} from './multiplesHunt';

export const PROGRESS_KEY = 'multiples-hunt-progress';
export const MUTED_KEY = 'multiples-hunt-muted';

/** Where progress and the sound setting are kept. Both calls may throw (blocked storage); the game carries on. */
export interface MultiplesHuntStorage {
	read(key: string): string | null;
	write(key: string, value: string): void;
}

const browserStorage: MultiplesHuntStorage = {
	read: (key) => localStorage.getItem(key),
	write: (key, value) => localStorage.setItem(key, value)
};

export interface MultiplesHuntOptions {
	rng?: Random;
	storage?: MultiplesHuntStorage;
	/** What plays on a tap. Silent unless the page passes real sounds. */
	sounds?: Sounds;
}

class MultiplesHuntGame {
	#rng: Random;
	#storage: MultiplesHuntStorage;
	#sounds: Sounds;

	/** Per kind: Boards finished with no mistake. */
	progress = $state<Progress>({});
	/** The kind being played. */
	kind = $state<Kind>(KINDS[0]);
	/** The numbers to be a multiple of; empty until `start()`. */
	set = $state<number[]>([]);
	/** The Board's numbers; empty until `start()`. */
	board = $state<number[]>([]);
	/** What has been tapped on this Board so far. */
	play = $state<BoardPlay>(freshPlay());
	/** The score, once the last multiple is found; null while the Board is in play. */
	result = $state<BoardResult | null>(null);
	/** The number tapped wrongly last, until the next multiple is found; the page explains it. */
	lastWrong = $state<number | null>(null);
	/** Perfect Boards in a row this visit. */
	streak = $state(0);
	/** The kind this Board just unlocked, until the next Board is dealt. */
	justUnlocked = $state<Kind | null>(null);
	/** Whether the sounds are off. */
	muted = $state(false);

	constructor({
		rng = Math.random,
		storage = browserStorage,
		sounds = silent
	}: MultiplesHuntOptions) {
		this.#rng = rng;
		this.#storage = storage;
		this.#sounds = sounds;
	}

	readonly #round = $derived<Round>({ set: this.set, board: this.board });
	/** Multiples found on this Board, in the order tapped. */
	readonly found = $derived(this.play.found);
	/** Numbers tapped by mistake on this Board. */
	readonly wrong = $derived(this.play.wrong);
	/** The kinds the student may play. */
	readonly unlocked = $derived(unlockedKinds(this.progress));
	/** Mistake-free Boards finished in the current kind. */
	readonly clean = $derived(this.progress[this.kind] ?? 0);
	/** Multiples on the current Board. */
	readonly multiples = $derived(multiplesOn(this.#round));
	/** Multiples still to find on this Board. */
	readonly left = $derived(this.multiples.length - this.play.found.length);
	/** Whether the student has begun tapping a Board they have not finished. */
	readonly inPlay = $derived(
		this.result === null && this.play.found.length + this.play.wrong.length > 0
	);

	/** Loads saved progress and the sound setting, and deals the first Board. Call from onMount. */
	start() {
		try {
			this.progress = parseProgress(this.#storage.read(PROGRESS_KEY));
			this.muted = this.#storage.read(MUTED_KEY) === '1';
		} catch {
			// storage blocked — progress and the setting just will not persist
		}
		this.#deal();
	}

	/** Judges a tap at once. */
	tap(n: number) {
		if (this.result || this.board.length === 0) return;
		const { play, outcome } = tapNumber(this.#round, this.play, n);
		if (outcome === 'ignored') return;
		this.play = play;
		if (outcome === 'found') {
			this.lastWrong = null;
			this.#sound((s) => s.success(play.found.length - 1));
		} else {
			this.lastWrong = n;
			this.#sound((s) => s.wrong());
		}
		if (isComplete(this.#round, play)) this.#finish();
	}

	next() {
		this.#deal();
	}

	/** Switches kind and deals a Board from it; a locked kind is ignored. */
	selectKind(kind: Kind) {
		if (!this.unlocked.includes(kind) || kind === this.kind) return;
		this.kind = kind;
		this.#deal();
	}

	toggleMute() {
		this.muted = !this.muted;
		this.#save(MUTED_KEY, this.muted ? '1' : '0');
	}

	#finish() {
		const result = scoreBoard(this.play.wrong.length);
		const before = unlockedKinds(this.progress);
		this.progress = applyBoard(this.progress, this.kind, result.mistakes);
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
		const round = makeRound(this.kind, this.#rng, this.set);
		this.set = round.set;
		this.board = round.board;
		this.play = freshPlay();
		this.result = null;
		this.lastWrong = null;
		this.justUnlocked = null;
	}
}

export type StartedMultiplesHunt = MultiplesHuntGame;

/** Starts a Multiples Hunt game; call `start()` once mounted. */
export function startMultiplesHunt(options: MultiplesHuntOptions = {}): StartedMultiplesHunt {
	return new MultiplesHuntGame(options);
}
