import { getRandomNumber } from '../../helper';
import { evaluate, type Question } from '../evaluate';

const OPERATOR = '-' as const;

/**
 * Standard 1 subtraction (inline form). Two difficulty shapes, picked at
 * random, neither ever producing a negative answer:
 * - two single-digit operands,
 * - a 2-digit operand minus a single-digit operand.
 */
export function generateSubtraction(): Question {
	const operands = pickOperands();
	return { operands, operator: OPERATOR, answer: evaluate(operands, OPERATOR) };
}

function pickOperands(): number[] {
	switch (Math.floor(Math.random() * 2)) {
		default:
		case 0:
			return bothSingleDigit();
		case 1:
			return twoDigitMinusSingleDigit();
	}
}

function bothSingleDigit(): number[] {
	let a: number;
	let b: number;
	do {
		a = getRandomNumber(1);
		b = getRandomNumber(1);
	} while (a < b);
	return [a, b];
}

function twoDigitMinusSingleDigit(): number[] {
	let a: number;
	let b: number;
	do {
		a = getRandomNumber(2);
		b = getRandomNumber(1);
	} while (a < b);
	return [a, b];
}
