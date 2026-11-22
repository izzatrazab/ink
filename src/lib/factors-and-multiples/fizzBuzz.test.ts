import { describe, expect, it } from 'vitest';
import {
	PAIRS,
	answerFor,
	choose,
	fizzBuzzes,
	freshPlay,
	isOver,
	makeRound,
	scoreRound,
	type Answer,
	type Round
} from './fizzBuzz';
import { lcm } from './numbers';

let x = 0.123;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

const classic: Round = { a: 3, b: 5, length: 30 };

describe('answerFor', () => {
	it('says Fizz, Buzz, FizzBuzz or just the number', () => {
		const said = [3, 5, 15, 7, 30, 9, 10].map((n) => answerFor(classic, n));
		expect(said).toEqual(['fizz', 'buzz', 'fizzbuzz', 'number', 'fizzbuzz', 'fizz', 'buzz']);
	});
	it('makes FizzBuzz exactly the common multiples of the pair', () => {
		expect(fizzBuzzes(classic)).toEqual([15, 30]);
		expect(fizzBuzzes({ a: 4, b: 5, length: 40 })).toEqual([20, 40]);
	});
});

describe('makeRound', () => {
	it('deals a pair from the list and a run of whole cycles, at least 24 long', () => {
		for (let i = 0; i < 200; i++) {
			const r = makeRound(rng);
			expect(PAIRS.some(([a, b]) => a === r.a && b === r.b)).toBe(true);
			expect(r.length % lcm([r.a, r.b])).toBe(0);
			expect(r.length).toBeGreaterThanOrEqual(24);
			expect(r.length).toBeLessThanOrEqual(42);
			expect(fizzBuzzes(r).length).toBeGreaterThanOrEqual(1);
		}
	});
	it('never repeats the previous pair', () => {
		let prev = makeRound(rng);
		for (let i = 0; i < 100; i++) {
			const next = makeRound(rng, prev);
			expect([next.a, next.b]).not.toEqual([prev.a, prev.b]);
			prev = next;
		}
	});
});

describe('choose', () => {
	/** Plays the whole run with the right answers, optionally getting some numbers wrong first. */
	function run(r: Round, wrongFirst: Record<number, Answer> = {}) {
		let p = freshPlay();
		while (!isOver(r, p)) {
			const bad = wrongFirst[p.n];
			if (bad) p = choose(r, p, bad).play;
			p = choose(r, p, answerFor(r, p.n)).play;
		}
		return p;
	}

	it('moves on when right and stays on the number when wrong', () => {
		const right = choose(classic, freshPlay(), 'number');
		expect(right).toMatchObject({ outcome: 'right', play: { n: 2 } });
		const wrong = choose(classic, freshPlay(), 'fizz');
		expect(wrong.outcome).toBe('wrong');
		expect(wrong.play.n).toBe(1);
		expect(wrong.play.mistakes).toEqual([{ n: 1, chose: 'fizz' }]);
	});
	it('counts the same wrong choice on a number once', () => {
		const once = choose(classic, freshPlay(), 'fizz').play;
		expect(choose(classic, once, 'fizz').outcome).toBe('ignored');
		expect(choose(classic, once, 'buzz').outcome).toBe('wrong');
	});
	it('scores a number answered wrongly once, however many wrong choices it took', () => {
		const p = run(classic, { 3: 'buzz' });
		expect(scoreRound(p)).toEqual({ mistakes: 1, stars: 2 });
		let q = freshPlay();
		q = choose(classic, q, 'fizz').play;
		q = choose(classic, q, 'buzz').play;
		expect(scoreRound(q).mistakes).toBe(1);
	});
	it('is perfect with no wrong choice, and ignores choices after the run', () => {
		const p = run(classic);
		expect(scoreRound(p)).toEqual({ mistakes: 0, stars: 3 });
		expect(isOver(classic, p)).toBe(true);
		expect(choose(classic, p, 'fizz').outcome).toBe('ignored');
	});
	it('gives 1 star for more than one slipped number', () => {
		expect(scoreRound(run(classic, { 3: 'buzz', 5: 'fizz', 7: 'fizz' })).stars).toBe(1);
	});
});
