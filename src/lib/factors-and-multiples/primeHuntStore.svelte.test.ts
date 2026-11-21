import { describe, expect, it, vi } from 'vitest';
import {
	MUTED_KEY,
	PROGRESS_KEY,
	startPrimeHunt,
	type PrimeHuntStorage
} from './primeHuntStore.svelte';
import { KNOWN_STREAK, tierPrimes } from './primeHunt';
import { isPrime } from './numbers';
import type { Sounds } from './sound';

// Tested through the reactive interface only, the way the page drives it.

const memory = (initial: Record<string, string> = {}) => {
	const box = new Map(Object.entries(initial));
	const storage: PrimeHuntStorage = {
		read: (key) => box.get(key) ?? null,
		write: (key, value) => void box.set(key, value)
	};
	return { box, storage };
};

const spy = () => {
	const sounds: Sounds = { success: vi.fn(), wrong: vi.fn(), done: vi.fn() };
	return sounds;
};

let x = 0.37;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

const make = (over: Parameters<typeof startPrimeHunt>[0] = {}) =>
	startPrimeHunt({ rng, storage: memory().storage, ...over });
type Game = ReturnType<typeof make>;

const primesOn = (g: Game) => g.board.filter(isPrime);
const wrongOn = (g: Game) => g.board.filter((n) => !isPrime(n));
/** Finds every prime, with no mistakes. */
const findAll = (g: Game) => primesOn(g).forEach((n) => g.tap(n));

describe('startPrimeHunt', () => {
	it('has no board until started, so server and client render alike', () => {
		const g = make();
		expect(g.board).toEqual([]);
		g.start();
		expect(g.board).toHaveLength(16);
		expect(g.tier).toBe(20);
	});

	it('judges a tap at once: a prime is found, a non-prime is wrong', () => {
		const g = make();
		g.start();
		const [p] = primesOn(g);
		const [w] = wrongOn(g);
		g.tap(p);
		expect(g.found).toEqual([p]);
		expect(g.lastWrong).toBeNull();
		g.tap(w);
		expect(g.wrong).toEqual([w]);
		expect(g.lastWrong).toBe(w);
	});

	it('counts the primes left to find', () => {
		const g = make();
		g.start();
		const primes = primesOn(g);
		expect(g.primesOnBoard).toBe(primes.length);
		expect(g.left).toBe(primes.length);
		g.tap(primes[0]);
		expect(g.left).toBe(primes.length - 1);
		// A wrong tap is not a find: it leaves the count alone.
		g.tap(wrongOn(g)[0]);
		expect(g.left).toBe(primes.length - 1);
	});

	it('ignores a number tapped twice, one not on the board, and taps after the board is done', () => {
		const g = make();
		g.start();
		const [p] = primesOn(g);
		g.tap(p);
		g.tap(p);
		g.tap(9999);
		expect(g.found).toEqual([p]);
		findAll(g);
		const before = [...g.wrong];
		g.tap(wrongOn(g)[0]);
		expect(g.wrong).toEqual(before);
	});

	it('clears the wrong-tap alert once the next prime is found', () => {
		const g = make();
		g.start();
		g.tap(wrongOn(g)[0]);
		expect(g.lastWrong).not.toBeNull();
		g.tap(primesOn(g)[0]);
		expect(g.lastWrong).toBeNull();
	});

	it('finishes the board when the last prime is found, with stars for the mistakes', () => {
		const g = make();
		g.start();
		expect(g.result).toBeNull();
		findAll(g);
		expect(g.result).toEqual({ mistakes: 0, stars: 3 });

		g.next();
		g.tap(wrongOn(g)[0]);
		findAll(g);
		expect(g.result).toEqual({ mistakes: 1, stars: 2 });
	});

	it('counts perfect boards in a row and resets on a slip', () => {
		const g = make();
		g.start();
		findAll(g);
		g.next();
		findAll(g);
		expect(g.streak).toBe(2);
		g.next();
		g.tap(wrongOn(g)[0]);
		findAll(g);
		expect(g.streak).toBe(0);
	});

	it('only counts primes found before the first mistake toward progress', () => {
		const g = make();
		g.start();
		const [first, ...rest] = primesOn(g);
		g.tap(first);
		g.tap(wrongOn(g)[0]);
		rest.forEach((n) => g.tap(n));
		expect(g.progress).toEqual({ [first]: 1 });
	});

	it('next deals a fresh board with nothing tapped', () => {
		const g = make();
		g.start();
		g.tap(wrongOn(g)[0]);
		g.next();
		expect(g.found).toEqual([]);
		expect(g.wrong).toEqual([]);
		expect(g.result).toBeNull();
		expect(g.lastWrong).toBeNull();
		expect(g.board).toHaveLength(16);
	});

	it('saves progress when a board finishes and loads it on start', () => {
		const { box, storage } = memory();
		const g = make({ storage });
		g.start();
		findAll(g);
		expect(JSON.parse(box.get(PROGRESS_KEY)!)).toEqual(
			Object.fromEntries(primesOn(g).map((p) => [p, 1]))
		);
		const again = make({ storage });
		again.start();
		expect(again.progress).toEqual(g.progress);
	});

	it('survives broken or unavailable storage', () => {
		const broken: PrimeHuntStorage = {
			read: () => {
				throw new Error('blocked');
			},
			write: () => {
				throw new Error('blocked');
			}
		};
		const g = make({ storage: broken });
		expect(() => {
			g.start();
			findAll(g);
			g.toggleMute();
		}).not.toThrow();
		expect(make({ storage: memory({ [PROGRESS_KEY]: 'garbage' }).storage }).progress).toEqual({});
	});

	it('locks later tiers until the one before is mastered, then announces the unlock', () => {
		const known = Object.fromEntries(tierPrimes(20).map((p) => [p, KNOWN_STREAK - 1]));
		const g = make({ storage: memory({ [PROGRESS_KEY]: JSON.stringify(known) }).storage });
		g.start();
		expect(g.unlocked).toEqual([20]);
		g.selectTier(50);
		expect(g.tier).toBe(20); // locked: ignored

		let guard = 0;
		while (!g.unlocked.includes(50) && guard++ < 50) {
			findAll(g);
			if (!g.unlocked.includes(50)) g.next();
		}
		expect(g.unlocked).toEqual([20, 50]);
		expect(g.justUnlocked).toBe(50);
		g.next();
		expect(g.justUnlocked).toBeNull();
		g.selectTier(50);
		expect(g.tier).toBe(50);
		expect(Math.max(...g.board)).toBeGreaterThan(20);
	});

	it('reports how many primes of the tier are known', () => {
		const stored = JSON.stringify({ 2: KNOWN_STREAK, 3: 1 });
		const g = make({ storage: memory({ [PROGRESS_KEY]: stored }).storage });
		g.start();
		expect(g.knownCount).toBe(1);
		expect(g.tierTotal).toBe(8);
	});
});

