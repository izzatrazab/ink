import { describe, it, expect } from 'vitest';
import { generateDivision } from './division';
import { evaluate } from '../evaluate';

describe('Standard 6 division generator', () => {
	it('always divides evenly (whole-number answer)', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateDivision();
			expect(Number.isInteger(q.answer)).toBe(true);
		}
	});

	it('answer always matches the evaluator over its own operands', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateDivision();
			expect(q.answer).toBe(evaluate(q.operands, q.operator));
		}
	});

	it('uses a non-zero single-digit divisor and reconstructs the dividend', () => {
		for (let i = 0; i < 1_000; i++) {
			const q = generateDivision();
			const [dividend, divisor] = q.operands;
			expect(q.operator).toBe('÷');
			expect(divisor).toBeGreaterThanOrEqual(1);
			expect(divisor).toBeLessThanOrEqual(9);
			expect(dividend).toBe(q.answer * divisor);
		}
	});
});
