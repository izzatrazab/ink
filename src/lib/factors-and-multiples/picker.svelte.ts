// The live object behind a ladder's "Starting numbers" chips: which preset is
// chosen, or the numbers the student typed under "Your own". Both ladders
// (<DivisionLadder>, <CompareLadders>) held this same state and the same three
// actions by hand; here it lives once. The host keeps only its own progress and
// hands `onChange`, which fires whenever the starting numbers change (a chip is
// picked, or valid "Your own" numbers are applied) so the host can restart its
// ladder in the same step rather than reacting a frame late.
//
// Options come as a function so they stay live if the host's props change. The
// parsing rules stay in ladder.ts (`parseNumbers`).

import { parseNumbers, type StartCount } from './ladder';

export interface PickerOptions {
	/** The chapter's preset sets, each one starting row. */
	presets: number[][];
	/** Adds a "Your own" choice after the presets. */
	custom: boolean;
	/** One number to factorise, or several to compare. */
	count: StartCount;
}

export interface Picker {
	/** The numbers the ladder starts with; `[1]` until valid numbers exist, so what derives from it stays defined. */
	readonly start: number[];
	/** False while "Your own" is chosen but no valid numbers have been applied yet. */
	readonly ready: boolean;
	/** Whether "Your own" is the chosen chip. */
	readonly isCustom: boolean;
	/** Index of the chosen preset; equals `presets.length` while "Your own" is chosen. */
	readonly index: number;
	/** Whether the last attempt to apply typed numbers was rejected. */
	readonly error: boolean;
	/** The typed text for "Your own"; bind it to the input. */
	text: string;
	/** Chooses preset `i`; pass `presets.length` for "Your own". */
	pick(i: number): void;
	/** Reads `text`; valid numbers become the starting numbers, otherwise `error` is set. */
	apply(): void;
}

export function startPicker(options: () => PickerOptions, onChange: () => void = () => {}): Picker {
	let index = $state(0);
	let text = $state('');
	let applied = $state<number[] | null>(null);
	let error = $state(false);

	const isCustom = $derived(options().custom && index === options().presets.length);
	const start = $derived((isCustom ? applied : options().presets[index]) ?? [1]);
	const ready = $derived(!isCustom || applied !== null);

	return {
		get start() {
			return start;
		},
		get ready() {
			return ready;
		},
		get isCustom() {
			return isCustom;
		},
		get index() {
			return index;
		},
		get error() {
			return error;
		},
		get text() {
			return text;
		},
		set text(value: string) {
			text = value;
		},
		pick(i) {
			index = i;
			onChange();
		},
		apply() {
			const nums = parseNumbers(text, options().count);
			error = nums === null;
			if (nums) {
				applied = nums;
				onChange();
			}
		}
	};
}
