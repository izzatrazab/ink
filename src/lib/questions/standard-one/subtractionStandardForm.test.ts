import { describe, it, expect } from 'vitest';
import { generateSubtractionStandardForm } from './subtractionStandardForm';
import { evaluate } from '../evaluate';

describe('Standard 1 subtraction standard form generator', () => {
	it('never produces a negative answer', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateSubtractionStandardForm();
			expect(q.answer).toBeGreaterThanOrEqual(0);
		}
	});

	it('answer always matches the evaluator over its own operands', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateSubtractionStandardForm();
			expect(q.answer).toBe(evaluate(q.operands, q.operator));
		}
	});

	it('uses two single-digit operands and the minus operator', () => {
		for (let i = 0; i < 1_000; i++) {
			const q = generateSubtractionStandardForm();
			expect(q.operands).toHaveLength(2);
			expect(q.operator).toBe('-');
			for (const n of q.operands) {
				expect(n).toBeGreaterThanOrEqual(1);
				expect(n).toBeLessThanOrEqual(9);
			}
		}
	});
});
