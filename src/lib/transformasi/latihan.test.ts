import { describe, it, expect } from 'vitest';
import { createLatihan } from './latihan';

// The deck-walker is tested through tiny fake pairs and answers — it never
// inspects geometry, only the injected config — so a number-pair "deck" is
// enough to exercise stepping, the commit-is-final rule, reset-on-advance, and
// stopping at the last pair. The Section adapters (classifier, vectorQuiz) then
// only have to test what they actually vary: the answer derivation, equality,
// and the "why" trigger.

interface Pair {
	prompt: string;
	answer: number;
}

const deck: Pair[] = [
	{ prompt: 'a', answer: 1 },
	{ prompt: 'b', answer: 2 },
	{ prompt: 'c', answer: 3 }
];

// A default machine: strict-equality answers, the "why" always revealed.
const plain = createLatihan<Pair, number>({ correctAnswer: (p) => p.answer });

describe('initialState', () => {
	it('starts on the first pair, unanswered, with no overlay playing', () => {
		const s = plain.initialState(deck);
		expect(s.index).toBe(0);
		expect(s.committed).toBeNull();
		expect(s.overlayPlaying).toBe(false);
		expect(plain.isAnswered(s)).toBe(false);
		expect(plain.currentPair(s)).toBe(deck[0]);
	});
});

describe('submitAnswer', () => {
	it('records the committed answer', () => {
		const s = plain.submitAnswer(plain.initialState(deck), 1);
		expect(s.committed).toBe(1);
		expect(plain.isAnswered(s)).toBe(true);
	});

	it('is final: a second submission is ignored (same state reference)', () => {
		const answered = plain.submitAnswer(plain.initialState(deck), 1);
		expect(plain.submitAnswer(answered, 99)).toBe(answered);
	});

	it('reveals the "why" by default, regardless of correctness', () => {
		expect(plain.submitAnswer(plain.initialState(deck), 1).overlayPlaying).toBe(true);
		expect(plain.submitAnswer(plain.initialState(deck), 99).overlayPlaying).toBe(true);
	});
});

describe('revealsWhy config', () => {
	// Only reveal the "why" for even-answered pairs — stands in for classifier's
	// "only for congruent pairs" rule.
	const picky = createLatihan<Pair, number>({
		correctAnswer: (p) => p.answer,
		revealsWhy: (p) => p.answer % 2 === 0
	});

	it('plays the overlay only when the predicate holds for the current pair', () => {
		expect(picky.submitAnswer(picky.initialState(deck), 1).overlayPlaying).toBe(false); // answer 1
		const onSecond = picky.nextPair(picky.submitAnswer(picky.initialState(deck), 1));
		expect(picky.submitAnswer(onSecond, 2).overlayPlaying).toBe(true); // answer 2
	});
});

describe('isCorrect', () => {
	it('is true when the committed answer matches via the default ===', () => {
		expect(plain.isCorrect(plain.submitAnswer(plain.initialState(deck), 1))).toBe(true);
	});

	it('is false for a wrong answer', () => {
		expect(plain.isCorrect(plain.submitAnswer(plain.initialState(deck), 2))).toBe(false);
	});

	it('is false before an answer is committed', () => {
		expect(plain.isCorrect(plain.initialState(deck))).toBe(false);
	});

	it('honours a custom answersEqual (structural rather than identity)', () => {
		// Pairs whose answer is an object: identity would never match, structural does.
		type ObjPair = { answer: { n: number } };
		const structural = createLatihan<ObjPair, { n: number }>({
			correctAnswer: (p) => p.answer,
			answersEqual: (a, b) => a.n === b.n
		});
		const s = structural.submitAnswer(structural.initialState([{ answer: { n: 5 } }]), { n: 5 });
		expect(structural.isCorrect(s)).toBe(true);
	});
});

describe('nextPair', () => {
	it('advances and resets the committed answer + overlay', () => {
		const s = plain.nextPair(plain.submitAnswer(plain.initialState(deck), 1));
		expect(s.index).toBe(1);
		expect(s.committed).toBeNull();
		expect(s.overlayPlaying).toBe(false);
		expect(plain.currentPair(s)).toBe(deck[1]);
	});

	it('does nothing until the current pair is answered (same state reference)', () => {
		const s = plain.initialState(deck);
		expect(plain.nextPair(s)).toBe(s);
	});

	it('does not advance past the last pair', () => {
		let s = plain.initialState(deck);
		s = plain.nextPair(plain.submitAnswer(s, 1)); // -> 1
		s = plain.nextPair(plain.submitAnswer(s, 2)); // -> 2 (last)
		expect(plain.isLast(s)).toBe(true);
		const answeredLast = plain.submitAnswer(s, 3);
		expect(plain.nextPair(answeredLast)).toBe(answeredLast);
	});
});

describe('isLast', () => {
	it('is true only on the final pair', () => {
		let s = plain.initialState(deck);
		expect(plain.isLast(s)).toBe(false);
		s = plain.nextPair(plain.submitAnswer(s, 1));
		expect(plain.isLast(s)).toBe(false);
		s = plain.nextPair(plain.submitAnswer(s, 2));
		expect(plain.isLast(s)).toBe(true);
	});
});
