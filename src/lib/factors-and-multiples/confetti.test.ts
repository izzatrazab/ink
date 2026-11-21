import { describe, expect, it } from 'vitest';
import { PALETTE, makePieces } from './confetti';

let x = 0.21;
const rng = () => (x = (x * 9301 + 0.49297) % 1);

describe('makePieces', () => {
	it('makes the number of pieces asked for', () => {
		expect(makePieces(40, rng)).toHaveLength(40);
		expect(makePieces(0, rng)).toHaveLength(0);
	});
	it('spreads pieces across the width and staggers their start', () => {
		const pieces = makePieces(60, rng);
		expect(pieces.every((p) => p.left >= 0 && p.left <= 100)).toBe(true);
		expect(new Set(pieces.map((p) => Math.round(p.left / 10))).size).toBeGreaterThan(5);
		expect(pieces.every((p) => p.delay >= 0 && p.delay <= 0.8)).toBe(true);
	});
	it('keeps every piece falling for a moment, and every colour in the palette', () => {
		const pieces = makePieces(60, rng);
		expect(pieces.every((p) => p.duration >= 1.8 && p.duration <= 3.2)).toBe(true);
		expect(pieces.every((p) => p.color >= 0 && p.color < PALETTE.length)).toBe(true);
		expect(new Set(pieces.map((p) => p.color)).size).toBeGreaterThan(2);
	});
	it('is deterministic for a given random function', () => {
		const run = () => {
			let y = 0.5;
			return makePieces(10, () => (y = (y * 9301 + 0.49297) % 1));
		};
		expect(run()).toEqual(run());
	});
});
