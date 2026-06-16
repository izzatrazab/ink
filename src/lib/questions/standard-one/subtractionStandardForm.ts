import { getRandomNumber } from '../../helper';
import { evaluate, type Question } from '../evaluate';

const OPERATOR = '-' as const;

/**
 * Standard 1, subtraction in column form: two single-digit operands, never
 * yielding a negative answer.
 */
export function generateSubtractionStandardForm(): Question {
	let a: number;
	let b: number;
	do {
		a = getRandomNumber(1);
		b = getRandomNumber(1);
	} while (a < b);

	const operands = [a, b];
	return { operands, operator: OPERATOR, answer: evaluate(operands, OPERATOR) };
}
