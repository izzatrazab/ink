// Layout and limits for the lanes Reveals and the student's own lanes in
// <LanesExplorer>. The stage is a fixed 200 × 120 box, so a lane set is only
// drawable while its dots / pieces stay legible: an LCM past MAX_LCM would crowd
// the dots, and an HCF whose longest lane splits into more than MAX_PIECES pieces
// would draw slivers. Pure and framework-free.

import { hcf, lcm } from './numbers';

export const MAX_LANES = 4;
export const MIN_NUMBER = 2;
export const MAX_NUMBER = 999;
export const MAX_LCM = 120;
export const MAX_PIECES = 60;

/** Top of the first lane in the 200 × 120 stage, and the vertical space between lanes. */
export const TOP = 16;
export const laneGap = (count: number) => Math.min(24, 96 / Math.max(count, 1));
/** The y of lane `index` when `count` lanes share the stage. */
export const laneY = (index: number, count: number) => TOP + index * laneGap(count) + 8;

/** What the student typed per lane, as numbers: null for a lane that is empty, not a
 *  whole number from 2 to 999, or repeats an earlier lane. */
export function rowValues(inputs: string[]): (number | null)[] {
	const seen = new Set<number>();
	return inputs.map((raw) => {
		const s = raw.trim();
		if (!/^\d+$/.test(s)) return null;
		const n = Number(s);
		if (n < MIN_NUMBER || n > MAX_NUMBER || seen.has(n)) return null;
		seen.add(n);
		return n;
	});
}

/** Whether a lane box is simply empty (fine, not an error) or holds something unusable. */
export function rowIssue(inputs: string[], values: (number | null)[], i: number) {
	if (values[i] !== null) return null;
	return inputs[i].trim() === '' ? 'blank' : 'invalid';
}

/** Whether the LCM lanes fit the stage. */
export function lcmDrawable(numbers: number[]): boolean {
	return lcm(numbers) <= MAX_LCM;
}

/** Whether the HCF lanes fit the stage. */
export function hcfDrawable(numbers: number[]): boolean {
	return Math.max(...numbers) / hcf(numbers) <= MAX_PIECES;
}
