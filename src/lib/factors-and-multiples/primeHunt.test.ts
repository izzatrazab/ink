import { describe, expect, it } from 'vitest';
import {
	BOARD_SIZE,
	KNOWN_STREAK,
	TIERS,
	applyBoard,
	freshPlay,
	isComplete,
	isKnown,
	lookAlikes,
	makeBoard,
	parseProgress,
	scoreBoard,
	tapNumber,
	tierMastered,
	tierPrimes,
	unlockedTiers,
	witness,
	type Progress
} from './primeHunt';
import { isPrime } from './numbers';

/** A deterministic stand-in for Math.random: cycles through a fixed list. */
const seq = (...values: number[]) => {
	let i = 0;
	return () => values[i++ % values.length];
};
/** A spread of values so every draw differs. */
const spread = () => {
	let x = 0.1234;
	return () => (x = (x * 9301 + 0.49297) % 1);
};

describe('tiers', () => {
	it('lists the primes of each tier', () => {
		expect(tierPrimes(20)).toEqual([2, 3, 5, 7, 11, 13, 17, 19]);
		expect(tierPrimes(50)).toHaveLength(15);
		expect(tierPrimes(100)).toHaveLength(25);
	});
	it('offers 2–20, 2–50 and 2–100', () => {
		expect(TIERS).toEqual([20, 50, 100]);
	});
	it('finds look-alikes: odd composites that pass for prime', () => {
		const la = lookAlikes(100);
		expect(la).toEqual(expect.arrayContaining([9, 51, 57, 87, 91]));
		expect(la.every((n) => n % 2 === 1 && n % 5 !== 0 && !isPrime(n) && n > 1)).toBe(true);
		expect(lookAlikes(20)).toEqual([9]);
	});
});

describe('makeBoard', () => {
	it.each(TIERS)('makes %i-tier boards of 16 distinct numbers within the range', (max) => {
		for (let k = 0; k < 40; k++) {
			const board = makeBoard(max, {}, spread());
			expect(board).toHaveLength(BOARD_SIZE);
			expect(new Set(board).size).toBe(BOARD_SIZE);
			expect(board.every((n) => n >= 1 && n <= max)).toBe(true);
		}
	});
	it('holds six primes and gives look-alikes room', () => {
		const board = makeBoard(100, {}, spread());
		expect(board.filter(isPrime)).toHaveLength(6);
		expect(board.filter((n) => lookAlikes(100).includes(n)).length).toBeGreaterThanOrEqual(3);
	});
	it('includes 1 about one board in four', () => {
		expect(makeBoard(100, {}, seq(0.1))).toContain(1);
		expect(makeBoard(100, {}, seq(0.9, 0.3, 0.6))).not.toContain(1);
		const rng = spread();
		const withOne = Array.from({ length: 400 }, () => makeBoard(100, {}, rng)).filter((b) =>
			b.includes(1)
		).length;
		expect(withOne).toBeGreaterThan(60);
		expect(withOne).toBeLessThan(140);
	});
	it('favours primes that are not yet known', () => {
		const known: Progress = {};
		for (const p of tierPrimes(50)) if (p > 10) known[p] = KNOWN_STREAK;
		const rng = spread();
		let weak = 0;
		let total = 0;
		for (let k = 0; k < 200; k++) {
			for (const n of makeBoard(50, known, rng)) {
				if (isPrime(n)) {
					total++;
					if (!isKnown(known, n)) weak++;
				}
			}
		}
		// 4 of the 15 primes are unknown (2, 3, 5, 7); unweighted they'd be ~27% of the primes.
		expect(weak / total).toBeGreaterThan(0.4);
	});
});

