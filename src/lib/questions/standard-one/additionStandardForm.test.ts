import { describe, it, expect } from 'vitest';
import { generateAdditionStandardForm } from './additionStandardForm';
import { evaluate } from '../evaluate';

describe('Standard 1 addition standard form generator', () => {
	it('answer always matches the evaluator over its own operands', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateAdditionStandardForm();
			expect(q.answer).toBe(evaluate(q.operands, q.operator));
		}
	});

	it('uses two positive operands of at most 2 digits and the plus operator', () => {
		for (let i = 0; i < 1_000; i++) {
			const q = generateAdditionStandardForm();
			expect(q.operands).toHaveLength(2);
			expect(q.operator).toBe('+');
			for (const n of q.operands) {
				expect(n).toBeGreaterThanOrEqual(1);
				expect(n).toBeLessThanOrEqual(99);
			}
		}
	});
});
