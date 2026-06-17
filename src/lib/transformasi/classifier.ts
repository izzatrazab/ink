// The congruency classifier for Section 11.1: authored content plus a pure,
// framework-free interaction state machine. It imports only the geometry types,
// so it stays independently testable (the page wires it to Svelte runes).
//
// Per the PRD the authored pairs are trusted — there is no `classifyRelationship`
// validator. `correctAnswer` derives the verdict from the authored relationship
// so a pair's answer can never drift from its kind.

import type { Shape } from './geometry';

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
export interface ClassifierState {
	pairs: ClassifierPair[];
	index: number;
	/** The student's committed answer for the current pair, or null if unanswered. */
	selected: Answer | null;
	/** Whether the slide-to-overlay "why" is currently playing (congruent pairs). */
	overlayPlaying: boolean;
}

export function initialState(pairs: ClassifierPair[]): ClassifierState {
	return { pairs, index: 0, selected: null, overlayPlaying: false };
}

export function currentPair(state: ClassifierState): ClassifierPair {
	return state.pairs[state.index];
}

export function isAnswered(state: ClassifierState): boolean {
	return state.selected !== null;
}

export function isCorrect(state: ClassifierState): boolean {
	return isAnswered(state) && state.selected === correctAnswer(currentPair(state));
}

export function isLast(state: ClassifierState): boolean {
	return state.index === state.pairs.length - 1;
}

/**
 * Commits the student's answer for the current pair. A second answer is ignored
 * (the commitment is final). For congruent pairs the slide-to-overlay starts so
 * the student sees, visually, why "same shape and size, just moved" holds.
 */
export function submitAnswer(state: ClassifierState, answer: Answer): ClassifierState {
	if (isAnswered(state)) return state;
	return {
		...state,
		selected: answer,
		overlayPlaying: currentPair(state).relationship === 'congruent'
	};
}

/**
 * Advances to the next pair, resetting the answer and the overlay. A no-op until
 * the current pair is answered, and a no-op once the last pair is reached.
 */
export function nextPair(state: ClassifierState): ClassifierState {
	if (!isAnswered(state) || isLast(state)) return state;
	return { ...state, index: state.index + 1, selected: null, overlayPlaying: false };
}

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