describe('tapNumber', () => {
	const board = [2, 9, 11, 51, 1, 4];

	it('finds a prime and calls a non-prime wrong, straight away', () => {
		const a = tapNumber(board, freshPlay(), 2);
		expect(a.outcome).toBe('found');
		expect(a.play.found).toEqual([2]);
		const b = tapNumber(board, a.play, 51);
		expect(b.outcome).toBe('wrong');
		expect(b.play.wrong).toEqual([51]);
	});
	it('treats 1 as wrong', () => {
		expect(tapNumber(board, freshPlay(), 1).outcome).toBe('wrong');
	});
	it('ignores a number already tapped and one not on the board', () => {
		const a = tapNumber(board, freshPlay(), 2).play;
		expect(tapNumber(board, a, 2).outcome).toBe('ignored');
		const b = tapNumber(board, a, 51).play;
		expect(tapNumber(board, b, 51).outcome).toBe('ignored');
		expect(tapNumber(board, b, 9999).outcome).toBe('ignored');
	});
	it('counts a find as clean only while the board is mistake-free', () => {
		let play = tapNumber(board, freshPlay(), 2).play;
		play = tapNumber(board, play, 9).play; // a slip
		play = tapNumber(board, play, 11).play;
		expect(play.found).toEqual([2, 11]);
		expect(play.clean).toEqual([2]);
	});
	it('does not mutate the play it is given', () => {
		const start = freshPlay();
		tapNumber(board, start, 2);
		expect(start).toEqual({ found: [], wrong: [], clean: [] });
	});
	it('is complete once every prime on the board is found', () => {
		let play = freshPlay();
		expect(isComplete(board, play)).toBe(false);
		play = tapNumber(board, play, 2).play;
		play = tapNumber(board, play, 51).play;
		expect(isComplete(board, play)).toBe(false);
		play = tapNumber(board, play, 11).play;
		expect(isComplete(board, play)).toBe(true);
	});
});

describe('scoreBoard', () => {
	it('gives 3 stars for no mistakes, 2 for one, 1 for more', () => {
		expect(scoreBoard(0)).toEqual({ mistakes: 0, stars: 3 });
		expect(scoreBoard(1)).toEqual({ mistakes: 1, stars: 2 });
		expect(scoreBoard(2)).toEqual({ mistakes: 2, stars: 1 });
		expect(scoreBoard(9).stars).toBe(1);
	});
});

describe('witness', () => {
	it('shows a factor pair for a composite, using its smallest prime factor', () => {
		expect(witness(51)).toEqual({ kind: 'pair', a: 3, b: 17 });
		expect(witness(91)).toEqual({ kind: 'pair', a: 7, b: 13 });
		expect(witness(9)).toEqual({ kind: 'pair', a: 3, b: 3 });
	});
	it('says 1 has one factor and a prime has only 1 and itself', () => {
		expect(witness(1)).toEqual({ kind: 'one' });
		expect(witness(23)).toEqual({ kind: 'prime' });
	});
});

describe('progress', () => {
	it('adds one to the run of every clean find', () => {
		let p: Progress = {};
		p = applyBoard(p, [2, 3]);
		expect(p).toEqual({ 2: 1, 3: 1 });
		p = applyBoard(p, [2]);
		expect(p).toEqual({ 2: 2, 3: 1 });
	});
	it('leaves other primes alone', () => {
		expect(applyBoard({ 5: 1 }, [2])).toEqual({ 5: 1, 2: 1 });
	});
	it('knows a prime after two finds in a row', () => {
		expect(isKnown({ 7: KNOWN_STREAK - 1 }, 7)).toBe(false);
		expect(isKnown({ 7: KNOWN_STREAK }, 7)).toBe(true);
	});
	it('masters a tier when every prime in it is known, and unlocks the next', () => {
		const all20 = Object.fromEntries(tierPrimes(20).map((p) => [p, KNOWN_STREAK]));
		expect(tierMastered({}, 20)).toBe(false);
		expect(tierMastered(all20, 20)).toBe(true);
		expect(tierMastered(all20, 50)).toBe(false);
		expect(unlockedTiers({})).toEqual([20]);
		expect(unlockedTiers(all20)).toEqual([20, 50]);
	});
});

describe('parseProgress', () => {
	it('reads saved progress', () => {
		expect(parseProgress('{"2":2,"3":1}')).toEqual({ 2: 2, 3: 1 });
	});
	it('survives missing, broken or foreign data', () => {
		expect(parseProgress(null)).toEqual({});
		expect(parseProgress('not json')).toEqual({});
		expect(parseProgress('[1,2]')).toEqual({});
		expect(parseProgress('{"4":2,"x":1,"5":-3,"7":"a","11":2}')).toEqual({ 11: 2 });
	});
});
