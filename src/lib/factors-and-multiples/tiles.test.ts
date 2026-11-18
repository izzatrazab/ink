import { describe, expect, it } from 'vitest';
import { tileLayout } from './tiles';

describe('tileLayout', () => {
	it('wraps tiles into rows of the given size', () => {
		const { tiles } = tileLayout(12, 4, 200, 120);
		expect(tiles[3]).toEqual({ col: 3, row: 0, full: true });
		expect(tiles[4]).toEqual({ col: 0, row: 1, full: true });
		expect(tiles[11]).toEqual({ col: 3, row: 2, full: true });
	});

	it('marks the incomplete last row as leftover', () => {
		const { tiles } = tileLayout(12, 5, 200, 120);
		expect(tiles.filter((t) => !t.full)).toHaveLength(2);
		expect(tiles[9].full).toBe(true);
		expect(tiles[10].full).toBe(false);
	});

	it('has no leftover when the size divides the total', () => {
		expect(tileLayout(12, 6, 200, 120).tiles.every((t) => t.full)).toBe(true);
	});

	it('fits the array inside the viewport and centres it', () => {
		const { scale, offsetX, offsetY } = tileLayout(24, 1, 200, 120);
		expect(scale).toBeCloseTo(5); // 24 rows in 120 units
		expect(offsetX).toBeCloseTo((200 - 5) / 2);
		expect(offsetY).toBeCloseTo(0);
	});

	it('caps the tile size', () => {
		expect(tileLayout(2, 2, 200, 120).scale).toBe(20);
	});

	it('treats a row size larger than the total as one row', () => {
		const { tiles } = tileLayout(5, 8, 200, 120);
		expect(tiles.every((t) => t.row === 0)).toBe(true);
	});
});
