// The rules of the "method of repeated division" ladder, as pure functions —
// the seam behind <DivisionLadder> (the way geometry.ts is for Transformasi).
// One machine serves three uses, differing only in what a divisor must do:
//
//   single  prime factorisation of one number: divide by primes until 1.
//   hcf     highest common factor: the divisor must divide EVERY number; stop
//           when no prime divides them all; HCF = product of the divisors.
//   lcm     lowest common multiple: the divisor need divide only ONE number —
//           numbers it does not divide are brought down unchanged; stop when
//           every number is 1; LCM = product of the divisors.
//
// The student's whole progress is the list of divisors they have chosen, so
// the rows, the "are we done?" check and the final product are all derived
// from it and cannot drift. Divisors are always prime, so the finished ladder
// reads as a prime factorisation. Framework-free.

import type { Language } from '$lib/chapters';
import { copy } from './copy';
import { factors, hcf, isPrime } from './numbers';

export type LadderMode = 'single' | 'hcf' | 'lcm';

/** Why a divisor was refused — the ladder turns these into teaching messages. */
export type Rejection =
	| { kind: 'not-prime'; smallestFactor: number }
	| { kind: 'remainder'; number: number; remainder: number }
	| { kind: 'divides-none' };

export type TryResult = { ok: true; next: number[] } | { ok: false; rejection: Rejection };

/** Tries dividing the current row by `d`: the next row, or why it is refused. */
export function tryDivisor(row: number[], d: number, mode: LadderMode): TryResult {
	if (!isPrime(d)) {
		return { ok: false, rejection: { kind: 'not-prime', smallestFactor: factors(d)[1] ?? d } };
	}
	if (mode === 'lcm') {
		if (!row.some((n) => n % d === 0)) return { ok: false, rejection: { kind: 'divides-none' } };
		return { ok: true, next: row.map((n) => (n % d === 0 ? n / d : n)) };
	}
	const miss = row.find((n) => n % d !== 0);
	if (miss !== undefined) {
		return { ok: false, rejection: { kind: 'remainder', number: miss, remainder: miss % d } };
	}
	return { ok: true, next: row.map((n) => n / d) };
}

/** Whether the ladder is finished for this row. */
export function isDone(row: number[], mode: LadderMode): boolean {
	return mode === 'hcf' ? hcf(row) === 1 : row.every((n) => n === 1);
}

/** The rows of the ladder after applying `divisors` in order (starting row first).
 *  Divisors that would be refused are skipped, so the result is always a valid ladder. */
export function rowsOf(start: number[], divisors: number[], mode: LadderMode): number[][] {
	const rows = [start];
	for (const d of divisors) {
		const result = tryDivisor(rows[rows.length - 1], d, mode);
		if (result.ok) rows.push(result.next);
	}
	return rows;
}

/** The smallest prime the ladder accepts next, or undefined when it is done. */
export function hint(row: number[], mode: LadderMode): number | undefined {
	if (isDone(row, mode)) return undefined;
	for (let d = 2; d <= Math.max(...row); d++) {
		if (tryDivisor(row, d, mode).ok) return d;
	}
	return undefined;
}

/** The product of the divisors — the prime factorisation, the HCF or the LCM. */
export function product(divisors: number[]): number {
	return divisors.reduce((a, b) => a * b, 1);
}

/** The numbers (other than 1) that `d` does not divide — in the LCM ladder these are
 *  "brought down" unchanged, the step students find most surprising. */
function keptNumbers(row: number[], d: number): number[] {
	return row.filter((n) => n > 1 && n % d !== 0);
}

/**
 * The short sentence shown after the student picks divisor `d` on row `before`:
 * why it was refused, or what the step did, in `lang`. `before` must be the row
 * that was divided (not the row after), so the arithmetic reads right.
 */
export function narrate(
	before: number[],
	d: number,
	result: TryResult,
	mode: LadderMode,
	lang: Language = 'en'
): string {
	const t = copy[lang].ladder;
	const list = (row: number[]) => row.join(', ');
	const kept = keptNumbers(before, d);
	const down = kept.length === 0 ? '' : t.broughtDown(kept);

	if (!result.ok) {
		const r = result.rejection;
		if (r.kind === 'not-prime') {
			return d === 1 ? t.notPrime1 : t.notPrime(d, r.smallestFactor, d / r.smallestFactor);
		}
		if (r.kind === 'remainder') return t.remainder(r.number, d, r.remainder, mode === 'hcf');
		return t.none(d);
	}

	const next = result.next;
	if (isDone(next, mode)) {
		if (mode === 'single') return t.doneSingle(list(before), d, list(next));
		if (mode === 'hcf') return t.doneHcf(list(before), d, list(next));
		return t.doneLcm(list(before), d, list(next), down);
	}
	if (mode === 'single') return t.keepGoing(list(before), d, list(next));
	return t.step(list(before), d, list(next), mode === 'lcm' ? down : '');
}
