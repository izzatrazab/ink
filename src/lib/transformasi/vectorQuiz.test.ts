import { describe, it, expect } from 'vitest';
import { translate, translationVector, type Shape, type Vector } from './geometry';
import {
	correctAnswer,
	initialState,
	submitAnswer,
	isCorrect,
	pairs,
	type VectorQuizPair
} from './vectorQuiz';

// The generic deck-walking (stepping, commit-is-final, reset-on-advance,
// stop-at-last) is covered once in latihan.test.ts. This suite tests only what
// Section 11.2 supplies to that machine: the vector answer derived from the two
// figures (never authored), and that a committed vector is judged by value, not
// identity (structural equality).

const objek: Shape = {
	points: [
		{ x: 0, y: 0 },
		{ x: 2, y: 1 },
		{ x: 1, y: -2 }
	]
};
const vA: Vector = { dx: 3, dy: -1 };
const pairA: VectorQuizPair = { objek, imej: translate(objek, vA) };

describe('correctAnswer', () => {
	it('derives the vector that maps the Object onto the Image', () => {
		expect(correctAnswer(pairA)).toEqual(vA);
	});

	it('matches the figures for every authored pair (answer is never authored)', () => {
		for (const p of pairs) {
			// The derived answer, applied to the Object, must reproduce the Image.
			expect(translate(p.objek, correctAnswer(p))).toEqual(p.imej);
			// And it equals the vector read straight off the two figures.
			expect(correctAnswer(p)).toEqual(translationVector(p.objek, p.imej));
		}
	});
});

describe('isCorrect (structural Vector equality)', () => {
	it('is true for a distinct Vector object with the same dx/dy', () => {
		// A fresh object, equal by value — an identity comparison would miss this.
		const committed = { dx: vA.dx, dy: vA.dy };
		expect(isCorrect(submitAnswer(initialState([pairA]), committed))).toBe(true);
	});

	it('is false for any other vector', () => {
		expect(isCorrect(submitAnswer(initialState([pairA]), { dx: vA.dx + 1, dy: vA.dy }))).toBe(
			false
		);
	});
});
