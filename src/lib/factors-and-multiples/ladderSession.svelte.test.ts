import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { vi } from 'vitest';
import { startLadder } from './ladderSession.svelte';
import { STEP_MS } from './stepper.svelte';
import type { LadderMode } from './ladder';

// Tested through the session interface only, the way <DivisionLadder> drives it.
// The ladder rules themselves are covered in ladder.test.ts; here we check what
// the session adds: the progress it holds, refusal/hint/note bookkeeping, undo and
// reset, and Watch.

const make = (start: number[], mode: LadderMode = 'single') => startLadder(() => ({ start, mode }));

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('choose', () => {
	it('accepts a valid divisor: a new row drops in and the note records the step', () => {
		const s = make([60]);
		s.choose(2);
		expect(s.divisors).toEqual([2]);
		expect(s.rows).toEqual([[60], [30]]);
		expect(s.refused).toBeNull();
		expect(s.note).toMatchObject({ before: [60], d: 2, result: { ok: true, next: [30] } });
	});

	it('refuses an invalid divisor: no rung is added, it is remembered as refused', () => {
		const s = make([60]);
		s.choose(4);
		expect(s.divisors).toEqual([]);
		expect(s.refused).toBe(4);
		expect(s.note).toMatchObject({ d: 4, result: { ok: false } });
	});

	it('a later accepted divisor clears the refusal', () => {
		const s = make([60]);
		s.choose(4);
		s.choose(2);
		expect(s.refused).toBeNull();
	});

	it('finishes: done, with the answer as the product of the divisors', () => {
		const s = make([12]);
		[2, 2, 3].forEach((d) => s.choose(d));
		expect(s.done).toBe(true);
		expect(s.answer).toBe(12);
	});

	it('ignores choices once done', () => {
		const s = make([4]);
		s.choose(2);
		s.choose(2);
		s.choose(3);
		expect(s.divisors).toEqual([2, 2]);
	});

	it('follows the mode: HCF refuses a prime that misses a number', () => {
		const s = make([12, 18], 'hcf');
		s.choose(5);
		expect(s.refused).toBe(5);
		s.choose(2);
		s.choose(3);
		expect(s.done).toBe(true);
		expect(s.answer).toBe(6);
	});
});

describe('hint', () => {
	it('suggests the smallest divisor that works, and toggles', () => {
		const s = make([60]);
		expect(s.suggested).toBe(2);
		expect(s.hinting).toBe(false);
		s.toggleHint();
		expect(s.hinting).toBe(true);
		s.toggleHint();
		expect(s.hinting).toBe(false);
	});

	it('choosing a divisor hides the hint', () => {
		const s = make([60]);
		s.toggleHint();
		s.choose(3);
		expect(s.hinting).toBe(false);
	});

	it('has no suggestion once done', () => {
		const s = make([2]);
		s.choose(2);
		expect(s.suggested).toBeUndefined();
	});
});

describe('undo and reset', () => {
	it('undo takes the last rung back and clears the note, refusal and hint', () => {
		const s = make([60]);
		s.choose(2);
		s.choose(4);
		s.toggleHint();
		s.undo();
		expect(s.divisors).toEqual([]);
		expect(s.note).toBeNull();
		expect(s.refused).toBeNull();
		expect(s.hinting).toBe(false);
	});

	it('undo with nothing chosen does nothing', () => {
		const s = make([60]);
		s.undo();
		expect(s.divisors).toEqual([]);
	});

	it('reset clears everything', () => {
		const s = make([60]);
		s.choose(2);
		s.choose(4);
		s.reset();
		expect(s.rows).toEqual([[60]]);
		expect(s.note).toBeNull();
		expect(s.refused).toBeNull();
	});
});

describe('watch', () => {
	it('restarts, announces itself, then takes one hint step per interval', () => {
		const s = make([12]);
		s.choose(2);
		s.watch();
		expect(s.divisors).toEqual([]);
		expect(s.note).toBe('watch');
		expect(s.watching).toBe(true);
		vi.advanceTimersByTime(STEP_MS);
		expect(s.divisors).toEqual([2]);
		vi.advanceTimersByTime(STEP_MS);
		expect(s.divisors).toEqual([2, 2]);
	});

	it('stops by itself when the ladder is done', () => {
		const s = make([12]);
		s.watch();
		vi.advanceTimersByTime(STEP_MS * 3);
		expect(s.done).toBe(true);
		expect(s.watching).toBe(false);
		vi.advanceTimersByTime(STEP_MS * 3);
		expect(s.divisors).toEqual([2, 2, 3]);
	});

	it('stops by itself when no divisor fits (HCF of coprime numbers)', () => {
		const s = make([8, 9], 'hcf');
		s.watch();
		vi.advanceTimersByTime(STEP_MS * 2);
		expect(s.divisors).toEqual([]);
		expect(s.watching).toBe(false);
	});

	it('choosing a divisor yourself ends the Watch', () => {
		const s = make([60]);
		s.watch();
		s.choose(3);
		expect(s.watching).toBe(false);
		vi.advanceTimersByTime(STEP_MS * 3);
		expect(s.divisors).toEqual([3]);
	});

	it('undo and reset end the Watch', () => {
		const s = make([60]);
		s.watch();
		vi.advanceTimersByTime(STEP_MS);
		s.undo();
		expect(s.watching).toBe(false);
		s.watch();
		s.reset();
		expect(s.watching).toBe(false);
	});
});
