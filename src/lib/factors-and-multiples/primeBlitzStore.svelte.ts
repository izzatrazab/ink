// The live object behind Prime Blitz (primeBlitz.ts): the clock, the Board in
// play, the score and the personal best. Boards come from Prime Hunt's own rules
// (`makeBoard`, `tapNumber`), so what counts as a prime cannot differ between the
// calm game and the challenge. The clock is the global setInterval, which tests
// fake; storage and sounds are injected. Call `stop()` when the page is destroyed.

import { isPrime } from './numbers';
import { BLITZ_SECONDS, nextScore, parseBest, withBest, type Best } from './primeBlitz';
import {
	freshPlay,
	isComplete,
	makeBoard,
	tapNumber,
	TIERS,
	type BoardPlay,
	type Random,
	type Tier
} from './primeHunt';
import { silent, type Sounds } from './sound';

export const BEST_KEY = 'prime-blitz-best';

export interface PrimeBlitzStorage {
	read(key: string): string | null;
	write(key: string, value: string): void;
}

const browserStorage: PrimeBlitzStorage = {
	read: (key) => localStorage.getItem(key),
	write: (key, value) => localStorage.setItem(key, value)
};

export interface PrimeBlitzOptions {
	rng?: Random;
	storage?: PrimeBlitzStorage;
	sounds?: Sounds;
	/** How long a run lasts; tests shorten it. */
	seconds?: number;
}

class PrimeBlitzGame {
	#rng: Random;
	#storage: PrimeBlitzStorage;
	#sounds: Sounds;
	#seconds: number;
	#timer: ReturnType<typeof setInterval> | undefined;

	tier = $state<Tier>(TIERS[0]);
	board = $state<number[]>([]);
	play = $state<BoardPlay>(freshPlay());
	running = $state(false);
	over = $state(false);
	secondsLeft = $state(0);
	score = $state(0);
	/** Boards cleared this run. */
	cleared = $state(0);
	combo = $state(0);
	bestCombo = $state(0);
	best = $state<Best>({});
	/** Whether the run that just ended set a new best for its tier. */
	isBest = $state(false);
	muted = $state(false);

	constructor({
		rng = Math.random,
		storage = browserStorage,
		sounds = silent,
		seconds = BLITZ_SECONDS
	}: PrimeBlitzOptions) {
		this.#rng = rng;
		this.#storage = storage;
		this.#sounds = sounds;
		this.#seconds = seconds;
		this.secondsLeft = seconds;
	}

	/** The best score for the tier being played. */
	readonly bestHere = $derived(this.best[this.tier] ?? 0);

	/** Loads the saved bests. Call from onMount. */
	load() {
		try {
			this.best = parseBest(this.#storage.read(BEST_KEY));
		} catch {
			// storage blocked — the best just will not persist
		}
	}

	/** Starts a run on `tier`: the clock runs and Boards come until time is up. */
	begin(tier: Tier) {
		this.#halt();
		this.tier = tier;
		this.score = 0;
		this.cleared = 0;
		this.combo = 0;
		this.bestCombo = 0;
		this.isBest = false;
		this.over = false;
		this.secondsLeft = this.#seconds;
		this.running = true;
		this.#deal();
		this.#timer = setInterval(() => this.#tick(), 1000);
	}

	tap(n: number) {
		if (!this.running) return;
		const { play, outcome } = tapNumber(this.board, this.play, n);
		if (outcome === 'ignored') return;
		this.play = play;
		if (outcome === 'found') {
			this.score = nextScore(this.score, 'found');
			this.combo += 1;
			this.bestCombo = Math.max(this.bestCombo, this.combo);
			this.#sound((s) => s.success(this.combo - 1));
			if (isComplete(this.board, play)) {
				this.cleared += 1;
				this.#deal();
			}
		} else {
			this.score = nextScore(this.score, 'wrong');
			this.combo = 0;
			this.#sound((s) => s.wrong());
		}
	}

	/** Ends a run early and leaves the Blitz, e.g. when the reader goes back to the calm game. */
	stop() {
		this.#halt();
		this.running = false;
	}

	toggleMute() {
		this.muted = !this.muted;
	}

	#tick() {
		this.secondsLeft -= 1;
		if (this.secondsLeft > 0) return;
		this.#halt();
		this.running = false;
		this.over = true;
		const next = withBest(this.best, this.tier, this.score);
		this.best = next.best;
		this.isBest = next.isBest;
		if (next.isBest) {
			try {
				this.#storage.write(BEST_KEY, JSON.stringify(this.best));
			} catch {
				// ignore
			}
		}
		this.#sound((s) => s.done());
	}

	#halt() {
		clearInterval(this.#timer);
		this.#timer = undefined;
	}

	#sound(play: (sounds: Sounds) => void) {
		if (!this.muted) play(this.#sounds);
	}

	#deal() {
		this.board = makeBoard(this.tier, {}, this.#rng);
		this.play = freshPlay();
	}

	/** Primes on the Board in play, for the page's "left" count. */
	readonly left = $derived(this.board.filter(isPrime).length - this.play.found.length);
}

export type StartedPrimeBlitz = PrimeBlitzGame;

/** Starts a Prime Blitz game; call `load()` once mounted and `stop()` when destroyed. */
export function startPrimeBlitz(options: PrimeBlitzOptions = {}): StartedPrimeBlitz {
	return new PrimeBlitzGame(options);
}
