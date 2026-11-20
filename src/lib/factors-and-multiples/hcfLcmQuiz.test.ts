import { describe, expect, it } from 'vitest';
import { correctAnswer, pairs, result } from './hcfLcmQuiz';

describe('hcfLcmQuiz', () => {
	it('derives each result from the numbers', () => {
		expect(pairs.map(result)).toEqual([24, 60, 9, 24, 8, 60]);
	});

	it('takes the authored kind as the verdict', () => {
		expect(correctAnswer({ key: 'tiles', numbers: [48, 72], kind: 'hcf' })).toBe('hcf');
	});

	it('mixes both kinds, with unique stories', () => {
		const kinds = pairs.map(correctAnswer);
		expect(kinds).toContain('hcf');
		expect(kinds).toContain('lcm');
		expect(new Set(pairs.map((p) => p.key)).size).toBe(pairs.length);
		expect(pairs.every((p) => p.numbers.length >= 2 && p.numbers.length <= 4)).toBe(true);
	});
});
