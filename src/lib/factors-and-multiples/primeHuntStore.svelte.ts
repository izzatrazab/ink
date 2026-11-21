// The rune adapter over Prime Hunt's rules (primeHunt.ts): one live object per
// game that a page reads and drives. It owns what the pure module deliberately
// does not — the current Board, what has been tapped, the score, the session's
// streak of perfect Boards — and is the only place that touches storage, so the
// rules stay framework-free. Storage is injected so tests run without a browser.
//
// There is no Board until `start()` runs on mount: a random Board drawn during
// server rendering would not match the one the browser draws, so both sides
// render the same empty game first.

import { isPrime } from './numbers';
import { silent, type Sounds } from './sound';
import {
	TIERS,
	applyBoard,
	freshPlay,
	isComplete,
	isKnown,
	makeBoard,
	parseProgress,
	scoreBoard,
	tapNumber,
	tierPrimes,
	unlockedTiers,
	type BoardPlay,
	type BoardResult,
	type Progress,
	type Random,
	type Tier
} from './primeHunt';

export const PROGRESS_KEY = 'prime-hunt-progress';
export const MUTED_KEY = 'prime-hunt-muted';

/** Where progress and the sound setting are kept. Both calls may throw (blocked storage); the game carries on. */
export interface PrimeHuntStorage {
	read(key: string): string | null;
	write(key: string, value: string): void;
}

const browserStorage: PrimeHuntStorage = {
	read: (key) => localStorage.getItem(key),
	write: (key, value) => localStorage.setItem(key, value)
};

export interface PrimeHuntOptions {
	rng?: Random;
	storage?: PrimeHuntStorage;
	/** What plays on a tap. Silent unless the page passes real sounds. */
	sounds?: Sounds;
}

class PrimeHuntGame {
	#rng: Random;
	#storage: PrimeHuntStorage;
	#sounds: Sounds;

	/** Per prime: on how many Boards it has been found cleanly. */
	progress = $state<Progress>({});
	/** The tier being played, as its largest number. */
	tier = $state<Tier>(TIERS[0]);
	/** The Board's numbers; empty until `start()`. */
	board = $state<number[]>([]);
	/** What has been tapped on this Board so far. */
	play = $state<BoardPlay>(freshPlay());
	/** The score, once the last prime is found; null while the Board is in play. */
	result = $state<BoardResult | null>(null);
	/** The non-prime tapped last, until the next prime is found; the page explains it. */
	lastWrong = $state<number | null>(null);
	/** Perfect Boards in a row this visit. */
	streak = $state(0);
	/** The tier this Board just unlocked, until the next Board is dealt. */
	justUnlocked = $state<Tier | null>(null);
	/** Whether the sounds are off. */
	muted = $state(false);

	constructor({ rng = Math.random, storage = browserStorage, sounds = silent }: PrimeHuntOptions) {
		this.#rng = rng;
		this.#storage = storage;
		this.#sounds = sounds;
	}

	/** Primes found on this Board, in the order tapped. */
	readonly found = $derived(this.play.found);
	/** Non-primes tapped by mistake on this Board. */
	readonly wrong = $derived(this.play.wrong);
	/** The tiers the student may play. */
	readonly unlocked = $derived(unlockedTiers(this.progress));
	/** Primes in the current tier. */
	readonly tierTotal = $derived(tierPrimes(this.tier).length);
	/** Primes in the current tier the student already knows. */
	readonly knownCount = $derived(
		tierPrimes(this.tier).filter((p) => isKnown(this.progress, p)).length
	);
	/** Primes on the current Board. */
	readonly primesOnBoard = $derived(this.board.filter(isPrime).length);
	/** Primes still to find on this Board. */
	readonly left = $derived(this.primesOnBoard - this.play.found.length);
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
		const { play, outcome } = tapNumber(this.board, this.play, n);
		if (outcome === 'ignored') return;
		this.play = play;
		if (outcome === 'found') {
			this.lastWrong = null;
			this.#sound((s) => s.success(play.found.length - 1));
		} else {
			this.lastWrong = n;
			this.#sound((s) => s.wrong());
		}
		if (isComplete(this.board, play)) this.#finish();
	}

	next() {
		this.#deal();
	}

	/** Switches tier and deals a Board from it; a locked tier is ignored. */
	selectTier(max: Tier) {
		if (!this.unlocked.includes(max) || max === this.tier) return;
		this.tier = max;
		this.#deal();
	}

	toggleMute() {
		this.muted = !this.muted;
		this.#save(MUTED_KEY, this.muted ? '1' : '0');
	}

	#finish() {
		const result = scoreBoard(this.play.wrong.length);
		const before = unlockedTiers(this.progress);
		this.progress = applyBoard(this.progress, this.play.clean);
		this.result = result;
		this.streak = result.stars === 3 ? this.streak + 1 : 0;
		this.justUnlocked = unlockedTiers(this.progress).find((t) => !before.includes(t)) ?? null;
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
		this.board = makeBoard(this.tier, this.progress, this.#rng);
		this.play = freshPlay();
		this.result = null;
		this.lastWrong = null;
		this.justUnlocked = null;
	}
}

export type StartedPrimeHunt = PrimeHuntGame;

/** Starts a Prime Hunt game; call `start()` once mounted. */
export function startPrimeHunt(options: PrimeHuntOptions = {}): StartedPrimeHunt {
	return new PrimeHuntGame(options);
}
