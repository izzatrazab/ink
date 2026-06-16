import { describe, it, expect } from 'vitest';
import { generateAddition } from './addition';
import { evaluate } from '../evaluate';

describe('Standard 6 addition generator', () => {
	it('answer always matches the evaluator over its own operands', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateAddition();
			expect(q.answer).toBe(evaluate(q.operands, q.operator));
		}
	});

	it('uses three 6-digit addends and the plus operator', () => {
		for (let i = 0; i < 1_000; i++) {
			const q = generateAddition();
			expect(q.operands).toHaveLength(3);
			expect(q.operator).toBe('+');
			for (const n of q.operands) {
				expect(n).toBeGreaterThanOrEqual(100_000);
				expect(n).toBeLessThanOrEqual(999_999);
			}
		}
	});
});
