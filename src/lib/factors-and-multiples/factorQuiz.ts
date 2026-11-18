// The "is it a factor?" exercise for Section 2.1: authored pairs specialising
// the shared Latihan deck-walker. A pair is a number of tiles and a row size;
// the student says whether the row size is a factor. The correct verdict is
// *derived* from the pair via the number seam (isFactor), never authored, so
// the Reveal — the tiles arranging themselves into rows of that size — always
// agrees with it. Answers are committed directly (yes/no), so there is no draft.

import { isFactor } from './numbers';
import type { LatihanConfig } from '$lib/transformasi/latihan';

/** One authored exercise: is `size` a factor of `total`? */
export interface FactorQuizPair {
	total: number;
	size: number;
}

/** The correct verdict for a pair — derived, never authored. */
export function correctAnswer(pair: FactorQuizPair): boolean {
	return isFactor(pair.total, pair.size);
}

/** What Section 2.1 supplies to the deck-walker: the derived verdict. Answers
 *  compare with `===` and the Reveal always plays, so those defaults stay. */
export const latihanConfig = {
	correctAnswer
} satisfies LatihanConfig<FactorQuizPair, boolean>;

// Mixed yes/no, with 1 as a factor of everything at the end.
export const pairs: FactorQuizPair[] = [
	{ total: 12, size: 4 },
	{ total: 15, size: 4 },
	{ total: 18, size: 6 },
	{ total: 20, size: 8 },
	{ total: 24, size: 8 },
	{ total: 17, size: 1 }
];
