import { describe, expect, it } from 'vitest';
import {
	DIVISORS,
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
			expect(n).toBeLessThanOrEqual(500);
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
