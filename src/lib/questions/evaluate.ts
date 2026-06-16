/** The arithmetic symbol of a Question. */
export type Operator = '+' | '-' | '×' | '÷';

/**
 * One arithmetic problem as plain data, independent of how it is drawn.
 */
export type Question = {
	operands: number[];
	operator: Operator;
	answer: number;
};

/**
 * The single source of truth for a Question's answer. Generators pick valid
 * operands; this computes the one true answer from them.
 */
export function evaluate(operands: number[], operator: Operator): number {
	switch (operator) {
		case '+':
			return operands.reduce((result, n) => result + n, 0);
		case '-':
			return operands.slice(1).reduce((result, n) => result - n, operands[0]);
		case '×':
			return operands.reduce((result, n) => result * n, 1);
		case '÷':
			return operands.slice(1).reduce((result, n) => result / n, operands[0]);
	}
}
