import { describe, expect, it } from 'vitest';
import {
	KINDS,
	MASTERED_ROUNDS,
	advance,
	applyRound,
	dark,
	firstMeeting,
	freshPlay,
	isMeeting,
	lastBeat,
	makeRound,
	meetingBeats,
	parseProgress,
	parseTempo,
	scoreRound,
	tap,
	unlockedKinds,
	type Round
} from './meetAgain';

let x = 0.123;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

const round: Round = { periods: [4, 6], meetings: 3 };
/** Plays the whole Round, tapping on the beats in `tapOn`; one more tick after the last beat settles it. */
function play(r: Round, tapOn: number[]) {
	let p = freshPlay();
	for (let b = 1; b <= lastBeat(r) + 1; b++) {
		p = advance(r, p);
		if (tapOn.includes(p.beat)) p = tap(r, p).play;
	}
	return p;
}

describe('the lights', () => {
	it('meet on the common multiples: the first is the LCM', () => {
		expect(firstMeeting([4, 6])).toBe(12);
		expect(meetingBeats(round)).toEqual([12, 24, 36]);
		expect(isMeeting([4, 6], 12)).toBe(true);
		expect(isMeeting([4, 6], 8)).toBe(false);
		expect(isMeeting([4, 6], 0)).toBe(false);
	});
	it('names the dark light and why', () => {
		expect(dark([4, 6], 8)).toEqual({ period: 6, rest: 2 });
		expect(dark([4, 6], 12)).toBeNull();
	});
});

describe('makeRound', () => {
	it('deals the right number of lights, none a multiple of all the rest, with a bearable wait', () => {
		const counts = { two: 2, wide: 2, three: 3 } as const;
		for (const kind of KINDS) {
			for (let i = 0; i < 200; i++) {
				const { periods, meetings } = makeRound(kind, rng);
				expect(periods).toHaveLength(counts[kind]);
				expect(new Set(periods).size).toBe(periods.length);
				const l = firstMeeting(periods);
				expect(l).toBeGreaterThan(Math.max(...periods));
				expect(l).toBeLessThanOrEqual(24);
				expect(meetings).toBe(l <= 12 ? 3 : 2);
			}
		}
	});
	it('never repeats the previous Round', () => {
		let prev = makeRound('two', rng).periods;
		for (let i = 0; i < 100; i++) {
			const next = makeRound('two', rng, prev).periods;
			expect(next).not.toEqual(prev);
			prev = next;
		}
	});
});

describe('a Round in play', () => {
	it('is perfect when every meeting is caught and nothing else tapped', () => {
		const p = play(round, [12, 24, 36]);
		expect(p.met).toEqual([12, 24, 36]);
		expect(p.mistakes).toEqual([]);
		expect(p.done).toBe(true);
	});
	it('ends the moment the last meeting is caught', () => {
		let p = freshPlay();
		for (let b = 1; b <= 36; b++) {
			p = advance(round, p);
			if ([12, 24, 36].includes(p.beat)) p = tap(round, p).play;
		}
		expect(p.beat).toBe(36);
		expect(p.done).toBe(true);
		expect(advance(round, p)).toBe(p);
	});
	it('counts a tap on any other beat as early', () => {
		const p = play(round, [8, 12, 24, 36]);
		expect(p.mistakes).toEqual([{ beat: 8, kind: 'early' }]);
		expect(scoreRound(p.mistakes.length).stars).toBe(2);
	});
	it('counts a meeting that passes untapped as missed', () => {
		const p = play(round, [12, 36]);
		expect(p.mistakes).toEqual([{ beat: 24, kind: 'missed' }]);
		expect(p.met).toEqual([12, 36]);
	});
	it('ends with the last meeting missed, when the Round runs out', () => {
		const p = play(round, [12, 24]);
		expect(p.mistakes).toEqual([{ beat: 36, kind: 'missed' }]);
		expect(p.done).toBe(true);
	});
	it('ignores a second tap on a beat, a tap before the first beat and a tap after the end', () => {
		const first = tap(round, freshPlay());
		expect(first.outcome).toBe('ignored');
		let p = freshPlay();
		for (let b = 1; b <= 12; b++) p = advance(round, p);
		const once = tap(round, p);
		expect(once.outcome).toBe('met');
		expect(tap(round, once.play).outcome).toBe('ignored');
		const over = play(round, []);
		expect(tap(round, over).outcome).toBe('ignored');
	});
});

describe('scoring, progress and tempo', () => {
	it('gives 3, 2 or 1 stars by mistakes', () => {
		expect(scoreRound(0).stars).toBe(3);
		expect(scoreRound(1).stars).toBe(2);
		expect(scoreRound(4).stars).toBe(1);
	});
	it('counts only mistake-free Rounds, and unlocks kinds in order', () => {
		expect(applyRound({}, 'two', 0)).toEqual({ two: 1 });
		expect(applyRound({ two: 1 }, 'two', 2)).toEqual({ two: 1 });
		expect(unlockedKinds({})).toEqual(['two']);
		expect(unlockedKinds({ two: MASTERED_ROUNDS })).toEqual(['two', 'wide']);
		expect(unlockedKinds({ three: 9 })).toEqual(['two']);
	});
	it('reads saved progress and tempo defensively', () => {
		expect(parseProgress('{"two":2,"wide":-1,"three":"x"}')).toEqual({ two: 2 });
		expect(parseProgress('nope')).toEqual({});
		expect(parseTempo('normal')).toBe('normal');
		expect(parseTempo('warp')).toBe('slow');
		expect(parseTempo(null)).toBe('slow');
	});
});
