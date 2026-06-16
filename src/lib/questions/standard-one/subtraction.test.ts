import { describe, it, expect } from 'vitest';
import { generateSubtraction } from './subtraction';
import { evaluate } from '../evaluate';

describe('Standard 1 subtraction generator', () => {
	it('never produces a negative answer', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateSubtraction();
			expect(q.answer).toBeGreaterThanOrEqual(0);
		}
	});

	it('answer always matches the evaluator over its own operands', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateSubtraction();
			expect(q.answer).toBe(evaluate(q.operands, q.operator));
		}
	});

	it('uses two operands of at most 2 digits and the minus operator', () => {
		for (let i = 0; i < 1_000; i++) {
			const q = generateSubtraction();
			expect(q.operands).toHaveLength(2);
			expect(q.operator).toBe('-');
			for (const n of q.operands) {
				expect(n).toBeGreaterThanOrEqual(1);
				expect(n).toBeLessThanOrEqual(99);
			}
		}
	});
});
