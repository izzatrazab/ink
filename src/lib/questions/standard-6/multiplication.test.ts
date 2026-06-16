import { describe, it, expect } from 'vitest';
import { generateMultiplication } from './multiplication';
import { evaluate } from '../evaluate';

describe('Standard 6 multiplication generator', () => {
	it('answer always matches the evaluator over its own operands', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateMultiplication();
			expect(q.answer).toBe(evaluate(q.operands, q.operator));
		}
	});

	it('multiplies a single-digit factor by a 7-digit factor in either order', () => {
		for (let i = 0; i < 1_000; i++) {
			const q = generateMultiplication();
			expect(q.operands).toHaveLength(2);
			expect(q.operator).toBe('×');

			const sorted = [...q.operands].sort((a, b) => a - b);
			expect(sorted[0]).toBeGreaterThanOrEqual(1);
			expect(sorted[0]).toBeLessThanOrEqual(9);
			expect(sorted[1]).toBeGreaterThanOrEqual(1_000_000);
			expect(sorted[1]).toBeLessThanOrEqual(9_999_999);
		}
	});
});
