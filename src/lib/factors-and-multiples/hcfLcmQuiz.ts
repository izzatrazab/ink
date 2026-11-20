// The "HCF or LCM?" exercise for Section 2.3: authored word problems
// specialising the shared Latihan deck-walker. A pair is a problem's numbers and
// which question it really asks. The story text lives in the Chapter copy (keyed
// by `key`, so it follows the language toggle); the *result* is derived through
// the number seam, never authored, so the feedback and the ladders always agree.
// Answers are 'hcf' or 'lcm', committed directly.

import { hcf, lcm } from './numbers';
import type { LatihanConfig } from '$lib/transformasi/latihan';

export type Kind = 'hcf' | 'lcm';

export type ProblemKey = 'tiles' | 'lights' | 'groups' | 'packs' | 'ribbons' | 'buses';

export interface HcfLcmPair {
	key: ProblemKey;
	numbers: number[];
	/** What the problem is really asking — splitting (hcf) or waiting (lcm). */
	kind: Kind;
}

/** The correct verdict for a pair. */
export function correctAnswer(pair: HcfLcmPair): Kind {
	return pair.kind;
}

/** The number the problem asks for — derived from the numbers. */
export function result(pair: HcfLcmPair): number {
	return pair.kind === 'hcf' ? hcf(pair.numbers) : lcm(pair.numbers);
}

export const latihanConfig = {
	correctAnswer
} satisfies LatihanConfig<HcfLcmPair, Kind>;

// Three splitting, three waiting, interleaved so no pattern gives it away.
export const pairs: HcfLcmPair[] = [
	{ key: 'tiles', numbers: [48, 72], kind: 'hcf' },
	{ key: 'lights', numbers: [15, 20], kind: 'lcm' },
	{ key: 'groups', numbers: [36, 45], kind: 'hcf' },
	{ key: 'packs', numbers: [6, 8], kind: 'lcm' },
	{ key: 'ribbons', numbers: [40, 56, 72], kind: 'hcf' },
	{ key: 'buses', numbers: [10, 12, 15], kind: 'lcm' }
];
