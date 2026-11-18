// The "is it a common multiple?" exercise for Section 2.2: authored pairs
// specialising the shared Latihan deck-walker. A pair is a number and the list
// of numbers it is tested against; the student says whether it is a common
// multiple of all of them. The verdict is *derived* via the number seam, never
// authored, so the Reveal (hops landing on — or missing — the number) always
// agrees with it. Answers are yes/no, committed directly.

import { isCommonMultiple, isFactor } from './numbers';
import type { LatihanConfig } from '$lib/transformasi/latihan';

/** One authored exercise: is `n` a common multiple of every number in `of`? */
export interface CommonMultipleQuizPair {
	n: number;
	of: number[];
}

/** The correct verdict for a pair — derived, never authored. */
export function correctAnswer(pair: CommonMultipleQuizPair): boolean {
	return isCommonMultiple(pair.n, pair.of);
}

/** The first number in `of` that does not divide `n`, for the "why" — or undefined if none. */
export function firstMiss(pair: CommonMultipleQuizPair): number | undefined {
	return pair.of.find((d) => !isFactor(pair.n, d));
}

export const latihanConfig = {
	correctAnswer
} satisfies LatihanConfig<CommonMultipleQuizPair, boolean>;

// Two to four numbers each; every n ≤ 72 so it fits the Reveal's lanes.
export const pairs: CommonMultipleQuizPair[] = [
	{ n: 32, of: [2, 8] },
	{ n: 60, of: [5, 15, 24] },
	{ n: 24, of: [6, 8] },
	{ n: 36, of: [8, 12] },
	{ n: 72, of: [8, 9, 18, 24] },
	{ n: 48, of: [6, 8, 12] }
];
