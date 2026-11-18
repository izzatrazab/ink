// The find-the-vector exercise for Section 11.2: authored figure pairs
// specialising the shared Latihan deck-walker. It mirrors classifier.ts and
// imports only the geometry seam and latihan.ts, so it stays independently
// testable (the page wires it to Svelte runes).
//
// The reverse of the Explorable: shown an Object and its Image, the student must
// name the Translation vector that maps one onto the other. The correct answer
// is *derived* from the two figures via translationVector — never authored — so
// it can never drift from what is drawn. Authoring each Image as a true
// translate of its Object keeps that guarantee honest: the slide-to-overlay
// "why" lines them up exactly because the pair really is a translation. This
// Section supplies the machine only its differences: the derived vector answer,
// and structural Vector equality (an answer is correct by its dx/dy, not its
// identity). The "why" always plays, since every authored pair is a true
// translation, so the latihan's default revealsWhy is left as-is.

import { translate, translationVector, type Shape, type Vector } from './geometry';
import type { StartLatihanConfig } from './latihan.svelte';

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

/** What Section 11.2 supplies to the Latihan deck-walker: the derived vector
 *  answer, structural equality, and the zero vector the stepper starts at on
 *  every pair. The Reveal always plays, so `revealsWhy` keeps its default. */
export const latihanConfig = {
	correctAnswer,
	answersEqual: vectorsEqual,
	blank: { dx: 0, dy: 0 }
} satisfies StartLatihanConfig<VectorQuizPair, Vector>;

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
