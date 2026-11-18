import { describe, expect, it } from 'vitest';
import {
	commonMultiples,
	discover,
	factors,
	isCommonMultiple,
	isFactor,
	isPrime,
	leftover,
	multiples
} from './numbers';

describe('isFactor', () => {
	it('is true when the division is complete', () => {
		expect(isFactor(36, 12)).toBe(true);
		expect(isFactor(30, 9)).toBe(false);
	});
	it('treats 1 and the number itself as factors', () => {
		expect(isFactor(17, 1)).toBe(true);
		expect(isFactor(17, 17)).toBe(true);
	});
	it('rejects zero, negatives and non-integers', () => {
		expect(isFactor(12, 0)).toBe(false);
		expect(isFactor(12, -3)).toBe(false);
		expect(isFactor(12, 2.5)).toBe(false);
	});
});

describe('factors', () => {
	it('lists factors in ascending order', () => {
		expect(factors(12)).toEqual([1, 2, 3, 4, 6, 12]);
		expect(factors(18)).toEqual([1, 2, 3, 6, 9, 18]);
	});
	it('counts a square root once', () => {
		expect(factors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]);
	});
	it('handles 1 and primes', () => {
		expect(factors(1)).toEqual([1]);
		expect(factors(13)).toEqual([1, 13]);
	});
});

describe('isPrime', () => {
	it('knows primes and non-primes', () => {
		expect([2, 3, 13, 23].every(isPrime)).toBe(true);
		expect([1, 9, 57, 69].some(isPrime)).toBe(false);
	});
});

describe('leftover', () => {
	it('is the remainder', () => {
		expect(leftover(12, 5)).toBe(2);
		expect(leftover(12, 4)).toBe(0);
	});
});

describe('discover', () => {
	it('adds the whole factor pair when rows are complete', () => {
		expect(discover([], 12, 3)).toEqual([3, 4]);
		expect(discover([3, 4], 12, 2)).toEqual([2, 3, 4, 6]);
	});
	it('adds one number when the pair is a square', () => {
		expect(discover([], 36, 6)).toEqual([6]);
	});
	it('ignores a row size that leaves tiles over', () => {
		const found = [3, 4];
		expect(discover(found, 12, 5)).toBe(found);
	});
	it('does not repeat a factor', () => {
		expect(discover([1, 12], 12, 12)).toEqual([1, 12]);
	});
});

describe('multiples', () => {
	it('lists n, 2n, 3n … up to the limit', () => {
		expect(multiples(9, 30)).toEqual([9, 18, 27]);
		expect(multiples(6, 6)).toEqual([6]);
	});
	it('is empty for a bad number', () => {
		expect(multiples(0, 10)).toEqual([]);
	});
});

describe('isCommonMultiple', () => {
	it('needs every number to divide completely', () => {
		expect(isCommonMultiple(32, [2, 8])).toBe(true);
		expect(isCommonMultiple(60, [5, 15, 24])).toBe(false);
		expect(isCommonMultiple(72, [8, 9, 18, 24])).toBe(true);
	});
	it('is false for no numbers', () => {
		expect(isCommonMultiple(12, [])).toBe(false);
	});
});

describe('commonMultiples', () => {
	it('finds them up to the limit', () => {
		expect(commonMultiples([6, 8], 72)).toEqual([24, 48, 72]);
		expect(commonMultiples([3, 5], 50)).toEqual([15, 30, 45]);
	});
	it('are all multiples of the first one', () => {
		const [first, ...rest] = commonMultiples([4, 10], 100);
		expect(first).toBe(20);
		expect(rest.every((m) => m % first === 0)).toBe(true);
	});
});
