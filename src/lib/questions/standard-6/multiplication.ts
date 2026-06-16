import { getRandomNumber, shuffleArray } from '../../helper';
import { evaluate, type Question } from '../evaluate';

const OPERATOR = '×' as const;

/**
 * Standard 6 multiplication: a single-digit factor times a 7-digit factor, in
 * random order.
 */
export function generateMultiplication(): Question {
	const operands = shuffleArray([getRandomNumber(1), getRandomNumber(7)]);
	return { operands, operator: OPERATOR, answer: evaluate(operands, OPERATOR) };
}
