// The Latihan deck-walker: the shared interaction state machine behind every
// Section's exercise (latihan). One pair is shown at a time; the student commits
// a single answer, sees whether it is correct and the slide-to-overlay "why",
// then advances — commit-once-then-reveal, walking to the end of the deck.
//
// Extracted once a second Section needed the same machine — Section 11.1's
// congruency classifier and Section 11.2's find-the-vector exercise (the
// deepen-on-second-case discipline of ADR-0005/0008). The two Sections differ in
// only three places, which are this module's configuration: how the correct
// answer is derived from a pair, how two answers are compared, and whether
// committing reveals the slide-to-overlay "why". Everything else — stepping, the
// commit-is-final rule, reset-on-advance, stop-at-the-last-pair — lives here once.
//
// Pure and framework-free like the seams it sits beside (geometry.ts, grid.ts):
// state in, state out, no Svelte/DOM/$lib imports. The config functions are held
// in the factory closure, never in the state, so the state stays plain,
// structurally-comparable data (the tests lean on `toBe` identity for no-ops).

/** A snapshot of one latihan: which pair, the committed answer, the "why" overlay. */
export interface LatihanState<Pair, Answer> {
	pairs: Pair[];
	index: number;
	/** The student's committed answer for the current pair, or null if unanswered. */
	committed: Answer | null;
	/** Whether the slide-to-overlay "why" is currently playing. */
	overlayPlaying: boolean;
}

/** What a Section must supply to specialise the deck-walker — only what varies. */
export interface LatihanConfig<Pair, Answer> {
	/** The correct answer for a pair — derived from the pair, never authored separately. */
	correctAnswer: (pair: Pair) => Answer;
	/** Whether two answers count as the same translation/verdict. Defaults to `===`. */
	answersEqual?: (a: Answer, b: Answer) => boolean;
	/** Whether committing an answer reveals the slide-to-overlay "why". Defaults to always. */
	revealsWhy?: (pair: Pair) => boolean;
}

/** The bound transitions and queries for one Section's configured latihan. */
export interface Latihan<Pair, Answer> {
	initialState(pairs: Pair[]): LatihanState<Pair, Answer>;
	currentPair(state: LatihanState<Pair, Answer>): Pair;
	isAnswered(state: LatihanState<Pair, Answer>): boolean;
	isCorrect(state: LatihanState<Pair, Answer>): boolean;
	isLast(state: LatihanState<Pair, Answer>): boolean;
	submitAnswer(state: LatihanState<Pair, Answer>, answer: Answer): LatihanState<Pair, Answer>;
	nextPair(state: LatihanState<Pair, Answer>): LatihanState<Pair, Answer>;
}

/** Builds a deck-walker specialised by `config`. */
export function createLatihan<Pair, Answer>(
	config: LatihanConfig<Pair, Answer>
): Latihan<Pair, Answer> {
	const { correctAnswer } = config;
	const answersEqual = config.answersEqual ?? ((a, b) => a === b);
	const revealsWhy = config.revealsWhy ?? (() => true);

	type State = LatihanState<Pair, Answer>;

	function initialState(pairs: Pair[]): State {
		return { pairs, index: 0, committed: null, overlayPlaying: false };
	}

	function currentPair(state: State): Pair {
		return state.pairs[state.index];
	}

	function isAnswered(state: State): boolean {
		return state.committed !== null;
	}

	function isCorrect(state: State): boolean {
		return (
			state.committed !== null && answersEqual(state.committed, correctAnswer(currentPair(state)))
		);
	}

	function isLast(state: State): boolean {
		return state.index === state.pairs.length - 1;
	}

	/**
	 * Commits the student's answer for the current pair, revealing the "why" when
	 * the Section's `revealsWhy` says so. A second submission is ignored — the
	 * commitment is final.
	 */
	function submitAnswer(state: State, answer: Answer): State {
		if (isAnswered(state)) return state;
		return { ...state, committed: answer, overlayPlaying: revealsWhy(currentPair(state)) };
	}

	/**
	 * Advances to the next pair, resetting the committed answer and the overlay. A
	 * no-op until the current pair is answered, and a no-op on the last pair.
	 */
	function nextPair(state: State): State {
		if (!isAnswered(state) || isLast(state)) return state;
		return { ...state, index: state.index + 1, committed: null, overlayPlaying: false };
	}

	return { initialState, currentPair, isAnswered, isCorrect, isLast, submitAnswer, nextPair };
}
