import { describe, expect, it } from 'vitest';
import { correctAnswer, latihanConfig, pairs } from './factorQuiz';

describe('factorQuiz', () => {
	it('derives the verdict from the pair', () => {
		expect(correctAnswer({ total: 12, size: 4 })).toBe(true);
		expect(correctAnswer({ total: 15, size: 4 })).toBe(false);
	});

	it('is exposed through the config', () => {
		expect(latihanConfig.correctAnswer({ total: 17, size: 1 })).toBe(true);
	});

	it('has a mix of yes and no, and every tile count fits the stage', () => {
		const verdicts = pairs.map(correctAnswer);
		expect(verdicts).toContain(true);
		expect(verdicts).toContain(false);
		expect(pairs.every((p) => p.size <= p.total && p.total <= 30)).toBe(true);
	});
});
