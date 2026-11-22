// The rules of Fizz Buzz, Multiples Hunt's side game: count up from 1, and for each
// number say Fizz if it is a multiple of one number, Buzz if it is a multiple of
// another, FizzBuzz if it is a multiple of both (a common multiple!), and just the
// number otherwise. A Round is a pair and a run of numbers. Each choice is judged
// from the number seam (isFactor), never authored. Free play: it earns stars and a
// run counter but never touches Multiples Hunt's progress. Pure and framework-free.

import { isFactor, lcm } from './numbers';

/** The pairs dealt: the classic 3 and 5, and others whose common multiples fall at different places. */
export const PAIRS: readonly (readonly [number, number])[] = [
	[3, 5],
	[2, 3],
	[2, 5],
	[3, 4],
	[4, 5],
	[3, 7]
];

/** The shortest run: long enough to meet at least one FizzBuzz twice. */
const MIN_LENGTH = 24;

export type Answer = 'fizz' | 'buzz' | 'fizzbuzz' | 'number';

/** Pass `Math.random` in play; tests pass something deterministic. */
export type Random = () => number;

export interface Round {
	/** Fizz is a multiple of `a`, Buzz a multiple of `b`. */
	a: number;
	b: number;
	/** The run is 1 … `length`. */
	length: number;
}

/** What the student should say for `n`. */
export function answerFor(round: Pick<Round, 'a' | 'b'>, n: number): Answer {
	const fizz = isFactor(n, round.a);
	const buzz = isFactor(n, round.b);
	return fizz && buzz ? 'fizzbuzz' : fizz ? 'fizz' : buzz ? 'buzz' : 'number';
}

/** A Round: a pair, and a run that is a whole number of FizzBuzz cycles, at least 24 long. */
export function makeRound(rng: Random, avoid?: Pick<Round, 'a' | 'b'>): Round {
	const choices = PAIRS.filter(([a, b]) => !avoid || a !== avoid.a || b !== avoid.b);
	const [a, b] = choices[Math.floor(rng() * choices.length)];
	const cycle = lcm([a, b]);
	return { a, b, length: Math.ceil(MIN_LENGTH / cycle) * cycle };
}

/** The numbers that are FizzBuzz in a Round: the common multiples of the pair. */
export const fizzBuzzes = (round: Round) =>
	Array.from({ length: round.length }, (_, i) => i + 1).filter(
		(n) => answerFor(round, n) === 'fizzbuzz'
	);

/** One Round as it is being played. */
export interface RoundPlay {
	/** The number the student is on; `length + 1` once the run is over. */
	n: number;
	/** Wrong choices, at most one per number. */
	mistakes: { n: number; chose: Answer }[];
}

export const freshPlay = (): RoundPlay => ({ n: 1, mistakes: [] });

export const isOver = (round: Round, play: RoundPlay) => play.n > round.length;

export type ChooseOutcome = 'right' | 'wrong' | 'ignored';

/**
 * Judges a choice for the number now showing, straight away. Right moves on to
 * the next number; wrong is a mistake (counted once per number) and the student
 * tries again on the same number.
 */
export function choose(
	round: Round,
	play: RoundPlay,
	chose: Answer
): { play: RoundPlay; outcome: ChooseOutcome } {
	if (isOver(round, play)) return { play, outcome: 'ignored' };
	if (chose === answerFor(round, play.n)) {
		return { play: { ...play, n: play.n + 1 }, outcome: 'right' };
	}
	if (play.mistakes.some((m) => m.n === play.n && m.chose === chose)) {
		return { play, outcome: 'ignored' };
	}
	return {
		play: { ...play, mistakes: [...play.mistakes, { n: play.n, chose }] },
		outcome: 'wrong'
	};
}

export interface RoundResult {
	/** Numbers answered wrongly at least once. */
	mistakes: number;
	/** 3 for a perfect run, 2 for one slip, 1 for more. */
	stars: 1 | 2 | 3;
}

export function scoreRound(play: RoundPlay): RoundResult {
	const mistakes = new Set(play.mistakes.map((m) => m.n)).size;
	return { mistakes, stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1 };
}
