import { describe, expect, it, vi } from 'vitest';
import { startFizzBuzz } from './fizzBuzzStore.svelte';
import { answerFor } from './fizzBuzz';
import type { Sounds } from './sound';

// Tested through the reactive interface only, the way the page drives it.

const spy = () => ({ success: vi.fn(), wrong: vi.fn(), done: vi.fn() }) satisfies Sounds;

let x = 0.37;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

const make = (over: Parameters<typeof startFizzBuzz>[0] = {}) => startFizzBuzz({ rng, ...over });
type Game = ReturnType<typeof make>;

/** Says the right thing for every number to the end. */
const finish = (g: Game) => {
	while (!g.result) g.say(g.answer);
};
const otherThan = (g: Game) => (g.answer === 'number' ? 'fizz' : 'number');

describe('startFizzBuzz', () => {
	it('has no Round until started, so server and client render alike', () => {
		const g = make();
		expect(g.round.length).toBe(0);
		g.start();
		expect(g.round.length).toBeGreaterThanOrEqual(24);
		expect(g.n).toBe(1);
	});

	it('moves on to the next number on a right answer and stays on a wrong one', () => {
		const g = make();
		g.start();
		g.say(g.answer);
		expect(g.n).toBe(2);
		const wrong = otherThan(g);
		g.say(wrong);
		expect(g.n).toBe(2);
		expect(g.lastWrong).toEqual({ n: 2, chose: wrong });
		g.say(g.answer);
		expect(g.n).toBe(3);
		expect(g.lastWrong).toBeNull();
	});

	it('counts right answers in a row, and a wrong choice ends the run', () => {
		const g = make();
		g.start();
		g.say(g.answer);
		g.say(g.answer);
		g.say(otherThan(g));
		expect(g.combo).toBe(0);
		expect(g.bestCombo).toBe(2);
	});

	it('finishes with 3 stars on a perfect run, and ignores choices after', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		finish(g);
		expect(g.result).toEqual({ mistakes: 0, stars: 3 });
		expect(sounds.done).toHaveBeenCalledTimes(1);
		const n = g.n;
		g.say('fizz');
		expect(g.n).toBe(n);
		expect(g.bestCombo).toBe(g.round.length);
	});

	it('scores a number answered wrongly once', () => {
		const g = make();
		g.start();
		g.say(otherThan(g));
		g.say(g.answer);
		finish(g);
		expect(g.result).toEqual({ mistakes: 1, stars: 2 });
	});

	it('replays the same run, and deals a new pair on next', () => {
		const g = make();
		g.start();
		const pair = [g.round.a, g.round.b];
		g.say(otherThan(g));
		finish(g);
		g.retry();
		expect([g.round.a, g.round.b]).toEqual(pair);
		expect(g.result).toBeNull();
		expect(g.n).toBe(1);
		finish(g);
		expect(g.result?.stars).toBe(3);
		g.next();
		expect([g.round.a, g.round.b]).not.toEqual(pair);
	});

	it('judges by the number seam: every number is answered as answerFor says', () => {
		const g = make();
		g.start();
		for (let n = 1; n <= g.round.length; n++) {
			expect(g.answer).toBe(answerFor(g.round, n));
			g.say(g.answer);
		}
		expect(g.result?.stars).toBe(3);
	});

	it('stays quiet when muted', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		g.toggleMute();
		finish(g);
		expect(sounds.success).not.toHaveBeenCalled();
		expect(sounds.done).not.toHaveBeenCalled();
	});
});
