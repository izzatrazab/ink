/**
 * One long-division item as plain data, independent of how it is drawn. Its own
 * shape — distinct from a Question — because the answer is two numbers, not one:
 * a quotient and a remainder (ADR-0003, ADR-0006). The divisor and dividend are
 * named, not a generic `operands` array, because their roles are asymmetric.
 */
export type LongDivisionProblem = {
	dividend: number;
	divisor: number;
	quotient: number;
	remainder: number;
};

/**
 * The single source of truth for a Long-division problem's answer — the role the
 * Evaluator plays for a Question (ADR-0002, ADR-0006). A long-division Generator
 * picks a valid dividend/divisor; this computes the one true quotient and
 * remainder from them. Callers guarantee `divisor >= 1`.
 */
export function longDivide(
	dividend: number,
	divisor: number
): { quotient: number; remainder: number } {
	return {
		quotient: Math.floor(dividend / divisor),
		remainder: dividend % divisor
	};
}
