import { describe, it, expect } from 'vitest';
import { anchor, translate, translationVector, type Shape, type Vector } from './geometry';

// A deterministic pseudo-random generator so the property checks are repeatable.
function makeRng(seed: number) {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 2 ** 32;
		return state / 2 ** 32;
	};
}

// Normalise -0 to 0. Math.round can yield -0, and adding/negating zero flips its
// sign; the geometry treats them as one number, but Vitest's toEqual does not.
const z = (n: number) => (n === 0 ? 0 : n);

function randInt(rng: () => number): number {
	return z(Math.round(rng() * 200 - 100));
}

function randomShape(rng: () => number): Shape {
	const count = 3 + Math.floor(rng() * 5); // 3..7 vertices
	const points = Array.from({ length: count }, () => ({ x: randInt(rng), y: randInt(rng) }));
	return { points };
}

function randomVector(rng: () => number): Vector {
	return { dx: randInt(rng), dy: randInt(rng) };
}

const square: Shape = {
	points: [
		{ x: 0, y: 0 },
		{ x: 10, y: 0 },
		{ x: 10, y: 10 },
		{ x: 0, y: 10 }
	]
};

describe('anchor', () => {
	it('is the first vertex — the point translationVector measures from', () => {
		const rng = makeRng(7);
		for (let i = 0; i < 2_000; i++) {
			const a = randomShape(rng);
			const b = randomShape(rng);
			// translationVector slides a's anchor exactly onto b's, by construction.
			expect(translate(a, translationVector(a, b)).points[0]).toEqual(anchor(b));
			expect(anchor(a)).toBe(a.points[0]);
		}
	});
});

describe('translate', () => {
	it('moves every vertex by the vector', () => {
		expect(translate(square, { dx: 5, dy: -3 })).toEqual({
			points: [
				{ x: 5, y: -3 },
				{ x: 15, y: -3 },
				{ x: 15, y: 7 },
				{ x: 5, y: 7 }
			]
		});
	});

	it('the zero vector is the identity', () => {
		const rng = makeRng(1);
		for (let i = 0; i < 2_000; i++) {
			const shape = randomShape(rng);
			expect(translate(shape, { dx: 0, dy: 0 })).toEqual(shape);
		}
	});

	it('composes additively: translating by u then v equals translating by u + v', () => {
		const rng = makeRng(2);
		for (let i = 0; i < 2_000; i++) {
			const shape = randomShape(rng);
			const u = randomVector(rng);
			const v = randomVector(rng);
			expect(translate(translate(shape, u), v)).toEqual(
				translate(shape, { dx: u.dx + v.dx, dy: u.dy + v.dy })
			);
		}
	});

	it('does not mutate its input', () => {
		const before = structuredClone(square);
		translate(square, { dx: 7, dy: 7 });
		expect(square).toEqual(before);
	});
});

describe('translationVector', () => {
	it('round-trips: translating a figure by the vector to its translate reproduces it exactly', () => {
		const rng = makeRng(3);
		for (let i = 0; i < 2_000; i++) {
			const a = randomShape(rng);
			const v = randomVector(rng);
			const b = translate(a, v); // a congruent, same-orientation translate of a
			expect(translate(a, translationVector(a, b))).toEqual(b);
		}
	});

	it("lands the source figure's anchor exactly on the target's, even for unrelated shapes", () => {
		const rng = makeRng(4);
		for (let i = 0; i < 2_000; i++) {
			const a = randomShape(rng);
			const b = randomShape(rng);
			const landed = translate(a, translationVector(a, b));
			expect(landed.points[0]).toEqual(b.points[0]);
		}
	});

	it('is antisymmetric: the vector from a to b is the negation of b to a', () => {
		const rng = makeRng(5);
		for (let i = 0; i < 2_000; i++) {
			const a = randomShape(rng);
			const b = randomShape(rng);
			const ab = translationVector(a, b);
			const ba = translationVector(b, a);
			expect(ab).toEqual({ dx: z(-ba.dx), dy: z(-ba.dy) });
		}
	});

	it('from a figure to itself is the zero vector', () => {
		const rng = makeRng(6);
		for (let i = 0; i < 2_000; i++) {
			const a = randomShape(rng);
			expect(translationVector(a, a)).toEqual({ dx: 0, dy: 0 });
		}
	});
});
