// The Latihan deck-walker: the shared interaction state machine behind every
// Section's exercise (latihan). One pair is shown at a time; the student commits
// a single answer, sees whether it is correct and the Reveal "why",
// then advances — commit-once-then-reveal, walking to the end of the deck.
//
// Extracted once a second Section needed the same machine — Section 11.1's
// congruency classifier and Section 11.2's find-the-vector exercise (the
// deepen-on-second-case discipline of ADR-0005/0008). The two Sections differ in
// only three places, which are this module's configuration: how the correct
// answer is derived from a pair, how two answers are compared, and whether
// committing plays the Reveal. Everything else — stepping, the
// commit-is-final rule, reset-on-advance, stop-at-the-last-pair — lives here once.
//
// Pure and framework-free like the seams it sits beside (geometry.ts, grid.ts):
// state in, state out, no Svelte/DOM/$lib imports. The config functions are held
// in the factory closure, never in the state, so the state stays plain,
// structurally-comparable data (the tests lean on `toBe` identity for no-ops).

/** A snapshot of one latihan: which pair and the committed answer. Whether the
 *  Reveal is playing is derived from these (see `revealing`), never stored. */
export interface LatihanState<Pair, Answer> {
	pairs: Pair[];
	index: number;
	/** The student's committed answer for the current pair, or null if unanswered. */
	committed: Answer | null;
}

/** What a Section must supply to specialise the deck-walker — only what varies. */
export interface LatihanConfig<Pair, Answer> {
	/** The correct answer for a pair — derived from the pair, never authored separately. */
	correctAnswer: (pair: Pair) => Answer;
	/** Whether two answers count as the same translation/verdict. Defaults to `===`. */
	answersEqual?: (a: Answer, b: Answer) => boolean;
	/** Whether committing an answer reveals the Reveal "why" for a pair. Defaults to always. */
	revealsWhy?: (pair: Pair) => boolean;
	/**
	 * The answer a fresh pair's draft starts with — for Sections that build an
	 * answer up before committing (11.2's vector, 11.3's axis). The machine itself
	 * ignores it; the rune adapter (latihan.svelte.ts) owns the draft.
	 */
	blank?: Answer;
}

/** The bound transitions and queries for one Section's configured latihan. */
export interface Latihan<Pair, Answer> {
	initialState(pairs: Pair[]): LatihanState<Pair, Answer>;
	currentPair(state: LatihanState<Pair, Answer>): Pair;
	isAnswered(state: LatihanState<Pair, Answer>): boolean;
	isCorrect(state: LatihanState<Pair, Answer>): boolean;
	isLast(state: LatihanState<Pair, Answer>): boolean;
	/** Whether the Reveal is playing: the current pair is answered and the Section reveals it. */
	revealing(state: LatihanState<Pair, Answer>): boolean;
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
		return { pairs, index: 0, committed: null };
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

	function revealing(state: State): boolean {
		return isAnswered(state) && revealsWhy(currentPair(state));
	}

	/**
	 * Commits the student's answer for the current pair. A second submission is
	 * ignored — the commitment is final. Whether the "why" then plays is `revealing`.
	 */
	function submitAnswer(state: State, answer: Answer): State {
		if (isAnswered(state)) return state;
		return { ...state, committed: answer };
	}

	/**
	 * Advances to the next pair, resetting the committed answer. A
	 * no-op until the current pair is answered, and a no-op on the last pair.
	 */
	function nextPair(state: State): State {
		if (!isAnswered(state) || isLast(state)) return state;
		return { ...state, index: state.index + 1, committed: null };
	}

	return {
		initialState,
		currentPair,
		isAnswered,
		isCorrect,
		isLast,
		revealing,
		submitAnswer,
		nextPair
	};
}
