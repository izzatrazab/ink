import { describe, expect, it, vi } from 'vitest';
import {
	MUTED_KEY,
	PROGRESS_KEY,
	startPrimeBreaker,
	type PrimeBreakerStorage
} from './primeBreakerStore.svelte';
import { DIVISORS, MASTERED_ROUNDS } from './primeBreaker';
import { autoDivisors, tryDivisor } from './ladder';
import type { Sounds } from './sound';

// Tested through the reactive interface only, the way the page drives it.

const memory = (initial: Record<string, string> = {}) => {
	const box = new Map(Object.entries(initial));
	const storage: PrimeBreakerStorage = {
		read: (key) => box.get(key) ?? null,
		write: (key, value) => void box.set(key, value)
	};
	return { box, storage };
};

const spy = () => ({ success: vi.fn(), wrong: vi.fn(), done: vi.fn() }) satisfies Sounds;

let x = 0.37;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

const make = (over: Parameters<typeof startPrimeBreaker>[0] = {}) =>
	startPrimeBreaker({ rng, storage: memory().storage, ...over });
type Game = ReturnType<typeof make>;

/** Finishes the Round with no mistake, taking the ladder's own smallest prime each time. */
const solve = (g: Game) => autoDivisors(g.startRow, g.kind).forEach((d) => g.tap(d));
/** A prime the ladder refuses on the current row. */
const wrongPrime = (g: Game) =>
	DIVISORS.find((d) => !tryDivisor(g.current, d, g.kind).ok) as number;

describe('startPrimeBreaker', () => {
	it('has no Round until started, so server and client render alike', () => {
		const g = make();
		expect(g.startRow).toEqual([]);
		expect(g.rows).toEqual([]);
		g.start();
		expect(g.startRow).toHaveLength(1);
		expect(g.kind).toBe('single');
	});

	it('adds a row for an accepted prime and says why a refused one was refused', () => {
		const g = make();
		g.start();
		const [first] = autoDivisors(g.startRow, 'single');
		g.tap(first);
		expect(g.rows).toHaveLength(2);
		const bad = wrongPrime(g);
		g.tap(bad);
		expect(g.mistakes).toBe(1);
		expect(g.refusal).toMatchObject({ d: bad, before: g.current });
		g.tap(autoDivisors(g.current, 'single')[0]);
		expect(g.refusal).toBeNull();
	});

	it('counts one slip once, however often the same prime is tapped on a rung', () => {
		const g = make();
		g.start();
		const bad = wrongPrime(g);
		g.tap(bad);
		g.tap(bad);
		g.tap(bad);
		expect(g.mistakes).toBe(1);
	});

	it('finishes with 3 stars and counts a clean Round toward Progress', () => {
		const { box, storage } = memory();
		const g = make({ storage });
		g.start();
		solve(g);
		expect(g.result).toEqual({ mistakes: 0, stars: 3 });
		expect(g.streak).toBe(1);
		expect(g.progress).toEqual({ single: 1 });
		expect(JSON.parse(box.get(PROGRESS_KEY)!)).toEqual({ single: 1 });
	});

	it('does not count a Round with a mistake, and ends the streak', () => {
		const g = make();
		g.start();
		solve(g);
		g.next();
		g.tap(wrongPrime(g));
		solve(g);
		expect(g.result?.stars).toBe(2);
		expect(g.progress).toEqual({ single: 1 });
		expect(g.streak).toBe(0);
	});

	it('ignores taps once the Round is finished', () => {
		const g = make();
		g.start();
		solve(g);
		const rows = g.rows.length;
		g.tap(2);
		expect(g.rows).toHaveLength(rows);
	});

	it('locks the next kind until this one is mastered, then unlocks it', () => {
		const g = make();
		g.start();
		g.selectKind('hcf');
		expect(g.kind).toBe('single');
		for (let i = 0; i < MASTERED_ROUNDS; i++) {
			g.next();
			solve(g);
		}
		expect(g.justUnlocked).toBe('hcf');
		g.selectKind('hcf');
		expect(g.kind).toBe('hcf');
		expect(g.startRow.length).toBeGreaterThanOrEqual(2);
	});

	it('plays an HCF Round to its end, where no prime fits every number', () => {
		const g = make({ storage: memory({ [PROGRESS_KEY]: '{"single":3}' }).storage });
		g.start();
		g.selectKind('hcf');
		solve(g);
		expect(g.result?.stars).toBe(3);
	});

	it('sounds a rising chime per rung, a buzz per slip and a flourish at the end', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		g.tap(wrongPrime(g));
		solve(g);
		expect(sounds.wrong).toHaveBeenCalledTimes(1);
		expect(sounds.success).toHaveBeenCalledWith(0);
		expect(sounds.done).toHaveBeenCalledTimes(1);
	});

	it('stays quiet when muted, and remembers the setting', () => {
		const sounds = spy();
		const { box, storage } = memory();
		const g = make({ sounds, storage });
		g.start();
		g.toggleMute();
		solve(g);
		expect(sounds.success).not.toHaveBeenCalled();
		expect(box.get(MUTED_KEY)).toBe('1');
		expect(make({ storage }).muted).toBe(false);
		const again = make({ storage });
		again.start();
		expect(again.muted).toBe(true);
	});

	it('carries on when storage is blocked', () => {
		const storage: PrimeBreakerStorage = {
			read: () => {
				throw new Error('blocked');
			},
			write: () => {
				throw new Error('blocked');
			}
		};
		const g = make({ storage });
		g.start();
		expect(() => solve(g)).not.toThrow();
		expect(g.result?.stars).toBe(3);
	});
});
