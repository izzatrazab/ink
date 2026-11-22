// The live object behind Fizz Buzz (fizzBuzz.ts): the Round in play, the run of
// right answers, the score. Free play, so there is no storage; sounds are
// injected. There is no Round until `start()` runs on mount (a random Round drawn
// during server rendering would not match the browser's).

import {
	answerFor,
	choose,
	fizzBuzzes,
	freshPlay,
	isOver,
	makeRound,
	scoreRound,
	type Answer,
	type Random,
	type Round,
	type RoundPlay,
	type RoundResult
} from './fizzBuzz';
import { silent, type Sounds } from './sound';

export interface FizzBuzzOptions {
	rng?: Random;
	sounds?: Sounds;
}

class FizzBuzzGame {
	#rng: Random;
	#sounds: Sounds;

	round = $state<Round>({ a: 0, b: 0, length: 0 });
	play = $state<RoundPlay>(freshPlay());
	result = $state<RoundResult | null>(null);
	/** The wrong choice made on the number now showing, until it is answered right. */
	lastWrong = $state<{ n: number; chose: Answer } | null>(null);
	/** Right answers in a row; a wrong choice ends the run. */
	combo = $state(0);
	bestCombo = $state(0);
	muted = $state(false);

	constructor({ rng = Math.random, sounds = silent }: FizzBuzzOptions) {
		this.#rng = rng;
		this.#sounds = sounds;
	}

	/** The number now showing. */
	readonly n = $derived(this.play.n);
	/** What the student should say for it (for the page's explanation after a wrong choice). */
	readonly answer = $derived(this.round.length ? answerFor(this.round, this.play.n) : 'number');
	readonly fizzBuzzes = $derived(fizzBuzzes(this.round));
	readonly mistakes = $derived(new Set(this.play.mistakes.map((m) => m.n)).size);

	/** Deals the first Round. Call from onMount. */
	start() {
		this.#deal();
	}

	/** The student's choice for the number showing, judged at once. */
	say(chose: Answer) {
		if (this.result || this.round.length === 0) return;
		const { play, outcome } = choose(this.round, this.play, chose);
		if (outcome === 'ignored') return;
		this.play = play;
		if (outcome === 'wrong') {
			this.lastWrong = { n: play.n, chose };
			this.combo = 0;
			this.#sound((s) => s.wrong());
			return;
		}
		this.lastWrong = null;
		this.combo += 1;
		this.bestCombo = Math.max(this.bestCombo, this.combo);
		this.#sound((s) => s.success(this.combo - 1));
		if (isOver(this.round, play)) {
			this.result = scoreRound(play);
			this.#sound((s) => s.done());
		}
	}

	/** Plays the same run again. */
	retry() {
		this.play = freshPlay();
		this.result = null;
		this.lastWrong = null;
		this.combo = 0;
		this.bestCombo = 0;
	}

	/** Deals a new pair. */
	next() {
		this.#deal();
	}

	toggleMute() {
		this.muted = !this.muted;
	}

	#sound(play: (sounds: Sounds) => void) {
		if (!this.muted) play(this.#sounds);
	}

	#deal() {
		this.round = makeRound(this.#rng, this.round.length ? this.round : undefined);
		this.retry();
	}
}

export type StartedFizzBuzz = FizzBuzzGame;

/** Starts a Fizz Buzz game; call `start()` once mounted. */
export function startFizzBuzz(options: FizzBuzzOptions = {}): StartedFizzBuzz {
	return new FizzBuzzGame(options);
}
