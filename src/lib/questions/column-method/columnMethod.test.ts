import { describe, it, expect } from 'vitest';
import { generateColumnMethod } from './columnMethod';
import { evaluate } from '../evaluate';

const OPERATIONS = ['addition', 'subtraction', 'multiplication'] as const;
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

describe('Column method generator', () => {
	it('answer always matches the evaluator over its own operands', () => {
		for (const operation of OPERATIONS) {
			for (const difficulty of DIFFICULTIES) {
				for (let i = 0; i < 2_000; i++) {
					const q = generateColumnMethod(operation, difficulty);
					expect(q.answer).toBe(evaluate(q.operands, q.operator));
				}
			}
		}
	});

	it('maps each operation to its operator', () => {
		expect(generateColumnMethod('addition', 'easy').operator).toBe('+');
		expect(generateColumnMethod('subtraction', 'easy').operator).toBe('-');
		expect(generateColumnMethod('multiplication', 'easy').operator).toBe('×');
	});

	it('stacks operands[0] over operands[1], sized by the difficulty digit counts', () => {
		const cases = [
			{ difficulty: 'easy', first: 2, second: 1 },
			{ difficulty: 'medium', first: 3, second: 2 },
			{ difficulty: 'hard', first: 4, second: 3 }
		];
		for (const { difficulty, first, second } of cases) {
			for (let i = 0; i < 1_000; i++) {
				const q = generateColumnMethod('addition', difficulty);
				expect(q.operands).toHaveLength(2);
				expect(q.operands[0]).toBeGreaterThanOrEqual(10 ** (first - 1));
				expect(q.operands[0]).toBeLessThanOrEqual(10 ** first - 1);
				expect(q.operands[1]).toBeGreaterThanOrEqual(10 ** (second - 1));
				expect(q.operands[1]).toBeLessThanOrEqual(10 ** second - 1);
			}
		}
	});

	it('never produces a negative subtraction answer at the named difficulties', () => {
		for (const difficulty of DIFFICULTIES) {
			for (let i = 0; i < 2_000; i++) {
				const q = generateColumnMethod('subtraction', difficulty);
				expect(q.answer).toBeGreaterThanOrEqual(0);
			}
		}
	});
});
