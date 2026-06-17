import { describe, it, expect } from 'vitest';
import type { Shape } from './geometry';
import {
	correctAnswer,
	initialState,
	submitAnswer,
	nextPair,
	type ClassifierPair
} from './classifier';

// The generic deck-walking (stepping, commit-is-final, reset-on-advance,
// stop-at-last) is covered once in latihan.test.ts. This suite tests only what
// Section 11.1 supplies to that machine: how a verdict is derived from a pair's
// authored relationship, and that the slide-to-overlay "why" plays for — and only
// for — congruent pairs.

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

describe('the "why" overlay (revealsWhy wiring)', () => {
	it('plays only when the current pair is congruent', () => {
		expect(submitAnswer(initialState(deck), 'kongruen').overlayPlaying).toBe(true);
		// jump to the different-size pair and answer it
		const onSize = nextPair(submitAnswer(initialState(deck), 'kongruen'));
		expect(submitAnswer(onSize, 'tak-kongruen').overlayPlaying).toBe(false);
	});

	it('plays for a congruent pair even when the student answered it wrongly', () => {
		// keys off the pair, not the answer — the visual "why" is shown regardless.
		expect(submitAnswer(initialState(deck), 'tak-kongruen').overlayPlaying).toBe(true);
	});
});
