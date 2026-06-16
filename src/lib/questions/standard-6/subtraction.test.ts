import { describe, it, expect } from 'vitest';
import { generateSubtraction } from './subtraction';
import { evaluate } from '../evaluate';

describe('Standard 6 subtraction generator', () => {
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

	it('uses two 7-digit operands, larger first, with the minus operator', () => {
		for (let i = 0; i < 1_000; i++) {
			const q = generateSubtraction();
			expect(q.operands).toHaveLength(2);
			expect(q.operator).toBe('-');
			expect(q.operands[0]).toBeGreaterThan(q.operands[1]);
			for (const n of q.operands) {
				expect(n).toBeGreaterThanOrEqual(1_000_000);
				expect(n).toBeLessThanOrEqual(9_999_999);
			}
		}
	});
});
