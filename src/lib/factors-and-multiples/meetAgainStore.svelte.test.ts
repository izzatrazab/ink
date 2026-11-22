import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	MUSIC_KEY,
	MUTED_KEY,
	PROGRESS_KEY,
	TEMPO_KEY,
	startMeetAgain,
	type MeetAgainStorage
} from './meetAgainStore.svelte';
import { BEAT_MS, MASTERED_ROUNDS, firstMeeting, isMeeting, lastBeat } from './meetAgain';
import type { Sounds } from './sound';

// Tested through the reactive interface only, the way the page drives it. Time is faked.

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const memory = (initial: Record<string, string> = {}) => {
	const box = new Map(Object.entries(initial));
	const storage: MeetAgainStorage = {
		read: (key) => box.get(key) ?? null,
		write: (key, value) => void box.set(key, value)
	};
	return { box, storage };
};

const spy = () =>
	({
		success: vi.fn(),
		wrong: vi.fn(),
		done: vi.fn(),
		tick: vi.fn(),
		note: vi.fn()
	}) satisfies Sounds;

let x = 0.37;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

const make = (over: Parameters<typeof startMeetAgain>[0] = {}) =>
	startMeetAgain({ rng, storage: memory().storage, ...over });
type Game = ReturnType<typeof make>;

const SLOW = BEAT_MS.slow!;
/** Lets one beat pass. */
const beat = () => vi.advanceTimersByTime(SLOW);
/** Plays the Round perfectly in slow time: taps on every meeting beat. */
function playPerfect(g: Game) {
	g.begin();
	while (g.inPlay) {
		if (isMeeting(g.round.periods, g.beat)) g.tapTogether();
		if (g.inPlay) beat();
	}
}

describe('startMeetAgain', () => {
	it('has no Round until started, so server and client render alike', () => {
		const g = make();
		expect(g.round.periods).toEqual([]);
		g.start();
		expect(g.round.periods).toHaveLength(2);
		expect(g.kind).toBe('two');
		expect(g.beat).toBe(0);
		expect(g.lit).toEqual([false, false]);
	});

	it('lights the first beat at once on Start, then one beat per interval', () => {
		const g = make();
		g.start();
		g.begin();
		expect(g.beat).toBe(1);
		beat();
		expect(g.beat).toBe(2);
		beat();
		expect(g.beat).toBe(3);
		g.stop();
	});

	it('lights a light on the beats that are multiples of its period', () => {
		const g = make();
		g.start();
		g.begin();
		const [a] = g.round.periods;
		for (let i = 1; i < a; i++) beat();
		expect(g.beat).toBe(a);
		expect(g.lit[0]).toBe(true);
		g.stop();
	});

	it('catches a meeting when tapped on it, and calls a tap on any other beat early', () => {
		const g = make();
		g.start();
		g.begin();
		g.tapTogether(); // beat 1: no light is lit for 2+ periods
		expect(g.lastMistake).toEqual({ beat: 1, kind: 'early' });
		expect(g.mistakes).toBe(1);
		g.tapTogether();
		expect(g.mistakes).toBe(1);
		g.stop();
	});

	it('finishes with 3 stars on a perfect Round and counts it toward Progress', () => {
		const { box, storage } = memory();
		const g = make({ storage });
		g.start();
		playPerfect(g);
		expect(g.result).toEqual({ mistakes: 0, stars: 3 });
		expect(g.met).toHaveLength(g.round.meetings);
		expect(g.streak).toBe(1);
		expect(JSON.parse(box.get(PROGRESS_KEY)!)).toEqual({ two: 1 });
		g.stop();
	});

	it('counts a meeting that passes untapped as a mistake, and does not count the Round', () => {
		const g = make();
		g.start();
		g.begin();
		const first = firstMeeting(g.round.periods);
		for (let i = 1; i <= first; i++) {
			if (i < first) beat();
		}
		expect(g.beat).toBe(first);
		beat(); // the meeting passes, untapped
		expect(g.lastMistake).toEqual({ beat: first, kind: 'missed' });
		while (g.inPlay) {
			if (isMeeting(g.round.periods, g.beat)) g.tapTogether();
			if (g.inPlay) beat();
		}
		expect(g.result?.stars).toBe(2);
		expect(g.progress).toEqual({});
		expect(g.streak).toBe(0);
		g.stop();
	});

	it('runs out at the last beat when nothing is tapped', () => {
		const g = make();
		g.start();
		g.begin();
		for (let i = 0; i <= lastBeat(g.round) + 1 && g.inPlay; i++) beat();
		expect(g.result?.mistakes).toBe(g.round.meetings);
		expect(g.inPlay).toBe(false);
	});

	it('holds the beats while paused and goes on when resumed', () => {
		const g = make();
		g.start();
		g.begin();
		g.pause();
		const at = g.beat;
		beat();
		beat();
		expect(g.beat).toBe(at);
		g.tapTogether();
		expect(g.mistakes).toBe(0);
		g.resume();
		beat();
		expect(g.beat).toBe(at + 1);
		g.stop();
	});

	it('steps by hand when the tempo is step, with no clock', () => {
		const g = make({ storage: memory({ [TEMPO_KEY]: 'step' }).storage });
		g.start();
		expect(g.timed).toBe(false);
		g.begin();
		expect(g.beat).toBe(1);
		vi.advanceTimersByTime(60_000);
		expect(g.beat).toBe(1);
		g.step();
		expect(g.beat).toBe(2);
	});

	it('holds a tempo change while a Round is in play, and remembers it between Rounds', () => {
		const { box, storage } = memory();
		const g = make({ storage });
		g.start();
		g.begin();
		g.setTempo('normal');
		expect(g.tempo).toBe('slow');
		g.stop();
		g.next();
		g.setTempo('normal');
		expect(g.tempo).toBe('normal');
		expect(box.get(TEMPO_KEY)).toBe('normal');
	});

	it('locks the next kind until this one is mastered, then unlocks it', () => {
		const g = make();
		g.start();
		g.selectKind('wide');
		expect(g.kind).toBe('two');
		for (let i = 0; i < MASTERED_ROUNDS; i++) {
			g.next();
			playPerfect(g);
		}
		expect(g.justUnlocked).toBe('wide');
		g.selectKind('wide');
		expect(g.kind).toBe('wide');
		expect(g.round.periods).toHaveLength(2);
	});

	it('ticks softly on every beat, buzzes on a mistake and flourishes at the end', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		playPerfect(g);
		expect(sounds.tick).toHaveBeenCalled();
		expect(sounds.success).toHaveBeenCalledWith(0);
		expect(sounds.done).toHaveBeenCalledTimes(1);
		expect(sounds.wrong).not.toHaveBeenCalled();
	});

	it('stays quiet when muted, and remembers the setting', () => {
		const sounds = spy();
		const { box, storage } = memory();
		const g = make({ sounds, storage });
		g.start();
		g.toggleMute();
		playPerfect(g);
		expect(sounds.tick).not.toHaveBeenCalled();
		expect(box.get(MUTED_KEY)).toBe('1');
		const again = make({ storage });
		again.start();
		expect(again.muted).toBe(true);
	});

	it('carries on when storage is blocked', () => {
		const storage: MeetAgainStorage = {
			read: () => {
				throw new Error('blocked');
			},
			write: () => {
				throw new Error('blocked');
			}
		};
		const g = make({ storage });
		g.start();
		expect(() => playPerfect(g)).not.toThrow();
		expect(g.result?.stars).toBe(3);
	});
});

