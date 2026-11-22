// The rune adapter over Prime Breaker's rules (primeBreaker.ts): one live object
// per game that a page reads and drives. It owns what the pure module does not —
// the current Round, what has been tapped, the score, the session's streak — and
// is the only place that touches storage, so the rules stay framework-free.
// Storage is injected so tests run without a browser.
//
// There is no Round until `start()` runs on mount: a random Round drawn during
// server rendering would not match the one the browser draws, so both sides
// render the same empty game first.

import { isDone, rowsOf, type Rejection } from './ladder';
import { silent, type Sounds } from './sound';
import {
	KINDS,
	applyRound,
	freshPlay,
	makeRound,
	parseProgress,
	scoreRound,
	tapDivisor,
	unlockedKinds,
	type Kind,
	type Progress,
	type Random,
	type RoundPlay,
	type RoundResult
} from './primeBreaker';

export const PROGRESS_KEY = 'prime-breaker-progress';
export const MUTED_KEY = 'prime-breaker-muted';

/** Where progress and the sound setting are kept. Both calls may throw (blocked storage); the game carries on. */
export interface PrimeBreakerStorage {
	read(key: string): string | null;
	write(key: string, value: string): void;
}

const browserStorage: PrimeBreakerStorage = {
	read: (key) => localStorage.getItem(key),
	write: (key, value) => localStorage.setItem(key, value)
};

export interface PrimeBreakerOptions {
	rng?: Random;
	storage?: PrimeBreakerStorage;
	/** What plays on a tap. Silent unless the page passes real sounds. */
	sounds?: Sounds;
}

/** The last refusal, until a prime is accepted: the row that was divided, the prime tried, and why not. */
export interface Refusal {
	before: number[];
	d: number;
	rejection: Rejection;
}

class PrimeBreakerGame {
	#rng: Random;
	#storage: PrimeBreakerStorage;
	#sounds: Sounds;

	/** Per kind: Rounds finished with no mistake. */
	progress = $state<Progress>({});
	/** The kind being played. */
	kind = $state<Kind>(KINDS[0]);
	/** The Round's start row; empty until `start()`. */
	startRow = $state<number[]>([]);
	/** What has been tapped on this Round so far. */
	play = $state<RoundPlay>(freshPlay());
	/** The score, once the ladder is finished; null while the Round is in play. */
	result = $state<RoundResult | null>(null);
	/** The last refusal, cleared when a prime is accepted. */
	refusal = $state<Refusal | null>(null);
	/** Perfect Rounds in a row this visit. */
	streak = $state(0);
	/** The kind this Round just unlocked, until the next Round is dealt. */
	justUnlocked = $state<Kind | null>(null);
	/** Whether the sounds are off. */
	muted = $state(false);
	/** Accepted primes in a row on this Round; a refusal ends the run. */
	combo = $state(0);
	/** The longest run on this Round. */
	bestCombo = $state(0);
	/** Whether this Round is a replay: it earns stars but does not count toward Progress. */
	retrying = $state(false);
	/** Whether this Round is the student's own number: free play, never counted toward Progress. */
	own = $state(false);

	constructor({
		rng = Math.random,
		storage = browserStorage,
		sounds = silent
	}: PrimeBreakerOptions) {
		this.#rng = rng;
		this.#storage = storage;
		this.#sounds = sounds;
	}

	/** Every row of the ladder so far, the start row first. */
	readonly rows = $derived(
		this.startRow.length ? rowsOf(this.startRow, this.play.divisors, this.kind) : []
	);
	/** The row to divide next. */
	readonly current = $derived(this.rows[this.rows.length - 1] ?? []);
	readonly divisors = $derived(this.play.divisors);
	readonly mistakes = $derived(this.play.mistakes.length);
	/** The kinds the student may play. */
	readonly unlocked = $derived(unlockedKinds(this.progress));
	/** Mistake-free Rounds finished in the current kind. */
	readonly clean = $derived(this.progress[this.kind] ?? 0);
	/** Whether the student has begun a Round they have not finished. */
	readonly inPlay = $derived(
		this.result === null && (this.play.divisors.length > 0 || this.play.mistakes.length > 0)
	);

	/** Loads saved progress and the sound setting, and deals the first Round. Call from onMount. */
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
	tap(d: number) {
		if (this.result || this.startRow.length === 0) return;
		const before = this.current;
		const t = tapDivisor(before, this.play, d, this.kind);
		if (t.outcome === 'ignored') return;
		this.play = t.play;
		if (t.outcome === 'refused') {
			this.refusal = { before, d, rejection: t.rejection };
			this.combo = 0;
			this.#sound((s) => s.wrong());
			return;
		}
		this.refusal = null;
		this.combo += 1;
		this.bestCombo = Math.max(this.bestCombo, this.combo);
		this.#sound((s) => s.success(t.play.divisors.length - 1));
		if (isDone(t.next, this.kind)) this.#finish();
	}

	next() {
		this.#deal();
	}

	/** Switches kind and deals a Round from it; a locked kind is ignored. */
	selectKind(kind: Kind) {
		if (!this.unlocked.includes(kind) || kind === this.kind) return;
		this.kind = kind;
		this.#deal();
	}

	/** Deals a fresh Round of the same kind, abandoning the one in play. */
	skip() {
		this.#deal();
	}

	/** Breaks the student's own number (already checked by `ownNumber`): prime factors, free play. */
	startOwn(n: number) {
		this.kind = 'single';
		this.startRow = [n];
		this.play = freshPlay();
		this.result = null;
		this.refusal = null;
		this.justUnlocked = null;
		this.combo = 0;
		this.bestCombo = 0;
		this.retrying = false;
		this.own = true;
	}

	/** Plays the same Round again. Its stars are the student's own, but a replay does not count toward Progress or the streak. */
	retry() {
		this.play = freshPlay();
		this.result = null;
		this.refusal = null;
		this.justUnlocked = null;
		this.combo = 0;
		this.bestCombo = 0;
		this.retrying = true;
	}

	toggleMute() {
		this.muted = !this.muted;
		this.#save(MUTED_KEY, this.muted ? '1' : '0');
	}

	#finish() {
		const result = scoreRound(this.play.mistakes.length);
		this.result = result;
		if (!this.retrying && !this.own) {
			const before = unlockedKinds(this.progress);
			this.progress = applyRound(this.progress, this.kind, result.mistakes);
			this.streak = result.stars === 3 ? this.streak + 1 : 0;
			this.justUnlocked = unlockedKinds(this.progress).find((k) => !before.includes(k)) ?? null;
			this.#save(PROGRESS_KEY, JSON.stringify(this.progress));
		}
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
		this.startRow = makeRound(this.kind, this.#rng, this.startRow);
		this.play = freshPlay();
		this.result = null;
		this.refusal = null;
		this.justUnlocked = null;
		this.combo = 0;
		this.bestCombo = 0;
		this.retrying = false;
		this.own = false;
	}
}

export type StartedPrimeBreaker = PrimeBreakerGame;

/** Starts a Prime Breaker game; call `start()` once mounted. */
export function startPrimeBreaker(options: PrimeBreakerOptions = {}): StartedPrimeBreaker {
	return new PrimeBreakerGame(options);
}
