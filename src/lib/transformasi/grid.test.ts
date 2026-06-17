import { describe, it, expect } from 'vitest';
import { toPx, toCartesian, snap, clamp, RANGE, UNIT } from './grid';
import { translate, type Shape, type Point } from './geometry';

// A deterministic pseudo-random generator so the property checks are repeatable.
function makeRng(seed: number) {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 2 ** 32;
		return state / 2 ** 32;
	};
}

// Normalise -0 to 0 so Vitest's structural equality treats the two as one number.
const z = (n: number) => (n === 0 ? 0 : n);

/** A random integer Cartesian point inside the grid range. */
function randInteger(rng: () => number): Point {
	const span = 2 * RANGE + 1;
	return {
		x: z(Math.floor(rng() * span) - RANGE),
		y: z(Math.floor(rng() * span) - RANGE)
	};
}

const square: Shape = {
	points: [
		{ x: -2, y: -2 },
		{ x: 2, y: -2 },
		{ x: 2, y: 2 },
		{ x: -2, y: 2 }
	]
};

describe('toPx', () => {
	it('maps the origin to the centre of the viewport', () => {
		const o = toPx({ x: 0, y: 0 });
		expect(o).toEqual(toPx({ x: 0, y: 0 }));
		// The grid is centered, so the origin sits one PADDING + RANGE units in.
		expect(o.x).toBe(o.y);
	});

	it('flips y: a larger Cartesian y is a smaller SVG y (up reads upward)', () => {
		const low = toPx({ x: 0, y: 1 });
		const high = toPx({ x: 0, y: 5 });
		expect(high.y).toBeLessThan(low.y);
	});

	it('moves one Cartesian unit by exactly UNIT px on each axis', () => {
		const o = toPx({ x: 0, y: 0 });
		expect(toPx({ x: 1, y: 0 }).x - o.x).toBe(UNIT);
		expect(o.y - toPx({ x: 0, y: 1 }).y).toBe(UNIT);
	});
});

describe('toCartesian', () => {
	it('round-trips with toPx for every integer lattice point in range', () => {
		for (let x = -RANGE; x <= RANGE; x++) {
			for (let y = -RANGE; y <= RANGE; y++) {
				const back = toCartesian(toPx({ x, y }));
				expect(back).toEqual({ x: z(x), y: z(y) });
			}
		}
	});

	it('round-trips through toPx for random integer points', () => {
		const rng = makeRng(1);
		for (let i = 0; i < 2_000; i++) {
			const p = randInteger(rng);
			expect(toCartesian(toPx(p))).toEqual(p);
		}
	});
});

describe('snap', () => {
	it('lands on the nearest integer point', () => {
		expect(snap({ x: 1.4, y: -2.6 })).toEqual({ x: 1, y: -3 });
		expect(snap({ x: -0.2, y: 0.2 })).toEqual({ x: 0, y: 0 });
	});

	it('recovers the integer point a pointer px landed near', () => {
		const rng = makeRng(2);
		for (let i = 0; i < 2_000; i++) {
			const p = randInteger(rng);
			// A pointer dropped anywhere inside the cell around p maps back to p.
			const jitterX = (rng() - 0.5) * UNIT * 0.9;
			const jitterY = (rng() - 0.5) * UNIT * 0.9;
			const px = toPx(p);
			expect(snap(toCartesian({ x: px.x + jitterX, y: px.y + jitterY }))).toEqual(p);
		}
	});
});

describe('clamp', () => {
	it('leaves a vector that keeps every vertex in range unchanged', () => {
		// square spans -2..2, so it can shift up to ±4 on each axis before leaving.
		expect(clamp({ dx: 4, dy: -4 }, square)).toEqual({ dx: 4, dy: -4 });
		expect(clamp({ dx: 0, dy: 0 }, square)).toEqual({ dx: 0, dy: 0 });
	});

	it('never lets a translated vertex leave the −6…+6 grid', () => {
		const rng = makeRng(3);
		for (let i = 0; i < 5_000; i++) {
			const vector = {
				dx: z(Math.round(rng() * 40 - 20)),
				dy: z(Math.round(rng() * 40 - 20))
			};
			const moved = translate(square, clamp(vector, square));
			for (const p of moved.points) {
				expect(p.x).toBeGreaterThanOrEqual(-RANGE);
				expect(p.x).toBeLessThanOrEqual(RANGE);
				expect(p.y).toBeGreaterThanOrEqual(-RANGE);
				expect(p.y).toBeLessThanOrEqual(RANGE);
			}
		}
	});

	it('clamps only the axis that overflows, leaving the in-range axis intact', () => {
		// dx = 10 overflows (max x 2 + 10 = 12), dy = 1 is fine.
		expect(clamp({ dx: 10, dy: 1 }, square)).toEqual({ dx: 4, dy: 1 });
	});
});
