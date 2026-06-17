import { describe, it, expect } from 'vitest';
import type { Shape } from './geometry';
import {
	correctAnswer,
	initialState,
	submitAnswer,
	nextPair,
	currentPair,
	isAnswered,
	isCorrect,
	isLast,
	type ClassifierPair
} from './classifier';

// Minimal stand-in shapes — the state machine never inspects geometry, only the
// authored relationship, so two distinct triangles are enough to build pairs.
const triA: Shape = {
	points: [
		{ x: 0, y: 0 },
		{ x: 10, y: 0 },
		{ x: 5, y: 10 }
	]
};
const triB: Shape = {
	points: [
		{ x: 20, y: 0 },
		{ x: 30, y: 0 },
		{ x: 25, y: 10 }
	]
};

const congruentPair: ClassifierPair = {
	objek: triA,
	banding: triB,
	relationship: 'congruent',
	explanation: 'kongruen.'
};
const sizePair: ClassifierPair = {
	objek: triA,
	banding: triB,
	relationship: 'different-size',
	explanation: 'saiz berbeza.'
};
const shapePair: ClassifierPair = {
	objek: triA,
	banding: triB,
	relationship: 'different-shape',
	explanation: 'bentuk berbeza.'
};

const deck: ClassifierPair[] = [congruentPair, sizePair, shapePair];

describe('correctAnswer', () => {
	it('is kongruen for a congruent pair', () => {
		expect(correctAnswer(congruentPair)).toBe('kongruen');
	});

	it('is tak-kongruen for a different-size pair', () => {
		expect(correctAnswer(sizePair)).toBe('tak-kongruen');
	});

	it('is tak-kongruen for a different-shape pair', () => {
		expect(correctAnswer(shapePair)).toBe('tak-kongruen');
	});
});

describe('initialState', () => {
	it('starts on the first pair, unanswered, with no overlay playing', () => {
		const s = initialState(deck);
		expect(s.index).toBe(0);
		expect(s.selected).toBeNull();
		expect(s.overlayPlaying).toBe(false);
		expect(isAnswered(s)).toBe(false);
		expect(currentPair(s)).toBe(congruentPair);
	});
});

describe('submitAnswer', () => {
	it('records the selected answer', () => {
		const s = submitAnswer(initialState(deck), 'kongruen');
		expect(s.selected).toBe('kongruen');
		expect(isAnswered(s)).toBe(true);
	});

	it('plays the overlay only when the current pair is congruent', () => {
		expect(submitAnswer(initialState(deck), 'kongruen').overlayPlaying).toBe(true);
		// jump to the different-size pair and answer it
		const onSize = nextPair(submitAnswer(initialState(deck), 'kongruen'));
		expect(submitAnswer(onSize, 'tak-kongruen').overlayPlaying).toBe(false);
	});

	it('plays the overlay even when the student answered a congruent pair wrongly', () => {
		expect(submitAnswer(initialState(deck), 'tak-kongruen').overlayPlaying).toBe(true);
	});

	it('is a no-op once the pair has already been answered', () => {
		const answered = submitAnswer(initialState(deck), 'kongruen');
		expect(submitAnswer(answered, 'tak-kongruen')).toBe(answered);
	});
});

describe('isCorrect', () => {
	it('is true when the selected answer matches the pair', () => {
		expect(isCorrect(submitAnswer(initialState(deck), 'kongruen'))).toBe(true);
	});

	it('is false when the selected answer is wrong', () => {
		expect(isCorrect(submitAnswer(initialState(deck), 'tak-kongruen'))).toBe(false);
	});

	it('is false before an answer is given', () => {
		expect(isCorrect(initialState(deck))).toBe(false);
	});
});

describe('nextPair', () => {
	it('advances to the next pair and resets answer + overlay', () => {
		const s = nextPair(submitAnswer(initialState(deck), 'kongruen'));
		expect(s.index).toBe(1);
		expect(s.selected).toBeNull();
		expect(s.overlayPlaying).toBe(false);
		expect(currentPair(s)).toBe(sizePair);
	});

	it('does nothing until the current pair is answered', () => {
		const s = initialState(deck);
		expect(nextPair(s)).toBe(s);
	});

	it('does not advance past the last pair', () => {
		let s = initialState(deck);
		s = nextPair(submitAnswer(s, 'kongruen')); // -> 1
		s = nextPair(submitAnswer(s, 'tak-kongruen')); // -> 2 (last)
		expect(isLast(s)).toBe(true);
		const answeredLast = submitAnswer(s, 'tak-kongruen');
		expect(nextPair(answeredLast)).toBe(answeredLast);
	});
});

describe('isLast', () => {
	it('is true only on the final pair', () => {
		let s = initialState(deck);
		expect(isLast(s)).toBe(false);
		s = nextPair(submitAnswer(s, 'kongruen'));
		expect(isLast(s)).toBe(false);
		s = nextPair(submitAnswer(s, 'tak-kongruen'));
		expect(isLast(s)).toBe(true);
	});
});
