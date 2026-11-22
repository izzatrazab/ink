// The rules of Multiples Hunt, Chapter 2's third Mini-game: pure functions,
// framework-free and deterministic once given a random function. A Board is 16
// numbers; the student taps every multiple of one number, or every COMMON
// multiple of two or three. Each tap is judged at once from the number seam
// (isFactor), never authored. The traps are what teach: in a common-multiple
// Board, many numbers are a multiple of one of the numbers but not all of them.
// Progress is a count per kind: Boards finished with no mistake.

import { isFactor, lcm } from './numbers';

/** The kinds of Board, in the order they unlock: how many numbers to be a multiple of. */
export const KINDS = ['one', 'two', 'three'] as const;
export type Kind = (typeof KINDS)[number];

export const BOARD_SIZE = 16;
/** Boards a kind must be finished cleanly (no mistake) to count as mastered. */
export const MASTERED_BOARDS = 3;

/** Pass `Math.random` in play; tests pass something deterministic. */
export type Random = () => number;

/** Per kind: how many Boards were finished with no mistake. Absent means 0. */
export type Progress = Partial<Record<Kind, number>>;

/** One Board: the numbers the student must be a multiple of, and the 16 on the board. */
export interface Round {
	set: number[];
	board: number[];
}

/** Whether `n` is a multiple of every number in `set`. */
export const isCommon = (set: number[], n: number) => set.every((s) => isFactor(n, s));

const pick = <T>(items: readonly T[], rng: Random): T => items[Math.floor(rng() * items.length)];

function shuffle<T>(items: T[], rng: Random): T[] {
	const a = [...items];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/** `count` distinct items, drawn without replacement with the given weights. */
function draw(items: number[], count: number, weight: (n: number) => number, rng: Random) {
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

const range = (max: number) => Array.from({ length: max - 1 }, (_, i) => i + 2);

/** The numbers a kind is played with. Empty when the draw does not fit (the caller redraws). */
function drawSet(kind: Kind, rng: Random): number[] {
	const digits = range(12).filter((n) => n <= 12);
	if (kind === 'one')
		return [
			pick(
				digits.filter((n) => n <= 9),
				rng
			)
		];
	const count = kind === 'two' ? 2 : 3;
	const set = draw(digits, count, () => 1, rng).sort((a, b) => a - b);
	const common = lcm(set);
	// A set where one number is a multiple of all the rest has nothing to compare.
	if (common === set[set.length - 1]) return [];
	return common <= (kind === 'two' ? 36 : 48) ? set : [];
}

/** The biggest number on a Board: far enough out for several common multiples. */
export function rangeFor(set: number[]): number {
	const common = lcm(set);
	if (set.length === 1) return Math.max(50, set[0] * 8);
	return Math.min(150, Math.max(60, common * 4));
}

/** A Board for a kind. `avoid` is the previous Round's numbers, never repeated. */
export function makeRound(kind: Kind, rng: Random, avoid: number[] = []): Round {
	let set: number[] = [];
	for (let attempt = 0; attempt < 500; attempt++) {
		set = drawSet(kind, rng);
		const repeat = set.length === avoid.length && set.every((n, i) => n === avoid[i]);
		if (set.length > 0 && !repeat && Math.floor(rangeFor(set) / lcm(set)) >= 3) break;
		set = [];
	}
	if (set.length === 0) set = kind === 'one' ? [4] : kind === 'two' ? [4, 6] : [2, 3, 5];

	const max = rangeFor(set);
	const common: number[] = [];
	const partial: number[] = [];
	const plain: number[] = [];
	for (let n = 2; n <= max; n++) {
		if (isCommon(set, n)) common.push(n);
		else if (set.some((s) => isFactor(n, s))) partial.push(n);
		else plain.push(n);
	}
	// A near miss (one off a multiple of a number in the set) is what a wrong guess looks like.
	const near = (n: number) => (set.some((s) => isFactor(n - 1, s) || isFactor(n + 1, s)) ? 3 : 1);
	const uniform = () => 1;

	const hits = draw(common, kind === 'one' ? 6 : 4, uniform, rng);
	const traps = kind === 'one' ? [] : draw(partial, kind === 'two' ? 8 : 7, uniform, rng);
	const fill = draw(plain, BOARD_SIZE - hits.length - traps.length, near, rng);
	return { set, board: shuffle([...hits, ...traps, ...fill], rng) };
}

/** One Board as it is being played: what the student has tapped so far. */
export interface BoardPlay {
	/** Multiples found, in the order tapped. */
	found: number[];
	/** Numbers tapped by mistake, in the order tapped. */
	wrong: number[];
}

export const freshPlay = (): BoardPlay => ({ found: [], wrong: [] });

export type TapOutcome = 'found' | 'wrong' | 'ignored';

/** Judges one tap, straight away. A number already tapped, or not on the Board, is ignored. */
export function tapNumber(
	round: Round,
	play: BoardPlay,
	n: number
): { play: BoardPlay; outcome: TapOutcome } {
	if (!round.board.includes(n) || play.found.includes(n) || play.wrong.includes(n)) {
		return { play, outcome: 'ignored' };
	}
	if (!isCommon(round.set, n))
		return { play: { ...play, wrong: [...play.wrong, n] }, outcome: 'wrong' };
	return { play: { ...play, found: [...play.found, n] }, outcome: 'found' };
}

/** The multiples on a Board: what the student has to find. */
export const multiplesOn = (round: Round) => round.board.filter((n) => isCommon(round.set, n));

/** A Board is complete once every multiple on it has been found. */
export const isComplete = (round: Round, play: BoardPlay) =>
	play.found.length === multiplesOn(round).length;

export interface BoardResult {
	mistakes: number;
	/** 3 for a perfect Board, 2 for one slip, 1 for more. */
	stars: 1 | 2 | 3;
}

export const scoreBoard = (mistakes: number): BoardResult => ({
	mistakes,
	stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1
});

/** Why `n` is not a multiple of the set: the first number it misses, the remainder, and
 *  a number of the set it IS a multiple of (the trap), if any. */
export interface Miss {
	s: number;
	rest: number;
	/** A number in the set that `n` is a multiple of; null when it is a multiple of none. */
	of: number | null;
}

export function miss(set: number[], n: number): Miss | null {
	const s = set.find((x) => !isFactor(n, x));
	if (s === undefined) return null;
	return { s, rest: n % s, of: set.find((x) => isFactor(n, x)) ?? null };
}

/** Progress after a finished Board: only a mistake-free one counts. */
export const applyBoard = (progress: Progress, kind: Kind, mistakes: number): Progress =>
	mistakes === 0 ? { ...progress, [kind]: (progress[kind] ?? 0) + 1 } : progress;

export const isMastered = (progress: Progress, kind: Kind) =>
	(progress[kind] ?? 0) >= MASTERED_BOARDS;

/** The kinds the student may play: the first, and each one after a mastered kind. */
export function unlockedKinds(progress: Progress): Kind[] {
	const open: Kind[] = [];
	for (const [i, kind] of KINDS.entries()) {
		if (i === 0 || isMastered(progress, KINDS[i - 1])) open.push(kind);
		else break;
	}
	return open;
}

/** Reads saved progress, dropping anything that is not a known kind with a whole, non-negative count. */
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
	for (const kind of KINDS) {
		const value = (data as Record<string, unknown>)[kind];
		if (Number.isInteger(value) && (value as number) >= 0) progress[kind] = value as number;
	}
	return progress;
}
