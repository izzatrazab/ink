// The rules of Meet Again, Chapter 2's fourth Mini-game: pure functions,
// framework-free and deterministic once given a random function. Two or three
// lights blink, each every so many beats; the student taps "Together!" on the beats
// where they are all lit at once. Those beats are the common multiples of the
// lights' periods, so the first one is their LCM — the student finds it by feel.
// A Round runs beat by beat (the host supplies the clock); a tap is judged against
// the beat it lands in, from the number seam, never authored.

import { kindProgress } from './kindProgress';
import { isFactor, lcm } from './numbers';

/** The kinds of Round, in the order they unlock. */
export const KINDS = ['two', 'wide', 'three'] as const;
export type Kind = (typeof KINDS)[number];

/** Rounds a kind must be finished cleanly (no mistake) to count as mastered. */
export const MASTERED_ROUNDS = 3;

/** How fast the beats come. `step` has no clock: the student moves on beat by beat. */
export const TEMPOS = ['step', 'slow', 'normal'] as const;
export type Tempo = (typeof TEMPOS)[number];

/** Milliseconds per beat, or null when the student steps by hand. */
export const BEAT_MS: Record<Tempo, number | null> = { step: null, slow: 1000, normal: 650 };

/** Pass `Math.random` in play; tests pass something deterministic. */
export type Random = () => number;

/** Per kind: how many Rounds were finished with no mistake. Absent means 0. */
export type Progress = Partial<Record<Kind, number>>;

/** One Round: how often each light blinks, and how many meetings to catch. */
export interface Round {
	periods: number[];
	meetings: number;
}

/** What each kind deals: how many lights, the periods they draw from, the longest wait. */
const SPEC: Record<Kind, { count: number; from: number; to: number; maxLcm: number }> = {
	two: { count: 2, from: 2, to: 6, maxLcm: 12 },
	wide: { count: 2, from: 3, to: 9, maxLcm: 24 },
	three: { count: 3, from: 2, to: 8, maxLcm: 24 }
};

/** Where the lights first meet: the LCM of their periods. */
export const firstMeeting = (periods: number[]) => lcm(periods);

/** The last beat of a Round. */
export const lastBeat = (round: Round) => firstMeeting(round.periods) * round.meetings;

/** The beats the lights meet on, within the Round: L, 2L, 3L, … */
export const meetingBeats = (round: Round): number[] =>
	Array.from({ length: round.meetings }, (_, i) => firstMeeting(round.periods) * (i + 1));

/** Whether a light with this period is lit on `beat` (beat 0 is before the start: nothing lit). */
export const isLit = (period: number, beat: number) => beat > 0 && isFactor(beat, period);

/** Whether every light is lit on `beat`: the beat to tap. */
export const isMeeting = (periods: number[], beat: number) =>
	beat > 0 && periods.every((p) => isLit(p, beat));

/** The numbers drawn for a kind, or an empty list when the draw does not fit (the caller redraws). */
function draw(kind: Kind, rng: Random): number[] {
	const { count, from, to, maxLcm } = SPEC[kind];
	const pool = Array.from({ length: to - from + 1 }, (_, i) => from + i);
	const periods: number[] = [];
	while (periods.length < count) periods.push(...pool.splice(Math.floor(rng() * pool.length), 1));
	periods.sort((a, b) => a - b);
	const l = lcm(periods);
	// One period a multiple of all the others leaves nothing to compare; keep the wait bearable.
	return l > periods[periods.length - 1] && l <= maxLcm ? periods : [];
}

/** A Round for a kind. `avoid` is the previous Round's periods, never repeated. */
export function makeRound(kind: Kind, rng: Random, avoid: number[] = []): Round {
	for (let attempt = 0; attempt < 500; attempt++) {
		const periods = draw(kind, rng);
		const repeat = periods.length === avoid.length && periods.every((n, i) => n === avoid[i]);
		if (periods.length > 0 && !repeat) {
			return { periods, meetings: firstMeeting(periods) <= 12 ? 3 : 2 };
		}
	}
	return { periods: kind === 'three' ? [2, 3, 4] : [3, 4], meetings: 3 };
}