describe('replay', () => {
	it('plays the same lights again for stars, without counting it toward progress or the streak', () => {
		const g = make();
		g.start();
		g.begin();
		g.tapTogether(); // beat 1: early
		while (g.inPlay) {
			if (isMeeting(g.round.periods, g.beat)) g.tapTogether();
			if (g.inPlay) beat();
		}
		expect(g.result?.stars).toBe(2);
		const periods = [...g.round.periods];
		g.retry();
		expect(g.round.periods).toEqual(periods);
		expect(g.started).toBe(false);
		expect(g.beat).toBe(0);
		expect(g.result).toBeNull();
		playPerfect(g);
		expect(g.result?.stars).toBe(3);
		expect(g.progress).toEqual({});
		expect(g.streak).toBe(0);
		g.next();
		expect(g.retrying).toBe(false);
	});
});

describe('music mode', () => {
	it('is off by default and plays the neutral tick', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		expect(g.music).toBe(false);
		g.begin();
		beat();
		expect(sounds.tick).toHaveBeenCalled();
		expect(sounds.note).not.toHaveBeenCalled();
		g.stop();
	});

	it('plays each light own note on the beats it is lit, and no tick', () => {
		const sounds = spy();
		const { box, storage } = memory();
		const g = make({ sounds, storage });
		g.start();
		g.setMusic(true);
		expect(box.get(MUSIC_KEY)).toBe('1');
		g.begin();
		const [a] = g.round.periods;
		for (let i = 1; i <= a; i++) {
			if (i < a) beat();
		}
		expect(g.lit[0]).toBe(true);
		expect(sounds.note).toHaveBeenCalledWith(0);
		expect(sounds.tick).not.toHaveBeenCalled();
		g.stop();
	});

	it('sounds a chord on a meeting: every light plays', () => {
		const sounds = spy();
		const g = make({ sounds });
		g.start();
		g.setMusic(true);
		g.begin();
		const first = firstMeeting(g.round.periods);
		for (let i = 1; i < first; i++) beat();
		expect(g.beat).toBe(first);
		g.round.periods.forEach((_, i) => expect(sounds.note).toHaveBeenCalledWith(i));
		g.stop();
	});

	it('stays quiet when muted, holds while a Round is in play, and is remembered', () => {
		const sounds = spy();
		const { storage } = memory();
		const g = make({ sounds, storage });
		g.start();
		g.setMusic(true);
		g.toggleMute();
		g.begin();
		beat();
		expect(sounds.note).not.toHaveBeenCalled();
		g.setMusic(false);
		expect(g.music).toBe(true);
		g.stop();
		const again = make({ storage });
		again.start();
		expect(again.music).toBe(true);
	});
});
