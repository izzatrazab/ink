// The rules of Prime Breaker, Chapter 2's second Mini-game: pure functions,
// framework-free and deterministic once given a random function. A Round is a
// Division ladder to finish — a start row the student breaks down by tapping
// primes — in one of three Break kinds (prime factors, HCF, LCM). Every tap is
// judged at once by the ladder's own rules (ladder.ts), so the game cannot
// disagree with the lesson. Progress is a count per kind: Rounds finished with no
// mistake. Reuses the ladder seam; adds only the dealing, scoring and unlocking.

import { kindProgress } from './kindProgress';
import { hcf, lcm } from './numbers';
import { tryDivisor, type LadderMode, type Rejection } from './ladder';

/** The kinds of Round, in the order they unlock. A kind is a ladder mode. */
export const KINDS = ['single', 'hcf', 'lcm'] as const satisfies readonly LadderMode[];
export type Kind = (typeof KINDS)[number];

/** The primes offered as buttons — every divisor a dealt Round can need. */
export const DIVISORS = [2, 3, 5, 7, 11, 13] as const;

/** The primes offered when the student breaks their own number: every prime up to 31. */
export const OWN_DIVISORS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31] as const;

/** The longest own number accepted, so a ladder stays a few rungs. */
export const MAX_OWN = 9999;

/** Big numbers made only of the offered primes, dealt now and then as a boss Round. */
export const BOSSES = [1001, 1024, 1155, 1260, 1296, 1716, 2310, 2520, 3003, 5005] as const;
/** How often a prime-factors Round is a boss. */
const BOSS_CHANCE = 0.1;

/** Whether a start row is one of the bosses. */
export const isBoss = (row: number[]) =>
	row.length === 1 && (BOSSES as readonly number[]).includes(row[0]);

/**
 * Reads the student's own number: a whole number from 2 to 9999 whose prime
 * factors are all offered (31 or smaller), or null. Anything else cannot be
 * broken with the buttons, so it is refused rather than left unfinishable.
 */
export function ownNumber(text: string): number | null {
	const s = text.trim();
	if (!/^\d+$/.test(s)) return null;
	let n = Number(s);
	if (n < 2 || n > MAX_OWN) return null;
	for (const p of OWN_DIVISORS) while (n % p === 0) n /= p;
	return n === 1 ? Number(s) : null;
}

/** Rounds a kind must be finished cleanly (no mistake) to count as mastered. */
export const MASTERED_ROUNDS = 3;

/** Pass `Math.random` in play; tests pass something deterministic. */
export type Random = () => number;

/** Per kind: how many Rounds were finished with no mistake. Absent means 0. */
export type Progress = Partial<Record<Kind, number>>;

const pick = <T>(items: readonly T[], rng: Random): T => items[Math.floor(rng() * items.length)];
const between = (lo: number, hi: number, rng: Random) => lo + Math.floor(rng() * (hi - lo + 1));
const product = (ns: number[]) => ns.reduce((a, b) => a * b, 1);

/** A number built from `count` primes drawn from `pool` (so only offered divisors are needed). */
function built(count: number, pool: readonly number[], rng: Random): number {
	return product(Array.from({ length: count }, () => pick(pool, rng)));
}

const SMALL = [2, 3, 5, 7] as const;

/** A Round's start row for a kind. `avoid` is the previous Round's row, never repeated. */
export function makeRound(kind: Kind, rng: Random, avoid: number[] = []): number[] {
	if (kind === 'single' && rng() < BOSS_CHANCE) {
		const boss = pick(BOSSES, rng);
		if (avoid.length !== 1 || avoid[0] !== boss) return [boss];
	}
	const same = (row: number[]) =>
		row.length === avoid.length && row.every((n, i) => n === avoid[i]);
	for (let attempt = 0; attempt < 200; attempt++) {
		const row = draw(kind, rng);
		if (row && !same(row)) return row;
	}
	return draw(kind, () => 0.5) ?? [60];
}

function draw(kind: Kind, rng: Random): number[] | null {
	if (kind === 'single') {
		// Three to five prime factors; 11 and 13 only now and then, so the long rungs are rare.
		const pool = rng() < 0.3 ? [...SMALL, 11, 13] : SMALL;
		const n = built(between(3, 5, rng), pool, rng);
		return n >= 12 && n <= 500 ? [n] : null;
	}
	if (kind === 'hcf') {
		// A shared part g, times parts that share nothing else: the HCF is exactly g.
		const g = built(between(1, 2, rng), SMALL, rng);
		const count = rng() < 0.25 ? 3 : 2;
		const row = Array.from({ length: count }, () => g * built(between(0, 2, rng), DIVISORS, rng));
		if (new Set(row).size !== count || hcf(row) !== g) return null;
		return row.every((n) => n <= 400) ? row.sort((a, b) => a - b) : null;
	}
	const count = rng() < 0.25 ? 3 : 2;
	const row = Array.from({ length: count }, () => built(between(1, 3, rng), SMALL, rng));
	if (new Set(row).size !== count || row.some((n) => n < 4 || n > 60)) return null;
	// Skip a pair where one simply divides the other (6 and 12): too easy to be a Round.
	if (row.some((a) => row.some((b) => a !== b && b % a === 0))) return null;
	return lcm(row) <= 600 ? row.sort((a, b) => a - b) : null;
}

/** One Round as it is being played. */
export interface RoundPlay {
	/** The primes accepted so far, in order — the ladder's whole progress. */
	divisors: number[];
	/** Refusals, each the divisor tried and the number of rungs it was tried on. */
	mistakes: { d: number; rung: number }[];
}

export const freshPlay = (): RoundPlay => ({ divisors: [], mistakes: [] });

export type TapOutcome =
	| { outcome: 'accepted'; play: RoundPlay; next: number[] }
	| { outcome: 'refused'; play: RoundPlay; rejection: Rejection }
	| { outcome: 'ignored'; play: RoundPlay };

/**
 * Judges one tap on the current row, straight away, by the ladder's rules. An
 * accepted prime adds a rung; a refused one costs a mistake. Tapping the same
 * refused prime again on the same rung is ignored, so a slip is counted once.
 */
export function tapDivisor(row: number[], play: RoundPlay, d: number, kind: Kind): TapOutcome {
	const rung = play.divisors.length;
	if (play.mistakes.some((m) => m.d === d && m.rung === rung)) return { outcome: 'ignored', play };
	const result = tryDivisor(row, d, kind);
	if (result.ok) {
		return {
			outcome: 'accepted',
			play: { ...play, divisors: [...play.divisors, d] },
			next: result.next
		};
	}
	return {
		outcome: 'refused',
		play: { ...play, mistakes: [...play.mistakes, { d, rung }] },
		rejection: result.rejection
	};
}

export interface RoundResult {
	mistakes: number;
	/** 3 for a perfect Round, 2 for one slip, 1 for more. */
	stars: 1 | 2 | 3;
}

export function scoreRound(mistakes: number): RoundResult {
	return { mistakes, stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1 };
}

const kinds = kindProgress(KINDS, MASTERED_ROUNDS);

/** Progress after a finished Round: only a mistake-free one counts. */
export const applyRound = (progress: Progress, kind: Kind, mistakes: number): Progress =>
	kinds.apply(progress, kind, mistakes);

export const isMastered = kinds.isMastered;

/** The kinds the student may play: the first, and each one after a mastered kind. */
export const unlockedKinds = kinds.unlocked;

/** Reads saved progress, dropping anything that is not a known kind with a whole, non-negative count. */
export const parseProgress = kinds.parse;
