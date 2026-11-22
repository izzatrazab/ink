import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BEST_KEY, startPrimeBlitz, type PrimeBlitzStorage } from './primeBlitzStore.svelte';
import { isPrime } from './numbers';
import type { Sounds } from './sound';

// Tested through the reactive interface only, with the clock faked.

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const memory = (initial: Record<string, string> = {}) => {
	const box = new Map(Object.entries(initial));
	const storage: PrimeBlitzStorage = {
		read: (key) => box.get(key) ?? null,
		write: (key, value) => void box.set(key, value)
	};
	return { box, storage };
};

const spy = () => ({ success: vi.fn(), wrong: vi.fn(), done: vi.fn() }) satisfies Sounds;

let x = 0.37;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

const make = (over: Parameters<typeof startPrimeBlitz>[0] = {}) =>
	startPrimeBlitz({ rng, storage: memory().storage, seconds: 5, ...over });
type Game = ReturnType<typeof make>;

const primes = (g: Game) => g.board.filter(isPrime);
const nonPrimes = (g: Game) => g.board.filter((n) => !isPrime(n));
const second = () => vi.advanceTimersByTime(1000);

describe('startPrimeBlitz', () => {
	it('deals a Board and starts the clock on begin', () => {
		const g = make();
		g.begin(20);
		expect(g.running).toBe(true);
		expect(g.board).toHaveLength(16);
		expect(g.secondsLeft).toBe(5);
		second();
		expect(g.secondsLeft).toBe(4);
		g.stop();
	});

	it('scores a point per prime and takes one for a wrong tap, never below 0', () => {
		const g = make();
		g.begin(20);
		g.tap(nonPrimes(g)[0]);
		expect(g.score).toBe(0);
		g.tap(primes(g)[0]);
		g.tap(primes(g)[1]);
		expect(g.score).toBe(2);
		g.tap(nonPrimes(g)[1]);
		expect(g.score).toBe(1);
		g.stop();
	});

	it('deals a new Board the moment one is cleared, without stopping the clock', () => {
		const g = make();
		g.begin(20);
		const first = [...g.board];
		primes(g).forEach((p) => g.tap(p));
		expect(g.cleared).toBe(1);
		expect(g.board).not.toEqual(first);
		expect(g.running).toBe(true);
		expect(g.play.found).toEqual([]);
		g.stop();
	});

	it('counts runs of finds, and a wrong tap ends the run', () => {
		const g = make();
		g.begin(20);
		const [a, b, c] = primes(g);
		g.tap(a);
		g.tap(b);
		g.tap(nonPrimes(g)[0]);
		g.tap(c);
		expect(g.combo).toBe(1);
		expect(g.bestCombo).toBe(2);
		g.stop();
	});

	it('ends when time is up, ignores taps after, and keeps a new best', () => {
		const { box, storage } = memory();
		const sounds = spy();
		const g = make({ storage, sounds });
		g.begin(20);
		g.tap(primes(g)[0]);
		g.tap(primes(g)[1]);
		for (let i = 0; i < 5; i++) second();
		expect(g.over).toBe(true);
		expect(g.running).toBe(false);
		expect(g.isBest).toBe(true);
		expect(g.bestHere).toBe(2);
		expect(JSON.parse(box.get(BEST_KEY)!)).toEqual({ 20: 2 });
		expect(sounds.done).toHaveBeenCalledTimes(1);
		g.tap(primes(g)[2]);
		expect(g.score).toBe(2);
	});

	it('keeps the old best when a run does worse, and loads saved bests', () => {
		const { storage } = memory({ [BEST_KEY]: '{"20":9}' });
		const g = make({ storage });
		g.load();
		expect(g.best).toEqual({ 20: 9 });
		g.begin(20);
		g.tap(primes(g)[0]);
		for (let i = 0; i < 5; i++) second();
		expect(g.isBest).toBe(false);
		expect(g.bestHere).toBe(9);
	});

	it('starts a fresh run cleanly after one has ended, and keeps bests per tier', () => {
		const g = make();
		g.begin(20);
		g.tap(primes(g)[0]);
		for (let i = 0; i < 5; i++) second();
		g.begin(50);
		expect(g.over).toBe(false);
		expect(g.score).toBe(0);
		expect(g.secondsLeft).toBe(5);
		expect(g.bestHere).toBe(0);
		g.stop();
	});

	it('stays quiet when muted and carries on when storage is blocked', () => {
		const sounds = spy();
		const storage: PrimeBlitzStorage = {
			read: () => {
				throw new Error('blocked');
			},
			write: () => {
				throw new Error('blocked');
			}
		};
		const g = make({ sounds, storage });
		g.load();
		g.toggleMute();
		g.begin(20);
		g.tap(primes(g)[0]);
		expect(() => {
			for (let i = 0; i < 5; i++) second();
		}).not.toThrow();
		expect(sounds.success).not.toHaveBeenCalled();
		expect(g.over).toBe(true);
	});
});
