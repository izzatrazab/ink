// Pure viewport math for the Coordinate grid (satah Cartes) — the second
// framework-free seam alongside geometry.ts. It owns the one place the Cartesian
// plane the chapter teaches meets the SVG plane the browser draws: the y-flip
// lives here as a pure function, never as an SVG transform, so axes, tick
// labels, and the column-vector readout all stay upright (ADR-0009).
//
// Like geometry.ts this module imports nothing from Svelte/DOM/SVG/$lib/server;
// a framework import creeping in is a regression (ADR-0008/0009). Pages compute
// everything in Cartesian and map shapes through `toPx` just before handing them
// to <Figure>; <Stage>/<Figure> stay px-only and presentational.

import type { Point, Shape, Vector } from './geometry';

/** Half-extent of the plane: a centered four-quadrant grid spanning −6…+6. */
export const RANGE = 6;
/** SVG px per Cartesian unit. */
export const UNIT = 20;
/** px margin around the grid so edge tick labels are not clipped. */
export const PADDING = 16;

/** px coordinate of the Cartesian origin (0, 0) — the grid is centered. */
const ORIGIN = PADDING + RANGE * UNIT;
/** Full side length of the drawn viewport in px. */
const SIDE = 2 * RANGE * UNIT + 2 * PADDING;

/** The viewBox <Stage> uses when it draws this grid: "minX minY width height". */
export const VIEW_BOX = `0 0 ${SIDE} ${SIDE}`;

/** −0 reads as 0: round can yield −0, which trips strict/structural equality. */
const norm = (n: number) => (n === 0 ? 0 : n);

/**
 * Maps a Cartesian point to SVG px. This is where y flips: a larger Cartesian
 * `y` ("further up") becomes a smaller SVG `y`, so `b = +y` reads upward.
 */
export function toPx(point: Point): Point {
	return {
		x: ORIGIN + point.x * UNIT,
		y: ORIGIN - point.y * UNIT
	};
}

/**
 * Maps a whole Shape from Cartesian to SVG px — the render-boundary operation
 * ADR-0009 names ("pages compute everything in Cartesian and map shapes through
 * `toPx` just before handing them to <Figure>"). Pages call this instead of
 * re-spelling `{ points: shape.points.map(toPx) }` at each figure.
 */
export function toPxShape(shape: Shape): Shape {
	return { points: shape.points.map(toPx) };
}

/** The exact inverse of `toPx`: maps an SVG px point back to Cartesian (unsnapped). */
export function toCartesian(px: Point): Point {
	return {
		x: norm((px.x - ORIGIN) / UNIT),
		y: norm((ORIGIN - px.y) / UNIT)
	};
}

/** Rounds a Cartesian point to the nearest integer lattice point. */
export function snap(point: Point): Point {
	return {
		x: norm(Math.round(point.x)),
		y: norm(Math.round(point.y))
	};
}

/** Clamps a scalar into [lo, hi]. */
const clampScalar = (value: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, value));

/**
 * Constrains a translation so every vertex of `object`, once translated, still
 * lands within the −6…+6 grid. Each axis is clamped independently to the widest
 * shift that keeps the whole figure on the plane; a vector already within range
 * is returned unchanged. Assumes `object` itself lies within range.
 */
export function clamp(vector: Vector, object: Shape): Vector {
	const xs = object.points.map((p) => p.x);
	const ys = object.points.map((p) => p.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	return {
		dx: norm(clampScalar(vector.dx, -RANGE - minX, RANGE - maxX)),
		dy: norm(clampScalar(vector.dy, -RANGE - minY, RANGE - maxY))
	};
}
