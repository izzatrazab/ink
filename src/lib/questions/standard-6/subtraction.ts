import { getRandomNumber } from '../../helper';
import { evaluate, type Question } from '../evaluate';

const OPERATOR = '-' as const;

/**
 * Standard 6 subtraction: two 7-digit operands, larger minus smaller so the
 * answer is never negative. Both operands are re-rolled until valid.
 */
export function generateSubtraction(): Question {
	let a: number;
	let b: number;
	do {
		a = getRandomNumber(7);
		b = getRandomNumber(7);
	} while (a <= b);

	const operands = [a, b];
	return { operands, operator: OPERATOR, answer: evaluate(operands, OPERATOR) };
}
