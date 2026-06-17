import { describe, it, expect } from 'vitest';
import { translate, translationVector, type Shape, type Vector } from './geometry';
import {
	correctAnswer,
	initialState,
	submitAnswer,
	nextPair,
	currentPair,
	isAnswered,
	isCorrect,
	isLast,
	pairs,
	type VectorQuizPair
} from './vectorQuiz';

// A small object and two distinct translations of it, enough to build a deck the
// state machine can step through. The Image is always a true translate, so the
// derived answer is exactly the authoring vector.
const objek: Shape = {
	points: [
		{ x: 0, y: 0 },
		{ x: 2, y: 1 },
		{ x: 1, y: -2 }
	]
};
const vA: Vector = { dx: 3, dy: -1 };
const vB: Vector = { dx: -2, dy: 4 };

const pairA: VectorQuizPair = { objek, imej: translate(objek, vA) };
const pairB: VectorQuizPair = { objek, imej: translate(objek, vB) };
const deck: VectorQuizPair[] = [pairA, pairB];

describe('correctAnswer', () => {
	it('derives the vector that maps the Object onto the Image', () => {
		expect(correctAnswer(pairA)).toEqual(vA);
		expect(correctAnswer(pairB)).toEqual(vB);
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

describe('initialState', () => {
	it('starts on the first pair, unanswered, with no overlay playing', () => {
		const s = initialState(deck);
		expect(s.index).toBe(0);
		expect(s.committed).toBeNull();
		expect(s.overlayPlaying).toBe(false);
		expect(isAnswered(s)).toBe(false);
		expect(currentPair(s)).toBe(pairA);
	});
});

describe('submitAnswer', () => {
	it('commits the vector and starts the "why" slide', () => {
		const s = submitAnswer(initialState(deck), vA);
		expect(s.committed).toEqual(vA);
		expect(s.overlayPlaying).toBe(true);
		expect(isAnswered(s)).toBe(true);
	});

	it('is final: a second submission is ignored', () => {
		const answered = submitAnswer(initialState(deck), vA);
		expect(submitAnswer(answered, { dx: 99, dy: 99 })).toBe(answered);
	});
});

describe('isCorrect', () => {
	it('is true when the committed vector equals the derived answer', () => {
		expect(isCorrect(submitAnswer(initialState(deck), vA))).toBe(true);
	});

	it('is false for any other vector', () => {
		expect(isCorrect(submitAnswer(initialState(deck), { dx: vA.dx + 1, dy: vA.dy }))).toBe(false);
		expect(isCorrect(submitAnswer(initialState(deck), { dx: 0, dy: 0 }))).toBe(false);
	});

	it('is false before a vector is committed', () => {
		expect(isCorrect(initialState(deck))).toBe(false);
	});
});

describe('nextPair', () => {
	it('advances and resets the committed vector + overlay', () => {
		const s = nextPair(submitAnswer(initialState(deck), vA));
		expect(s.index).toBe(1);
		expect(s.committed).toBeNull();
		expect(s.overlayPlaying).toBe(false);
		expect(currentPair(s)).toBe(pairB);
	});

	it('does nothing until the current pair is answered', () => {
		const s = initialState(deck);
		expect(nextPair(s)).toBe(s);
	});

	it('does not advance past the last pair', () => {
		let s = initialState(deck);
		s = nextPair(submitAnswer(s, vA)); // -> 1 (last)
		expect(isLast(s)).toBe(true);
		const answeredLast = submitAnswer(s, vB);
		expect(nextPair(answeredLast)).toBe(answeredLast);
	});
});

describe('isLast', () => {
	it('is true only on the final pair', () => {
		let s = initialState(deck);
		expect(isLast(s)).toBe(false);
		s = nextPair(submitAnswer(s, vA));
		expect(isLast(s)).toBe(true);
	});
});
