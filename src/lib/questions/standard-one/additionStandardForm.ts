import { getRandomNumber } from '../../helper';
import { evaluate, type Question } from '../evaluate';

const OPERATOR = '+' as const;

/**
 * Standard 1 addition in column form: two operands of 1–2 digits.
 */
export function generateAdditionStandardForm(): Question {
	const operands = pickOperands();
	return { operands, operator: OPERATOR, answer: evaluate(operands, OPERATOR) };
}

function pickOperands(): number[] {
	switch (Math.floor(Math.random() * 4)) {
		default:
		case 0:
			return [getRandomNumber(1), getRandomNumber(1)];
		case 1:
			return [getRandomNumber(2), getRandomNumber(1)];
		case 2:
			return [getRandomNumber(1), getRandomNumber(2)];
		case 3:
			return [getRandomNumber(2), getRandomNumber(2)];
	}
}