/** What went wrong on a beat. */
export interface Mistake {
	beat: number;
	/** `early`: tapped when not every light was lit. `missed`: they were, and no tap came. */
	kind: 'early' | 'missed';
}

/** One Round as it is being played. */
export interface RoundPlay {
	/** The beat now lit; 0 before the first beat. */
	beat: number;
	/** Beats the student has tapped on. */
	tapped: number[];
	/** Meetings caught, in order. */
	met: number[];
	mistakes: Mistake[];
	/** Whether the Round is over. */
	done: boolean;
}

export const freshPlay = (): RoundPlay => ({
	beat: 0,
	tapped: [],
	met: [],
	mistakes: [],
	done: false
});

/**
 * Moves on to the next beat. The beat being left is settled first: if every light
 * was lit on it and the student did not tap, that is a mistake. After the last beat
 * the Round is done.
 */
export function advance(round: Round, play: RoundPlay): RoundPlay {
	if (play.done) return play;
	let next = play;
	if (play.beat > 0 && isMeeting(round.periods, play.beat) && !play.tapped.includes(play.beat)) {
		next = { ...next, mistakes: [...next.mistakes, { beat: play.beat, kind: 'missed' }] };
	}
	if (play.beat >= lastBeat(round)) return { ...next, done: true };
	return { ...next, beat: play.beat + 1 };
}

export type TapOutcome = 'met' | 'early' | 'ignored';

/**
 * Judges a tap against the beat it lands in, straight away. A meeting is caught;
 * any other beat is early. A second tap on the same beat, a tap before the first
 * beat or after the Round, is ignored. Catching the last meeting ends the Round.
 */
export function tap(round: Round, play: RoundPlay): { play: RoundPlay; outcome: TapOutcome } {
	if (play.done || play.beat < 1 || play.tapped.includes(play.beat)) {
		return { play, outcome: 'ignored' };
	}
	const tapped = [...play.tapped, play.beat];
	if (isMeeting(round.periods, play.beat)) {
		const met = [...play.met, play.beat];
		return {
			play: { ...play, tapped, met, done: met.length === round.meetings },
			outcome: 'met'
		};
	}
	return {
		play: { ...play, tapped, mistakes: [...play.mistakes, { beat: play.beat, kind: 'early' }] },
		outcome: 'early'
	};
}

/** The light that is dark on `beat` (the first one), with the remainder: "8 ÷ 6 leaves 2". */
export function dark(periods: number[], beat: number): { period: number; rest: number } | null {
	const period = periods.find((p) => !isLit(p, beat));
	return period === undefined ? null : { period, rest: beat % period };
}

export interface RoundResult {
	mistakes: number;
	/** 3 for a perfect Round, 2 for one slip, 1 for more. */
	stars: 1 | 2 | 3;
}

export const scoreRound = (mistakes: number): RoundResult => ({
	mistakes,
	stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1
});

const kinds = kindProgress(KINDS, MASTERED_ROUNDS);

/** Progress after a finished Round: only a mistake-free one counts. */
export const applyRound = (progress: Progress, kind: Kind, mistakes: number): Progress =>
	kinds.apply(progress, kind, mistakes);

export const isMastered = kinds.isMastered;

/** The kinds the student may play: the first, and each one after a mastered kind. */
export const unlockedKinds = kinds.unlocked;

/** Reads saved progress, dropping anything that is not a known kind with a whole, non-negative count. */
export const parseProgress = kinds.parse;

/** Reads a saved tempo, falling back to the slow one. */
export const parseTempo = (raw: string | null): Tempo =>
	(TEMPOS as readonly string[]).includes(raw ?? '') ? (raw as Tempo) : 'slow';
