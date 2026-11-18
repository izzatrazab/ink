import { describe, expect, it } from 'vitest';
import { correctAnswer, firstMiss, pairs } from './commonMultipleQuiz';

describe('commonMultipleQuiz', () => {
	it('derives the verdict from the pair', () => {
		expect(correctAnswer({ n: 32, of: [2, 8] })).toBe(true);
		expect(correctAnswer({ n: 60, of: [5, 15, 24] })).toBe(false);
	});

	it('names the first number that fails', () => {
		expect(firstMiss({ n: 60, of: [5, 15, 24] })).toBe(24);
		expect(firstMiss({ n: 32, of: [2, 8] })).toBeUndefined();
	});

	it('mixes yes and no and fits the Reveal', () => {
		const verdicts = pairs.map(correctAnswer);
		expect(verdicts).toContain(true);
		expect(verdicts).toContain(false);
		expect(pairs.every((p) => p.n <= 72 && p.of.length >= 2 && p.of.length <= 4)).toBe(true);
	});
});
