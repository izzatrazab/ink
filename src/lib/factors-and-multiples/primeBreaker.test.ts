import { describe, expect, it } from 'vitest';
import {
	BOSSES,
	DIVISORS,
	MAX_OWN,
	OWN_DIVISORS,
	isBoss,
	ownNumber,
	KINDS,
	MASTERED_ROUNDS,
	applyRound,
	freshPlay,
	makeRound,
	parseProgress,
	scoreRound,
	tapDivisor,
	unlockedKinds
} from './primeBreaker';
import { autoDivisors } from './ladder';
import { hcf, lcm } from './numbers';

let x = 0.123;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

describe('makeRound', () => {
	it('deals a single number with enough rungs to be a Round', () => {
		for (let i = 0; i < 200; i++) {
			const [n, ...rest] = makeRound('single', rng);
			expect(rest).toEqual([]);
			expect(n).toBeGreaterThanOrEqual(12);
			expect(n <= 500 || isBoss([n])).toBe(true);
			expect(autoDivisors([n], 'single').length).toBeGreaterThanOrEqual(3);
		}
	});
	it('only ever needs the offered primes', () => {
		for (const kind of KINDS) {
			for (let i = 0; i < 200; i++) {
				const row = makeRound(kind, rng);
				expect(
					autoDivisors(row, kind).every((d) => (DIVISORS as readonly number[]).includes(d))
				).toBe(true);
			}
		}
	});
	it('deals distinct numbers whose HCF is more than 1', () => {
		for (let i = 0; i < 200; i++) {
			const row = makeRound('hcf', rng);
			expect(new Set(row).size).toBe(row.length);
			expect(hcf(row)).toBeGreaterThan(1);
		}
	});
	it('deals LCM numbers where none divides another', () => {
		for (let i = 0; i < 200; i++) {
			const row = makeRound('lcm', rng);
			expect(new Set(row).size).toBe(row.length);
			expect(row.some((a) => row.some((b) => a !== b && b % a === 0))).toBe(false);
			expect(lcm(row)).toBeLessThanOrEqual(600);
		}
	});
	it('never repeats the previous Round', () => {
		let prev = makeRound('hcf', rng);
		for (let i = 0; i < 100; i++) {
			const next = makeRound('hcf', rng, prev);
			expect(next).not.toEqual(prev);
			prev = next;
		}
	});
});

describe('tapDivisor', () => {
	it('accepts a prime that fits and adds a rung', () => {
		const t = tapDivisor([60], freshPlay(), 2, 'single');
		expect(t).toMatchObject({ outcome: 'accepted', next: [30] });
		expect(t.play.divisors).toEqual([2]);
	});
	it('refuses a prime that does not fit, once per rung', () => {
		const first = tapDivisor([60], freshPlay(), 7, 'single');
		expect(first.outcome).toBe('refused');
		expect(first.play.mistakes).toEqual([{ d: 7, rung: 0 }]);
		const again = tapDivisor([60], first.play, 7, 'single');
		expect(again.outcome).toBe('ignored');
		expect(again.play.mistakes).toHaveLength(1);
	});
	it('counts the same refusal again on a later rung', () => {
		const slip = tapDivisor([60], freshPlay(), 7, 'single').play;
		const moved = tapDivisor([60], slip, 2, 'single').play;
		const again = tapDivisor([30], moved, 7, 'single');
		expect(again.outcome).toBe('refused');
		expect(again.play.mistakes).toHaveLength(2);
	});
	it('follows the kind: HCF refuses a prime that misses one number, LCM accepts it', () => {
		expect(tapDivisor([12, 18], freshPlay(), 2, 'hcf').outcome).toBe('accepted');
		expect(tapDivisor([12, 15], freshPlay(), 2, 'hcf').outcome).toBe('refused');
		expect(tapDivisor([12, 15], freshPlay(), 2, 'lcm')).toMatchObject({ next: [6, 15] });
	});
});

describe('scoring and progress', () => {
	it('gives 3, 2 or 1 stars by mistakes', () => {
		expect(scoreRound(0).stars).toBe(3);
		expect(scoreRound(1).stars).toBe(2);
		expect(scoreRound(4).stars).toBe(1);
	});
	it('counts only mistake-free Rounds', () => {
		expect(applyRound({}, 'hcf', 0)).toEqual({ hcf: 1 });
		expect(applyRound({ hcf: 1 }, 'hcf', 2)).toEqual({ hcf: 1 });
	});
	it('unlocks each kind after the one before is mastered', () => {
		expect(unlockedKinds({})).toEqual(['single']);
		expect(unlockedKinds({ single: MASTERED_ROUNDS })).toEqual(['single', 'hcf']);
		expect(unlockedKinds({ single: MASTERED_ROUNDS, hcf: MASTERED_ROUNDS })).toEqual([...KINDS]);
		expect(unlockedKinds({ lcm: 9 })).toEqual(['single']);
	});
	it('reads saved progress defensively', () => {
		expect(parseProgress(null)).toEqual({});
		expect(parseProgress('nope')).toEqual({});
		expect(parseProgress('[1]')).toEqual({});
		expect(parseProgress('{"single":2,"hcf":-1,"lcm":"x","other":4}')).toEqual({ single: 2 });
	});
});

describe('boss Rounds', () => {
	it('are dealt now and then, and need only the offered primes', () => {
		const rows = Array.from({ length: 600 }, () => makeRound('single', rng));
		const bosses = rows.filter(isBoss);
		expect(bosses.length).toBeGreaterThan(20);
		expect(bosses.length).toBeLessThan(120);
		for (const [n] of bosses) {
			expect((BOSSES as readonly number[]).includes(n)).toBe(true);
			expect(
				autoDivisors([n], 'single').every((d) => (DIVISORS as readonly number[]).includes(d))
			).toBe(true);
		}
	});
	it('are only for prime factors, never for HCF or LCM', () => {
		for (const kind of ['hcf', 'lcm'] as const) {
			for (let i = 0; i < 200; i++) expect(makeRound(kind, rng).some((n) => n > 400)).toBe(false);
		}
	});
});

describe('ownNumber', () => {
	it('accepts whole numbers whose prime factors are all offered', () => {
		expect(ownNumber('360')).toBe(360);
		expect(ownNumber(' 2024 ')).toBe(2024); // 2 × 2 × 2 × 11 × 23
		expect(ownNumber('2')).toBe(2);
		expect(ownNumber(String(MAX_OWN))).toBe(null); // 9999 = 3 × 3 × 11 × 101
		expect(ownNumber('9990')).toBe(null); // 2 × 3 × 3 × 3 × 5 × 37
		expect(ownNumber('9801')).toBe(9801); // 3^4 × 11^2
	});
	it('refuses what cannot be broken with the offered primes, or is not a plain number', () => {
		for (const bad of ['', '1', '0', '37', '2003', '10000', '12.5', '-8', 'abc', '1e3']) {
			expect(ownNumber(bad), bad).toBeNull();
		}
		expect(ownNumber(' 12 ')).toBe(12);
	});
	it('offers a button for every prime it accepts', () => {
		for (let n = 2; n <= 500; n++) {
			if (ownNumber(String(n)) !== null) {
				expect(
					autoDivisors([n], 'single').every((d) => (OWN_DIVISORS as readonly number[]).includes(d))
				).toBe(true);
			}
		}
	});
});
