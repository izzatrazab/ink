import { describe, expect, it } from 'vitest';
import { hint, isDone, narrate, product, rowsOf, tryDivisor, type LadderMode } from './ladder';
import { hcf, lcm } from './numbers';

describe('tryDivisor — single / hcf', () => {
	it('divides every number by an accepted prime', () => {
		expect(tryDivisor([60], 2, 'single')).toEqual({ ok: true, next: [30] });
		expect(tryDivisor([36, 60, 72], 2, 'hcf')).toEqual({ ok: true, next: [18, 30, 36] });
	});
	it('refuses a non-prime and names its smallest factor', () => {
		expect(tryDivisor([60], 4, 'single')).toEqual({
			ok: false,
			rejection: { kind: 'not-prime', smallestFactor: 2 }
		});
		expect(tryDivisor([60], 9, 'single')).toEqual({
			ok: false,
			rejection: { kind: 'not-prime', smallestFactor: 3 }
		});
	});
	it('refuses a prime that leaves a remainder', () => {
		expect(tryDivisor([60], 7, 'single')).toEqual({
			ok: false,
			rejection: { kind: 'remainder', number: 60, remainder: 4 }
		});
	});
	it('for hcf, refuses a prime that misses any one number', () => {
		expect(tryDivisor([36, 60, 72], 5, 'hcf')).toEqual({
			ok: false,
			rejection: { kind: 'remainder', number: 36, remainder: 1 }
		});
	});
});

describe('tryDivisor — lcm', () => {
	it('divides what it can and brings the rest down', () => {
		expect(tryDivisor([3, 6, 9], 3, 'lcm')).toEqual({ ok: true, next: [1, 2, 3] });
		expect(tryDivisor([1, 2, 3], 2, 'lcm')).toEqual({ ok: true, next: [1, 1, 3] });
	});
	it('refuses a prime that divides none of them', () => {
		expect(tryDivisor([3, 6, 9], 5, 'lcm')).toEqual({
			ok: false,
			rejection: { kind: 'divides-none' }
		});
	});
});

describe('isDone', () => {
	it('single and lcm finish at all ones', () => {
		expect(isDone([1], 'single')).toBe(true);
		expect(isDone([1, 1, 3], 'lcm')).toBe(false);
		expect(isDone([1, 1, 1], 'lcm')).toBe(true);
	});
	it('hcf finishes when no prime divides every number', () => {
		expect(isDone([3, 5, 6], 'hcf')).toBe(true);
		expect(isDone([6, 10], 'hcf')).toBe(false);
	});
});

describe('rowsOf', () => {
	it('builds the textbook ladder for 60', () => {
		expect(rowsOf([60], [2, 2, 3, 5], 'single')).toEqual([[60], [30], [15], [5], [1]]);
	});
	it('skips refused divisors', () => {
		expect(rowsOf([60], [7, 4, 2], 'single')).toEqual([[60], [30]]);
	});
});

// Follow the hint to the end of the ladder and check the answer is the textbook's.
function solve(start: number[], mode: LadderMode): number[] {
	const divisors: number[] = [];
	let row = start;
	for (let d = hint(row, mode); d !== undefined; d = hint(row, mode)) {
		divisors.push(d);
		const result = tryDivisor(row, d, mode);
		if (!result.ok) throw new Error('hint offered a refused divisor');
		row = result.next;
	}
	return divisors;
}

describe('following the hint to the end', () => {
	it('single: the product is the number itself', () => {
		for (const n of [18, 60, 72, 84, 97, 126, 144]) {
			const divisors = solve([n], 'single');
			expect(product(divisors)).toBe(n);
		}
		expect(solve([60], 'single')).toEqual([2, 2, 3, 5]);
	});
	it('hcf: the product is the highest common factor', () => {
		for (const set of [
			[18, 24],
			[36, 60, 72],
			[48, 64, 80],
			[252, 180, 108],
			[7, 9]
		]) {
			expect(product(solve(set, 'hcf'))).toBe(hcf(set));
		}
		expect(solve([36, 60, 72], 'hcf')).toEqual([2, 2, 3]);
	});
	it('lcm: the product is the lowest common multiple', () => {
		for (const set of [
			[6, 8],
			[3, 6, 9],
			[3, 8, 12],
			[9, 12],
			[4, 15, 60]
		]) {
			expect(product(solve(set, 'lcm'))).toBe(lcm(set));
		}
		expect(solve([3, 6, 9], 'lcm')).toEqual([2, 3, 3]);
	});
});

describe('hint', () => {
	it('is undefined once done', () => {
		expect(hint([1], 'single')).toBeUndefined();
	});
});

describe('narrate', () => {
	const say = (row: number[], d: number, mode: LadderMode) =>
		narrate(row, d, tryDivisor(row, d, mode), mode);

	it('reads the row that was divided, not the row after', () => {
		expect(say([60], 2, 'single')).toBe('60 ÷ 2 = 30. Keep going.');
		expect(say([5], 5, 'single')).toContain('5 ÷ 5 = 1. We reached 1!');
	});
	it('explains a non-prime and a remainder', () => {
		expect(say([60], 4, 'single')).toBe('4 is not prime (2 × 2). Try a prime, like 2.');
		expect(say([60], 7, 'single')).toBe('60 ÷ 7 leaves 4, so 7 does not go in.');
		expect(say([36, 60, 72], 5, 'hcf')).toContain('must go into every number');
	});
	it('says why the HCF ladder stops', () => {
		expect(say([9, 15, 18], 3, 'hcf')).toContain('No prime fits all of them');
	});
	it('names what the LCM ladder brings down', () => {
		expect(say([3, 6, 9], 2, 'lcm')).toBe(
			'Divide by 2: 3, 6, 9 → 3, 3, 9. 3 and 9 come down unchanged.'
		);
		expect(say([1, 1, 3], 3, 'lcm')).toContain('All 1s');
	});
});
