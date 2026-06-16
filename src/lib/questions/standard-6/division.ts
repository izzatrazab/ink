import { getRandomNumber } from '../../helper';
import { evaluate, type Question } from '../evaluate';

const OPERATOR = '÷' as const;

/**
 * Standard 6 division: a multi-digit dividend divided by a single-digit
 * divisor, always dividing evenly. The dividend is built as quotient × divisor
 * so the answer is guaranteed to be a whole number.
 */
export function generateDivision(): Question {
	const divisor = getRandomNumber(1); // 1..9, never zero
	const quotient = getRandomNumber(6);
	const dividend = quotient * divisor;

	const operands = [dividend, divisor];
	return { operands, operator: OPERATOR, answer: evaluate(operands, OPERATOR) };
}
