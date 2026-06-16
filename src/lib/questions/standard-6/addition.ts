import { getRandomNumber } from '../../helper';
import { evaluate, type Question } from '../evaluate';

const OPERATOR = '+' as const;

/**
 * Standard 6 addition: three 6-digit addends.
 */
export function generateAddition(): Question {
	const operands = [getRandomNumber(6), getRandomNumber(6), getRandomNumber(6)];
	return { operands, operator: OPERATOR, answer: evaluate(operands, OPERATOR) };
}
