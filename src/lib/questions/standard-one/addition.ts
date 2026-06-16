import { getRandomNumber } from '../../helper';
import { evaluate, type Question } from '../evaluate';

const OPERATOR = '+' as const;

/**
 * Standard 1 addition (inline form). Three difficulty shapes, picked at random:
 * - two operands of 1–2 digits,
 * - three identical operands of 1–2 digits,
 * - four identical single-digit operands.
 */
export function generateAddition(): Question {
	const operands = pickOperands();
	return { operands, operator: OPERATOR, answer: evaluate(operands, OPERATOR) };
}

function pickOperands(): number[] {
	switch (Math.floor(Math.random() * 3)) {
		default:
		case 0:
			return twoOperands();
		case 1:
			return threeIdentical();
		case 2:
			return fourIdentical();
	}
}

function twoOperands(): number[] {
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

function threeIdentical(): number[] {
	const n = getRandomNumber(Math.floor(Math.random() * 2) + 1);
	return [n, n, n];
}

function fourIdentical(): number[] {
	const n = getRandomNumber(1);
	return [n, n, n, n];
}
