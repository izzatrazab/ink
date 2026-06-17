// The find-the-vector exercise for Section 11.2: authored figure pairs plus a
// pure, framework-free interaction state machine. It mirrors classifier.ts and
// imports only the geometry seam, so it stays independently testable (the page
// wires it to Svelte runes).
//
// The reverse of the Explorable: shown an Object and its Image, the student must
// name the Translation vector that maps one onto the other. The correct answer
// is *derived* from the two figures via translationVector — never authored — so
// it can never drift from what is drawn. Authoring each Image as a true
// translate of its Object keeps that guarantee honest: the slide-to-overlay
// "why" lines them up exactly because the pair really is a translation.

import { translate, translationVector, type Shape, type Vector } from './geometry';

/** One authored exercise: an Object and its Image (a true translate of it). */
export interface VectorQuizPair {
	/** The original figure (objek). */
	objek: Shape;
	/** The translated figure (imej) — authored as translate(objek, …). */
	imej: Shape;
}

/** The vector that maps a pair's Object onto its Image — derived, never authored. */
export function correctAnswer(pair: VectorQuizPair): Vector {
	return translationVector(pair.objek, pair.imej);
}

/** Whether two vectors are the same translation. */
function vectorsEqual(a: Vector, b: Vector): boolean {
	return a.dx === b.dx && a.dy === b.dy;
}

/** A snapshot of the exercise: which pair, the committed vector, the "why" overlay. */
export interface VectorQuizState {
	pairs: VectorQuizPair[];
	index: number;
	/** The student's committed vector for the current pair, or null if unanswered. */
	committed: Vector | null;
	/** Whether the slide-to-overlay "why" is currently playing. */
	overlayPlaying: boolean;
}

export function initialState(pairs: VectorQuizPair[]): VectorQuizState {
	return { pairs, index: 0, committed: null, overlayPlaying: false };
}

export function currentPair(state: VectorQuizState): VectorQuizPair {
	return state.pairs[state.index];
}

export function isAnswered(state: VectorQuizState): boolean {
	return state.committed !== null;
}

export function isCorrect(state: VectorQuizState): boolean {
	return state.committed !== null && vectorsEqual(state.committed, correctAnswer(currentPair(state)));
}

export function isLast(state: VectorQuizState): boolean {
	return state.index === state.pairs.length - 1;
}

/**
 * Commits the student's vector for the current pair and starts the "why" slide.
 * A second submission is ignored (the commitment is final). The slide is honest
 * for every pair because each Image is a true translate of its Object.
 */
export function submitAnswer(state: VectorQuizState, vector: Vector): VectorQuizState {
	if (isAnswered(state)) return state;
	return { ...state, committed: vector, overlayPlaying: true };
}

/**
 * Advances to the next pair, resetting the committed vector and the overlay. A
 * no-op until the current pair is answered, and a no-op on the last pair.
 */
export function nextPair(state: VectorQuizState): VectorQuizState {
	if (!isAnswered(state) || isLast(state)) return state;
	return { ...state, index: state.index + 1, committed: null, overlayPlaying: false };
}

/** Builds a pair from an Object and the vector that produces its Image. Authoring
 *  the Image as translate(objek, v) — not a hand-placed second shape — is what
 *  makes correctAnswer === v exactly, with the answer still derived, not stored. */
function pair(objek: Shape, v: Vector): VectorQuizPair {
	return { objek, imej: translate(objek, v) };
}

// Authored deck — three pairs spanning the grid in different directions
// (rightward, up-and-right, and a negative both-axes shift), so the student
// meets a range of vectors. Every Object and Image stays within the −6…+6 grid.
export const pairs: VectorQuizPair[] = [
	pair(
		{
			points: [
				{ x: -5, y: 0 },
				{ x: -2, y: 1 },
				{ x: -3, y: -2 }
			]
		},
		{ dx: 6, dy: 2 }
	),
	pair(
		{
			points: [
				{ x: -2, y: -4 },
				{ x: 1, y: -3 },
				{ x: 0, y: -1 },
				{ x: -3, y: -2 }
			]
		},
		{ dx: 1, dy: 5 }
	),
	pair(
		{
			points: [
				{ x: 3, y: 3 },
				{ x: 5, y: 2 },
				{ x: 4, y: 0 }
			]
		},
		{ dx: -7, dy: -1 }
	)
];
