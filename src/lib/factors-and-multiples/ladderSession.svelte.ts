// The live object behind <DivisionLadder>: the student builds a Division ladder
// one rung at a time by choosing a divisor. The rules (is this divisor allowed,
// what is the next row, is it done, what is the smallest divisor that fits) stay
// in ladder.ts; this holds what the page used to hold by hand around them — the
// divisors chosen, the refusal and hint bookkeeping, the note about the last
// choice, and Watch (the stepper taking the hint step on every tick).
//
// The only progress is the list of divisors; rows, "done" and the product are
// derived. `note` says what the message line is about, not its text, so the host
// can word it in the reader's current language. Language and markup stay with the
// host. Call `stop()` when the host is destroyed.

import {
	hint,
	isDone,
	product,
	rowsOf,
	tryDivisor,
	type LadderMode,
	type TryResult
} from './ladder';
import { startStepper } from './stepper.svelte';

export interface LadderOptions {
	/** The Starting numbers: one row. */
	start: number[];
	mode: LadderMode;
}

/** What the message line is about: the last choice, or the Watch intro. */
export type LadderNote = { before: number[]; d: number; result: TryResult } | 'watch' | null;

export interface LadderSession {
	readonly divisors: number[];
	/** Every row so far, the starting row first. */
	readonly rows: number[][];
	/** The last row. */
	readonly current: number[];
	readonly done: boolean;
	/** The smallest divisor the ladder accepts next; undefined when done. */
	readonly suggested: number | undefined;
	/** Product of the divisors: the factorisation, the HCF or the LCM. */
	readonly answer: number;
	readonly note: LadderNote;
	/** The divisor the last choice was refused for, until a divisor is accepted or the ladder is reset. */
	readonly refused: number | null;
	/** Whether the hint is showing. */
	readonly hinting: boolean;
	/** Whether Watch is running. */
	readonly watching: boolean;
	/** The student picks a divisor (this ends a running Watch). */
	choose(d: number): void;
	/** Takes the last rung back. */
	undo(): void;
	/** Clears everything back to the starting row. */
	reset(): void;
	toggleHint(): void;
	/** Restarts, then takes the hint step on every tick until done. */
	watch(): void;
	/** Ends a running Watch; call when the host is destroyed. */
	stop(): void;
}

export function startLadder(options: () => LadderOptions): LadderSession {
	let divisors = $state<number[]>([]);
	let note = $state<LadderNote>(null);
	let refused = $state<number | null>(null);
	let hinting = $state(false);

	const rows = $derived(rowsOf(options().start, divisors, options().mode));
	const current = $derived(rows[rows.length - 1]);
	const done = $derived(isDone(current, options().mode));
	const suggested = $derived(hint(current, options().mode));
	const answer = $derived(product(divisors));

	function take(d: number) {
		if (done) return;
		// `current` moves on as soon as the divisor is added, so the note keeps a
		// snapshot of the row that was actually divided.
		const before = current;
		const result = tryDivisor(before, d, options().mode);
		hinting = false;
		note = { before, d, result };
		if (!result.ok) {
			refused = d;
			return;
		}
		refused = null;
		divisors = [...divisors, d];
	}

	// Watch: take the hint step on every tick until the ladder is done.
	const stepper = startStepper(() => {
		const d = suggested;
		if (d === undefined) return false;
		take(d);
		return !done;
	});

	function reset() {
		stepper.stop();
		divisors = [];
		note = null;
		refused = null;
		hinting = false;
	}

	return {
		get divisors() {
			return divisors;
		},
		get rows() {
			return rows;
		},
		get current() {
			return current;
		},
		get done() {
			return done;
		},
		get suggested() {
			return suggested;
		},
		get answer() {
			return answer;
		},
		get note() {
			return note;
		},
		get refused() {
			return refused;
		},
		get hinting() {
			return hinting;
		},
		get watching() {
			return stepper.playing;
		},
		choose(d) {
			stepper.stop();
			take(d);
		},
		undo() {
			stepper.stop();
			hinting = false;
			refused = null;
			divisors = divisors.slice(0, -1);
			note = null;
		},
		reset,
		toggleHint() {
			hinting = !hinting;
		},
		watch() {
			reset();
			note = 'watch';
			stepper.play();
		},
		stop: stepper.stop
	};
}
