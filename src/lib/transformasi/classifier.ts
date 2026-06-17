// The congruency classifier for Section 11.1: authored content specialising the
// shared Latihan deck-walker. It imports only the geometry types and latihan.ts,
// so it stays independently testable (the page wires it to Svelte runes).
//
// Per the PRD the authored pairs are trusted — there is no `classifyRelationship`
// validator. `correctAnswer` derives the verdict from the authored relationship
// so a pair's answer can never drift from its kind. The interaction itself — step,
// commit, reveal, advance — is the generic latihan machine; this Section supplies
// only what differs: that verdict derivation, and that the slide-to-overlay "why"
// plays only for congruent pairs (a non-congruent pair shows no slide today; see
// CONTEXT.md's flagged ambiguity on whether the visible mismatch should also play).

import type { Shape } from './geometry';
import { createLatihan, type LatihanState } from './latihan';

/** How a comparand figure relates to its object. */
export type Relationship = 'congruent' | 'different-size' | 'different-shape';

/** The two verdicts a student can commit to. */
export type Answer = 'kongruen' | 'tak-kongruen';

/** One authored exercise: an object, a comparand, its kind, and the Malay "why". */
export interface ClassifierPair {
	/** The original figure (objek). */
	objek: Shape;
	/** The figure being compared against the object (rajah pembanding). */
	banding: Shape;
	relationship: Relationship;
	/** Malay sentence shown as feedback after the student answers. */
	explanation: string;
}

/** The verdict that is correct for a pair — derived, never authored separately. */
export function correctAnswer(pair: ClassifierPair): Answer {
	return pair.relationship === 'congruent' ? 'kongruen' : 'tak-kongruen';
}

/** A snapshot of the exercise: which pair, the committed answer, the "why" overlay. */
export type ClassifierState = LatihanState<ClassifierPair, Answer>;

const machine = createLatihan<ClassifierPair, Answer>({
	correctAnswer,
	// Verdicts are string enums, so the default `===` comparison is exactly right;
	// the only Section-specific rule is that the "why" plays for congruent pairs.
	revealsWhy: (pair) => pair.relationship === 'congruent'
});

export const { initialState, currentPair, isAnswered, isCorrect, isLast, submitAnswer, nextPair } =
	machine;

// Authored deck — four clean cases: two congruent (same orientation, only
// translated apart), one different-size (similar, not congruent), one
// different-shape. Congruent comparands are exact translates of the object so the
// translation-only slide-to-overlay always lines them up and tells the truth.
export const pairs: ClassifierPair[] = [
	{
		objek: {
			points: [
				{ x: 15, y: 25 },
				{ x: 55, y: 30 },
				{ x: 48, y: 65 },
				{ x: 18, y: 60 }
			]
		},
		banding: {
			points: [
				{ x: 135, y: 30 },
				{ x: 175, y: 35 },
				{ x: 168, y: 70 },
				{ x: 138, y: 65 }
			]
		},
		relationship: 'congruent',
		explanation:
			'Kongruen. Kedua-dua rajah mempunyai bentuk dan saiz yang sama — imej hanya beralih kedudukan. Perhatikan ia bertindih dengan tepat.'
	},
	{
		objek: {
			points: [
				{ x: 20, y: 30 },
				{ x: 60, y: 20 },
				{ x: 50, y: 70 }
			]
		},
		banding: {
			points: [
				{ x: 130, y: 40 },
				{ x: 170, y: 30 },
				{ x: 160, y: 80 }
			]
		},
		relationship: 'congruent',
		explanation:
			'Kongruen. Sebuah segi tiga dan salinannya yang hanya dialihkan — bentuk dan saiznya serupa, maka ia bertindih dengan sempurna.'
	},
	{
		objek: {
			points: [
				{ x: 20, y: 30 },
				{ x: 60, y: 30 },
				{ x: 60, y: 70 },
				{ x: 20, y: 70 }
			]
		},
		banding: {
			points: [
				{ x: 120, y: 20 },
				{ x: 180, y: 20 },
				{ x: 180, y: 80 },
				{ x: 120, y: 80 }
			]
		},
		relationship: 'different-size',
		explanation:
			'Tidak kongruen. Kedua-dua rajah berbentuk segi empat sama, tetapi saiznya berbeza — ia serupa, bukan kongruen.'
	},
	{
		objek: {
			points: [
				{ x: 20, y: 30 },
				{ x: 60, y: 30 },
				{ x: 60, y: 70 },
				{ x: 20, y: 70 }
			]
		},
		banding: {
			points: [
				{ x: 130, y: 30 },
				{ x: 175, y: 50 },
				{ x: 130, y: 75 }
			]
		},
		relationship: 'different-shape',
		explanation:
			'Tidak kongruen. Bentuk kedua-dua rajah berbeza — satu segi empat dan satu segi tiga — maka ia tidak mungkin kongruen.'
	}
];
