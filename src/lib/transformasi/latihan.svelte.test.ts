import { describe, it, expect } from 'vitest';
import { startLatihan } from './latihan.svelte';

// The adapter is tested through its reactive interface only, the way a page
// drives it. The machine's own rules (stepping, commit-is-final, equality) are
// covered in latihan.test.ts; here we check what the adapter adds: it holds the
// snapshot, exposes the derived view-state, owns the draft, and resets the draft
// when advancing.

interface Pair {
	prompt: string;
	answer: number;
}

const deck: Pair[] = [
	{ prompt: 'a', answer: 1 },
	{ prompt: 'b', answer: 2 },
	{ prompt: 'c', answer: 3 }
];

const config = { correctAnswer: (p: Pair) => p.answer };
// Reveals only even-answered pairs, with a draft that starts at 0.
const drafting = {
	correctAnswer: (p: Pair) => p.answer,
	revealsWhy: (p: Pair) => p.answer % 2 === 0,
	blank: 0
};

describe('startLatihan view-state', () => {
	it('starts on the first pair, unanswered, not revealing', () => {
		const l = startLatihan(config, deck);
		expect(l.pair).toBe(deck[0]);
		expect(l.index).toBe(0);
		expect(l.total).toBe(3);
		expect(l.answered).toBe(false);
		expect(l.correct).toBe(false);
		expect(l.last).toBe(false);
		expect(l.revealing).toBe(false);
	});

	it('reports correctness after an explicit submit', () => {
		const right = startLatihan(config, deck);
		right.submit(1);
		expect(right.answered).toBe(true);
		expect(right.correct).toBe(true);
		const wrong = startLatihan(config, deck);
		wrong.submit(2);
		expect(wrong.correct).toBe(false);
	});
});

describe('submit', () => {
	it('is final: a second submit for the same pair is ignored', () => {
		const l = startLatihan(config, deck);
		l.submit(1);
		l.submit(99);
		expect(l.correct).toBe(true);
	});

	it('with no argument commits the current draft', () => {
		const l = startLatihan(drafting, deck);
		l.draft = 1;
		l.submit();
		expect(l.answered).toBe(true);
		expect(l.correct).toBe(true);
	});

	it('with an explicit answer commits it and leaves the draft alone', () => {
		const l = startLatihan(drafting, deck);
		l.draft = 7;
		l.submit(2);
		expect(l.correct).toBe(false);
		expect(l.draft).toBe(7);
	});
});

describe('next', () => {
	it('does nothing until the current pair is answered', () => {
		const l = startLatihan(config, deck);
		l.next();
		expect(l.index).toBe(0);
	});

	it('advances to the next pair once answered', () => {
		const l = startLatihan(config, deck);
		l.submit(1);
		l.next();
		expect(l.index).toBe(1);
		expect(l.pair).toBe(deck[1]);
		expect(l.answered).toBe(false);
	});

	it('does not advance past the last pair', () => {
		const l = startLatihan(config, deck);
		l.submit(1);
		l.next();
		l.submit(2);
		l.next();
		expect(l.last).toBe(true);
		l.submit(3);
		l.next();
		expect(l.index).toBe(2);
	});

	it('resets the draft to blank when it advances', () => {
		const l = startLatihan(drafting, deck);
		expect(l.draft).toBe(0);
		l.draft = 5;
		l.submit();
		l.next();
		expect(l.draft).toBe(0);
	});

	it('keeps the draft when it does not advance (unanswered or on the last pair)', () => {
		const l = startLatihan(drafting, deck);
		l.draft = 5;
		l.next();
		expect(l.draft).toBe(5);
	});
});

describe('revealing', () => {
	it('is false before commit, follows revealsWhy after commit, and clears on advance', () => {
		const l = startLatihan(drafting, deck);
		l.submit(1); // pair a (answer 1): odd, does not reveal
		expect(l.revealing).toBe(false);
		l.next();
		expect(l.revealing).toBe(false);
		l.submit(2); // pair b (answer 2): even, reveals
		expect(l.revealing).toBe(true);
		l.next();
		expect(l.revealing).toBe(false);
	});
});