describe('sound', () => {
	it('plays a rising chime per prime found, a buzz for a wrong tap, and a flourish when done', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		const primes = primesOn(g);
		g.tap(primes[0]);
		g.tap(primes[1]);
		expect(sounds.success).toHaveBeenNthCalledWith(1, 0);
		expect(sounds.success).toHaveBeenNthCalledWith(2, 1);
		g.tap(wrongOn(g)[0]);
		expect(sounds.wrong).toHaveBeenCalledTimes(1);
		expect(sounds.done).not.toHaveBeenCalled();
		primes.slice(2).forEach((n) => g.tap(n));
		expect(sounds.done).toHaveBeenCalledTimes(1);
	});

	it('stays quiet for ignored taps', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		g.tap(9999);
		const [p] = primesOn(g);
		g.tap(p);
		g.tap(p);
		expect(sounds.success).toHaveBeenCalledTimes(1);
	});

	it('is silent while muted, and the choice is remembered', () => {
		const { box, storage } = memory();
		const sounds = spy();
		const g = make({ sounds, storage });
		g.start();
		expect(g.muted).toBe(false);
		g.toggleMute();
		expect(g.muted).toBe(true);
		g.tap(primesOn(g)[0]);
		g.tap(wrongOn(g)[0]);
		expect(sounds.success).not.toHaveBeenCalled();
		expect(sounds.wrong).not.toHaveBeenCalled();
		expect(box.get(MUTED_KEY)).toBe('1');

		const again = make({ storage });
		again.start();
		expect(again.muted).toBe(true);
		again.toggleMute();
		expect(box.get(MUTED_KEY)).toBe('0');
	});
});
