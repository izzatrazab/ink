import { describe, expect, it, vi } from 'vitest';
import {
	MUTED_KEY,
	PROGRESS_KEY,
	startMultiplesHunt,
	type MultiplesHuntStorage
} from './multiplesHuntStore.svelte';
import { MASTERED_BOARDS, isCommon } from './multiplesHunt';
import type { Sounds } from './sound';

// Tested through the reactive interface only, the way the page drives it.

const memory = (initial: Record<string, string> = {}) => {
	const box = new Map(Object.entries(initial));
	const storage: MultiplesHuntStorage = {
		read: (key) => box.get(key) ?? null,
		write: (key, value) => void box.set(key, value)
	};
	return { box, storage };
};

const spy = () => ({ success: vi.fn(), wrong: vi.fn(), done: vi.fn() }) satisfies Sounds;

let x = 0.37;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

const make = (over: Parameters<typeof startMultiplesHunt>[0] = {}) =>
	startMultiplesHunt({ rng, storage: memory().storage, ...over });
type Game = ReturnType<typeof make>;

const hitsOn = (g: Game) => g.board.filter((n) => isCommon(g.set, n));
const missesOn = (g: Game) => g.board.filter((n) => !isCommon(g.set, n));
/** Finds every multiple, with no mistakes. */
const findAll = (g: Game) => hitsOn(g).forEach((n) => g.tap(n));

describe('startMultiplesHunt', () => {
	it('has no board until started, so server and client render alike', () => {
		const g = make();
		expect(g.board).toEqual([]);
		g.start();
		expect(g.board).toHaveLength(16);
		expect(g.set).toHaveLength(1);
		expect(g.kind).toBe('one');
	});

	it('judges a tap at once: a multiple is found, anything else is wrong', () => {
		const g = make();
		g.start();
		const [hit] = hitsOn(g);
		const [bad] = missesOn(g);
		g.tap(hit);
		expect(g.found).toEqual([hit]);
		expect(g.lastWrong).toBeNull();
		g.tap(bad);
		expect(g.wrong).toEqual([bad]);
		expect(g.lastWrong).toBe(bad);
	});

	it('counts what is left and finishes with 3 stars on a clean Board', () => {
		const { box, storage } = memory();
		const g = make({ storage });
		g.start();
		expect(g.left).toBe(hitsOn(g).length);
		findAll(g);
		expect(g.left).toBe(0);
		expect(g.result).toEqual({ mistakes: 0, stars: 3 });
		expect(g.streak).toBe(1);
		expect(JSON.parse(box.get(PROGRESS_KEY)!)).toEqual({ one: 1 });
	});

	it('does not count a Board with a mistake, and ends the streak', () => {
		const g = make();
		g.start();
		findAll(g);
		g.next();
		g.tap(missesOn(g)[0]);
		findAll(g);
		expect(g.result?.stars).toBe(2);
		expect(g.progress).toEqual({ one: 1 });
		expect(g.streak).toBe(0);
	});

	it('ignores taps once the Board is finished', () => {
		const g = make();
		g.start();
		findAll(g);
		g.tap(missesOn(g)[0]);
		expect(g.wrong).toEqual([]);
	});

	it('locks the next kind until this one is mastered, then unlocks it and deals two numbers', () => {
		const g = make();
		g.start();
		g.selectKind('two');
		expect(g.kind).toBe('one');
		for (let i = 0; i < MASTERED_BOARDS; i++) {
			g.next();
			findAll(g);
		}
		expect(g.justUnlocked).toBe('two');
		g.selectKind('two');
		expect(g.kind).toBe('two');
		expect(g.set).toHaveLength(2);
	});

	it('sounds a rising chime per find, a buzz per slip and a flourish at the end', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		g.tap(missesOn(g)[0]);
		findAll(g);
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
		findAll(g);
		expect(sounds.success).not.toHaveBeenCalled();
		expect(box.get(MUTED_KEY)).toBe('1');
		const again = make({ storage });
		again.start();
		expect(again.muted).toBe(true);
	});

	it('carries on when storage is blocked', () => {
		const storage: MultiplesHuntStorage = {
			read: () => {
				throw new Error('blocked');
			},
			write: () => {
				throw new Error('blocked');
			}
		};
		const g = make({ storage });
		g.start();
		expect(() => findAll(g)).not.toThrow();
		expect(g.result?.stars).toBe(3);
	});
});

describe('combo and replay', () => {
	it('counts correct taps in a row, and a wrong tap ends the run', () => {
		const g = make();
		g.start();
		const [a, b, c] = hitsOn(g);
		g.tap(a);
		g.tap(b);
		expect(g.combo).toBe(2);
		g.tap(missesOn(g)[0]);
		expect(g.combo).toBe(0);
		expect(g.bestCombo).toBe(2);
		g.tap(c);
		expect(g.combo).toBe(1);
	});

	it('replays the same board for stars, without counting it toward progress or the streak', () => {
		const g = make();
		g.start();
		g.tap(missesOn(g)[0]);
		findAll(g);
		expect(g.result?.stars).toBe(2);
		const board = [...g.board];
		g.retry();
		expect(g.board).toEqual(board);
		expect(g.set).toHaveLength(1);
		findAll(g);
		expect(g.result?.stars).toBe(3);
		expect(g.progress).toEqual({});
		expect(g.streak).toBe(0);
		g.next();
		expect(g.retrying).toBe(false);
	});
});
