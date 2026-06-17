import { describe, it, expect } from 'vitest';
import { generateLongDivision } from './longDivision';
import { longDivide } from './longDivide';

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

describe('Long division generator', () => {
	it('answer always matches the long-division evaluator over its own operands', () => {
		for (const difficulty of DIFFICULTIES) {
			for (const hasRemainder of [true, false]) {
				for (let i = 0; i < 2_000; i++) {
					const p = generateLongDivision(difficulty, hasRemainder);
					expect(longDivide(p.dividend, p.divisor)).toEqual({
						quotient: p.quotient,
						remainder: p.remainder
					});
				}
			}
		}
	});

	it('the long-division identity holds: quotient * divisor + remainder === dividend', () => {
		for (const difficulty of DIFFICULTIES) {
			for (const hasRemainder of [true, false]) {
				for (let i = 0; i < 2_000; i++) {
					const p = generateLongDivision(difficulty, hasRemainder);
					expect(p.quotient * p.divisor + p.remainder).toBe(p.dividend);
				}
			}
		}
	});

	it('the divisor is always single-digit and >= 2', () => {
		for (const difficulty of DIFFICULTIES) {
			for (const hasRemainder of [true, false]) {
				for (let i = 0; i < 2_000; i++) {
					const p = generateLongDivision(difficulty, hasRemainder);
					expect(p.divisor).toBeGreaterThanOrEqual(2);
					expect(p.divisor).toBeLessThanOrEqual(9);
				}
			}
		}
	});

	it('remainder > 0 exactly when the drill asks for remainder problems', () => {
		for (const difficulty of DIFFICULTIES) {
			for (let i = 0; i < 2_000; i++) {
				expect(generateLongDivision(difficulty, true).remainder).toBeGreaterThan(0);
				expect(generateLongDivision(difficulty, false).remainder).toBe(0);
			}
		}
	});

	it('difficulty sizes the dividend only', () => {
		const cases = [
			{ difficulty: 'easy', digits: 2 },
			{ difficulty: 'medium', digits: 3 },
			{ difficulty: 'hard', digits: 4 }
		];
		for (const { difficulty, digits } of cases) {
			for (let i = 0; i < 1_000; i++) {
				const p = generateLongDivision(difficulty, true);
				expect(p.dividend).toBeGreaterThanOrEqual(10 ** (digits - 1));
				expect(p.dividend).toBeLessThanOrEqual(10 ** digits - 1);
			}
		}
	});
});
