// The number seam for Chapter 2 (Factors and Multiples): pure functions over
// whole numbers, the counterpart of geometry.ts for Transformasi Isometri.
// Every Explorable picture and every Latihan answer reads from here, so what is
// drawn and what is marked correct cannot drift apart. Framework-free.

/** Whether `d` divides `n` completely (no remainder). Both must be positive whole numbers. */
export function isFactor(n: number, d: number): boolean {
	return Number.isInteger(n) && Number.isInteger(d) && n > 0 && d > 0 && n % d === 0;
}

/** All factors of `n`, ascending. */
export function factors(n: number): number[] {
	const small: number[] = [];
	const large: number[] = [];
	for (let d = 1; d * d <= n; d++) {
		if (!isFactor(n, d)) continue;
		small.push(d);
		if (d !== n / d) large.unshift(n / d);
	}
	return [...small, ...large];
}

/** Whether `n` is prime: exactly two factors, 1 and itself. */
export function isPrime(n: number): boolean {
	return n > 1 && factors(n).length === 2;
}

/** Tiles left over when `total` tiles are put into rows of `size`. */
export function leftover(total: number, size: number): number {
	return total % size;
}

/**
 * The factors discovered after trying rows of `size` with `total` tiles. A row
 * size that makes complete rows reveals a factor pair — `size` and `total / size`
 * — otherwise nothing new is found. Returns a new ascending list without repeats.
 */
export function discover(found: number[], total: number, size: number): number[] {
	if (!isFactor(total, size)) return found;
	return [...new Set([...found, size, total / size])].sort((a, b) => a - b);
}

/** Multiples of `n` up to and including `limit`, ascending (n, 2n, 3n, …). */
export function multiples(n: number, limit: number): number[] {
	if (!Number.isInteger(n) || n <= 0) return [];
	const result: number[] = [];
	for (let m = n; m <= limit; m += n) result.push(m);
	return result;
}

/** Whether `m` is a multiple of every number in `ns` — i.e. each divides it completely. */
export function isCommonMultiple(m: number, ns: number[]): boolean {
	return ns.length > 0 && ns.every((n) => isFactor(m, n));
}

/** Common multiples of `ns` up to and including `limit`, ascending. */
export function commonMultiples(ns: number[], limit: number): number[] {
	const result: number[] = [];
	for (let m = 1; m <= limit; m++) if (isCommonMultiple(m, ns)) result.push(m);
	return result;
}
