import { getRandomNumber } from '../../helper';
import { difficultyList } from '../../difficulty';
import { longDivide, type LongDivisionProblem } from './longDivide';

/**
 * Long-division Generator: pick a dividend and a single-digit divisor valid for
 * the grade, then read the answer from the Long-division evaluator (ADR-0006).
 *
 * - The divisor is single-digit and `>= 2` (never 0, 1, or multi-digit).
 *   Difficulty sizes the *dividend* only — the divisor stays single-digit, the
 *   behaviour the old drill hardcoded as `second_number_of_digits = 1`.
 * - `hasRemainder` selects the grade rule: when true the dividend does not
 *   divide evenly (`remainder > 0`); when false it divides exactly
 *   (`remainder === 0`).
 *
 * Unknown difficulty falls back to a single-digit dividend, matching the drill's
 * historical default.
 */
export function generateLongDivision(difficulty: string, hasRemainder: boolean): LongDivisionProblem {
	const dividendDigits = difficultyList.get(difficulty)?.first_number_of_digits ?? 1;

	let dividend = 0;
	let divisor = 0;
	do {
		dividend = getRandomNumber(dividendDigits);
		divisor = getRandomNumber(1);
	} while (divisor < 2 || (hasRemainder ? dividend % divisor === 0 : dividend % divisor !== 0));

	const { quotient, remainder } = longDivide(dividend, divisor);
	return { dividend, divisor, quotient, remainder };
}
