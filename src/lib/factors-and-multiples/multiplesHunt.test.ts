import { describe, expect, it } from 'vitest';
import {
	BOARD_SIZE,
	KINDS,
	MASTERED_BOARDS,
	applyBoard,
	freshPlay,
	isCommon,
	isComplete,
	makeRound,
	miss,
	multiplesOn,
	parseProgress,
	rangeFor,
	scoreBoard,
	tapNumber,
	unlockedKinds
} from './multiplesHunt';
import { lcm } from './numbers';

let x = 0.123;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

describe('makeRound', () => {
	it('deals 16 distinct numbers in range, for every kind', () => {
		for (const kind of KINDS) {
			for (let i = 0; i < 200; i++) {
				const { set, board } = makeRound(kind, rng);
				expect(board).toHaveLength(BOARD_SIZE);
				expect(new Set(board).size).toBe(BOARD_SIZE);
				expect(Math.min(...board)).toBeGreaterThanOrEqual(2);
				expect(Math.max(...board)).toBeLessThanOrEqual(rangeFor(set));
			}
		}
	});
	it('deals as many numbers to be a multiple of as the kind says', () => {
		expect(makeRound('one', rng).set).toHaveLength(1);
		expect(makeRound('two', rng).set).toHaveLength(2);
		expect(makeRound('three', rng).set).toHaveLength(3);
	});
	it('always has enough multiples to hunt, and the right ones', () => {
		for (const kind of KINDS) {
			for (let i = 0; i < 200; i++) {
				const round = makeRound(kind, rng);
				const hits = multiplesOn(round);
				expect(hits.length).toBeGreaterThanOrEqual(3);
				expect(hits.every((n) => n % lcm(round.set) === 0)).toBe(true);
			}
		}
	});
	it('sets a trap in common-multiple Boards: multiples of some number but not all', () => {
		for (const kind of ['two', 'three'] as const) {
			for (let i = 0; i < 100; i++) {
				const { set, board } = makeRound(kind, rng);
				const traps = board.filter((n) => !isCommon(set, n) && set.some((s) => n % s === 0));
				expect(traps.length).toBeGreaterThanOrEqual(5);
			}
		}
	});
	it('never deals a set where one number is a multiple of all the rest', () => {
		for (let i = 0; i < 200; i++) {
			const { set } = makeRound('two', rng);
			expect(lcm(set)).toBeGreaterThan(Math.max(...set));
		}
	});
	it('never repeats the previous set', () => {
		let prev = makeRound('two', rng).set;
		for (let i = 0; i < 100; i++) {
			const next = makeRound('two', rng, prev).set;
			expect(next).not.toEqual(prev);
			prev = next;
		}
	});
});

describe('tapNumber', () => {
	const round = { set: [4, 6], board: [12, 8, 24, 18, 5] };
	it('finds a common multiple and calls a one-sided multiple wrong', () => {
		expect(tapNumber(round, freshPlay(), 12)).toMatchObject({ outcome: 'found' });
		const wrong = tapNumber(round, freshPlay(), 8);
		expect(wrong.outcome).toBe('wrong');
		expect(wrong.play.wrong).toEqual([8]);
	});
	it('ignores a repeat tap and a number not on the board', () => {
		const once = tapNumber(round, freshPlay(), 12).play;
		expect(tapNumber(round, once, 12).outcome).toBe('ignored');
		expect(tapNumber(round, freshPlay(), 99).outcome).toBe('ignored');
	});
	it('completes when every common multiple is found', () => {
		let play = freshPlay();
		for (const n of [12, 24]) play = tapNumber(round, play, n).play;
		expect(isComplete(round, play)).toBe(true);
	});
});

describe('miss', () => {
	it('says which number is missed and how', () => {
		expect(miss([4], 13)).toEqual({ s: 4, rest: 1, of: null });
	});
	it('names the number a trap IS a multiple of', () => {
		expect(miss([4, 6], 8)).toEqual({ s: 6, rest: 2, of: 4 });
	});
	it('is null for a common multiple', () => {
		expect(miss([4, 6], 12)).toBeNull();
	});
});

describe('scoring and progress', () => {
	it('gives 3, 2 or 1 stars by mistakes', () => {
		expect(scoreBoard(0).stars).toBe(3);
		expect(scoreBoard(1).stars).toBe(2);
		expect(scoreBoard(5).stars).toBe(1);
	});
	it('counts only mistake-free Boards, and unlocks kinds in order', () => {
		expect(applyBoard({}, 'one', 0)).toEqual({ one: 1 });
		expect(applyBoard({ one: 1 }, 'one', 2)).toEqual({ one: 1 });
		expect(unlockedKinds({})).toEqual(['one']);
		expect(unlockedKinds({ one: MASTERED_BOARDS })).toEqual(['one', 'two']);
		expect(unlockedKinds({ three: 9 })).toEqual(['one']);
	});
	it('reads saved progress defensively', () => {
		expect(parseProgress(null)).toEqual({});
		expect(parseProgress('nope')).toEqual({});
		expect(parseProgress('{"one":2,"two":-1,"three":"x"}')).toEqual({ one: 2 });
	});
});
