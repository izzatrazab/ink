// The rules of Prime Hunt, Chapter 2's first Mini-game: pure functions over
// whole numbers, framework-free and deterministic once given a random function.
// A Board is 16 numbers from a Prime tier; the student taps the primes and each
// tap is judged at once, with the verdict derived from the number seam (isPrime), never authored.
// Progress is a count per prime: on how many Boards it was found cleanly, i.e.
// before any mistake on that Board.

import { isPrime } from './numbers';

/** The Prime tiers, as the largest number in each: 2–20, 2–50, 2–100. */
export const TIERS = [20, 50, 100] as const;
export type Tier = (typeof TIERS)[number];

export const BOARD_SIZE = 16;
/** Primes on a Board. */
const PRIMES_PER_BOARD = 6;
/** Look-alikes (odd composites that pass for prime) on a Board, when the tier has them. */
const LOOKALIKES_PER_BOARD = 3;
/** Chance that a Board carries the number 1, the classic "is it prime?" trap. */
const ONE_CHANCE = 0.25;
/** Boards a prime must be found cleanly on to count as known. */
export const KNOWN_STREAK = 2;

/** Pass `Math.random` in play; tests pass something deterministic. */
export type Random = () => number;

/** Per prime: on how many Boards it has been found cleanly. Absent means 0. */
export type Progress = Record<number, number>;

/** The primes up to and including `max`, ascending. */
export function tierPrimes(max: number): number[] {
	const result: number[] = [];
	for (let n = 2; n <= max; n++) if (isPrime(n)) result.push(n);
	return result;
}

/** Odd composites up to `max` that do not end in 5 — the ones that pass for prime (51, 57, 87, 91). */
export function lookAlikes(max: number): number[] {
	const result: number[] = [];
	for (let n = 9; n <= max; n += 2) if (n % 5 !== 0 && !isPrime(n)) result.push(n);
	return result;
}

/** Everything else a Board can show: composites that are neither look-alikes nor 1. */
function plainComposites(max: number): number[] {
	const trick = new Set(lookAlikes(max));
	const result: number[] = [];
	for (let n = 4; n <= max; n++) if (!isPrime(n) && !trick.has(n)) result.push(n);
	return result;
}

function shuffle<T>(items: T[], rng: Random): T[] {
	const a = [...items];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/** How likely a prime is to be drawn: shaky primes (run of 0) come up three times as often as known ones. */
const weightOf = (progress: Progress, p: number) => Math.max(1, 3 - (progress[p] ?? 0));

/** `count` distinct items, drawn without replacement with the given weights. */
function drawWeighted(items: number[], count: number, weight: (n: number) => number, rng: Random) {
	const pool = [...items];
	const picked: number[] = [];
	while (picked.length < count && pool.length > 0) {
		const total = pool.reduce((sum, n) => sum + weight(n), 0);
		let r = rng() * total;
		let i = 0;
		while (i < pool.length - 1 && r >= weight(pool[i])) r -= weight(pool[i++]);
		picked.push(...pool.splice(i, 1));
	}
	return picked;
}

/**
 * A Board for a tier: six primes (favouring those not yet known), three
 * look-alikes, plain composites to fill, and 1 about one board in four.
 * The first draw from `rng` decides whether 1 appears.
 */
export function makeBoard(max: number, progress: Progress, rng: Random): number[] {
	const withOne = rng() < ONE_CHANCE;
	const uniform = () => 1;
	const primes = drawWeighted(tierPrimes(max), PRIMES_PER_BOARD, (p) => weightOf(progress, p), rng);
	const tricks = drawWeighted(lookAlikes(max), LOOKALIKES_PER_BOARD, uniform, rng);
	const chosen = [...primes, ...tricks, ...(withOne ? [1] : [])];
	const fill = drawWeighted(plainComposites(max), BOARD_SIZE - chosen.length, uniform, rng);
	return shuffle([...chosen, ...fill], rng);
}

/** One Board as it is being played: what the student has tapped so far. */
export interface BoardPlay {
	/** Primes found, in the order tapped. */
	found: number[];
	/** Non-primes tapped by mistake, in the order tapped. */
	wrong: number[];
	/** The primes found while the Board was still mistake-free: the only finds that count toward Progress. */
	clean: number[];
}

export const freshPlay = (): BoardPlay => ({ found: [], wrong: [], clean: [] });

export type TapOutcome = 'found' | 'wrong' | 'ignored';

/**
 * Judges one tap on the Board, straight away. A prime is found, a non-prime
 * (including 1) is wrong; a number already tapped, or not on the Board, is ignored.
 * A find is clean only if no mistake came before it, so tapping at random cannot
 * earn a prime its place in Progress.
 */
export function tapNumber(
	board: number[],
	play: BoardPlay,
	n: number
): { play: BoardPlay; outcome: TapOutcome } {
	if (!board.includes(n) || play.found.includes(n) || play.wrong.includes(n)) {
		return { play, outcome: 'ignored' };
	}
	if (!isPrime(n)) return { play: { ...play, wrong: [...play.wrong, n] }, outcome: 'wrong' };
	return {
		play: {
			...play,
			found: [...play.found, n],
			clean: play.wrong.length === 0 ? [...play.clean, n] : play.clean
		},
		outcome: 'found'
	};
}

/** A Board is complete once every prime on it has been found. */
export const isComplete = (board: number[], play: BoardPlay) =>
	play.found.length === board.filter(isPrime).length;

export interface BoardResult {
	/** Non-primes tapped by mistake. */
	mistakes: number;
	/** 3 for a perfect Board, 2 for one slip, 1 for more. */
	stars: 1 | 2 | 3;
}

/** The stars for a finished Board, from its mistakes. */
export function scoreBoard(mistakes: number): BoardResult {
	return { mistakes, stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1 };
}

export type Witness = { kind: 'one' } | { kind: 'prime' } | { kind: 'pair'; a: number; b: number };

/** Why `n` is or is not prime: 1 has one factor, a prime has two, a composite splits as a × b. */
export function witness(n: number): Witness {
	if (n === 1) return { kind: 'one' };
	if (isPrime(n)) return { kind: 'prime' };
	let a = 2;
	while (n % a !== 0) a++;
	return { kind: 'pair', a, b: n / a };
}

/** Progress after a finished Board: every clean find goes up by one. */
export function applyBoard(progress: Progress, cleanFinds: number[]): Progress {
	const next = { ...progress };
	for (const n of cleanFinds) next[n] = (next[n] ?? 0) + 1;
	return next;
}

export const isKnown = (progress: Progress, p: number) => (progress[p] ?? 0) >= KNOWN_STREAK;

/** A tier is mastered when every prime in it is known. */
export const tierMastered = (progress: Progress, max: number) =>
	tierPrimes(max).every((p) => isKnown(progress, p));

/** The tiers the student may play: the first, and each one after a mastered tier. */
export function unlockedTiers(progress: Progress): Tier[] {
	const open: Tier[] = [];
	for (const [i, max] of TIERS.entries()) {
		if (i === 0 || tierMastered(progress, TIERS[i - 1])) open.push(max);
		else break;
	}
	return open;
}

/** Reads saved progress, dropping anything that is not a prime with a whole, non-negative run. */
export function parseProgress(raw: string | null): Progress {
	if (!raw) return {};
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		return {};
	}
	if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
	const progress: Progress = {};
	for (const [key, value] of Object.entries(data)) {
		const n = Number(key);
		if (
			n <= TIERS[TIERS.length - 1] &&
			isPrime(n) &&
			Number.isInteger(value) &&
			(value as number) >= 0
		)
			progress[n] = value as number;
	}
	return progress;
}
