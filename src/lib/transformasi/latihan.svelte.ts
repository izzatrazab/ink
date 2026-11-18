// The rune adapter over the Latihan deck-walker: one live, reactive object per
// started Latihan. A Section supplies a config and a deck and gets back what a
// page needs — the current pair, the derived view-state, the student's
// in-progress answer (the draft), and the two actions `submit` and `next` — so
// pages and the shell stop holding the snapshot, re-deriving its view-state, and
// wrapping the machine's transitions by hand.
//
// It owns only what the pure machine (latihan.ts) deliberately does not: the
// mutable snapshot, and the draft. The rules — commit-is-final, stop-at-the-last
// pair, no advancing until answered, whether the Reveal plays — all stay in the
// machine and are inherited, never re-implemented here. The machine remains
// framework-free; this is the only module that knows about runes.
//
// Named `startLatihan` (not `createLatihan`, which is the pure machine's factory)
// and in a `.svelte.ts` module so it can hold runes.

import { createLatihan, type LatihanConfig } from './latihan';

/** A started Latihan: the live view-state and the two actions. */
export interface StartedLatihan<Pair, Answer> {
	/** The current pair. */
	readonly pair: Pair;
	/** Zero-based index of the current pair. */
	readonly index: number;
	/** Total pairs in the deck. */
	readonly total: number;
	/** The committed answer for the current pair, or null while unanswered. */
	readonly committed: Answer | null;
	/** Whether the current pair has been answered (the commitment is final). */
	readonly answered: boolean;
	/** Whether the committed answer is correct. */
	readonly correct: boolean;
	/** Whether this is the last pair in the deck. */
	readonly last: boolean;
	/** Whether the Reveal is playing: the current pair is answered and the Section reveals it. */
	readonly revealing: boolean;
	/** Commits an answer for the current pair; a second submit is ignored. */
	submit(answer: Answer): void;
	/** Advances to the next pair once the current one is answered; otherwise does nothing. */
	next(): void;
}

/** A started Latihan whose Section builds its answer up before committing. */
export interface StartedDraftLatihan<Pair, Answer> extends Omit<
	StartedLatihan<Pair, Answer>,
	'submit'
> {
	/** The student's in-progress answer; resets to `blank` when `next()` advances. */
	draft: Answer;
	/** Commits `answer`, or the current draft when called with no argument. */
	submit(answer?: Answer): void;
}

/** Starts a Latihan with a draft: the config supplies the `blank` the draft starts at. */
export function startLatihan<Pair, Answer>(
	config: LatihanConfig<Pair, Answer> & { blank: Answer },
	pairs: Pair[]
): StartedDraftLatihan<Pair, Answer>;
/** Starts a Latihan whose answers are committed directly (no draft). */
export function startLatihan<Pair, Answer>(
	config: LatihanConfig<Pair, Answer>,
	pairs: Pair[]
): StartedLatihan<Pair, Answer>;
export function startLatihan<Pair, Answer>(
	config: LatihanConfig<Pair, Answer>,
	pairs: Pair[]
): StartedDraftLatihan<Pair, Answer> {
	const machine = createLatihan(config);

	// Snapshots are replaced, never mutated, so a raw (shallow) rune is enough.
	let state = $state.raw(machine.initialState(pairs));
	// Undefined for Sections without a draft; the overloads hide `draft` from them.
	const blank = config.blank as Answer;
	let draft = $state.raw(blank);

	return {
		get pair() {
			return machine.currentPair(state);
		},
		get index() {
			return state.index;
		},
		get total() {
			return state.pairs.length;
		},
		get committed() {
			return state.committed;
		},
		get answered() {
			return machine.isAnswered(state);
		},
		get correct() {
			return machine.isCorrect(state);
		},
		get last() {
			return machine.isLast(state);
		},
		get revealing() {
			return machine.revealing(state);
		},
		get draft() {
			return draft;
		},
		set draft(value: Answer) {
			draft = value;
		},
		submit(answer?: Answer) {
			state = machine.submitAnswer(state, answer === undefined ? draft : answer);
		},
		next() {
			const advanced = machine.nextPair(state);
			// The machine returns the same state for a no-op, so the draft only
			// resets when the Latihan genuinely moved on to a new pair.
			if (advanced === state) return;
			state = advanced;
			draft = blank;
		}
	};
}
