import { describe, it, expect } from 'vitest';
import { generateAddition } from './addition';
import { evaluate } from '../evaluate';

describe('Standard 1 addition generator', () => {
	it('answer always matches the evaluator over its own operands', () => {
		for (let i = 0; i < 10_000; i++) {
			const q = generateAddition();
			expect(q.answer).toBe(evaluate(q.operands, q.operator));
		}
	});

	it('uses the plus operator with 2–4 positive operands of at most 2 digits', () => {
		for (let i = 0; i < 1_000; i++) {
			const q = generateAddition();
			expect(q.operator).toBe('+');
			expect(q.operands.length).toBeGreaterThanOrEqual(2);
			expect(q.operands.length).toBeLessThanOrEqual(4);
			for (const n of q.operands) {
				expect(n).toBeGreaterThanOrEqual(1);
				expect(n).toBeLessThanOrEqual(99);
			}
		}
	});
});
