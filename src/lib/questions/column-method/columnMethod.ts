import { getRandomNumber } from '../../helper';
import { difficultyList } from '../../difficulty';
import { evaluate, type Operator, type Question } from '../evaluate';

/** The operations the column-method worksheet supports. */
export type ColumnOperation = 'addition' | 'subtraction' | 'multiplication';

const OPERATORS: Record<ColumnOperation, Operator> = {
	addition: '+',
	subtraction: '-',
	multiplication: '×'
};

/**
 * Column-method question: operands[0] stacked over operands[1], each sized by
 * the difficulty's digit counts. operands[0] carries at least as many digits as
 * operands[1], so subtraction never goes negative at the named difficulties.
 *
 * Unknown operation falls back to addition and unknown difficulty to single
 * digits, matching the drill's historical defaults.
 */
export function generateColumnMethod(operation: string, difficulty: string): Question {
	const rules = difficultyList.get(difficulty);
	const operator = OPERATORS[operation as ColumnOperation] ?? '+';
	const operands = [
		getRandomNumber(rules?.first_number_of_digits ?? 1),
		getRandomNumber(rules?.second_number_of_digits ?? 1)
	];
	return { operands, operator, answer: evaluate(operands, operator) };
}
