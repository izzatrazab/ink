// Pure geometry for the Transformasi Isometri lessons — the single source of
// truth for "where the image goes" (the analog of the old Evaluator, ADR-0002).
//
// This module stays free of Svelte, the DOM, SVG, and any `$lib`/server imports
// so it remains independently testable (ADR-0008, the geometry seam). The same
// `translate`/`translationVector` that the slide-to-overlay animates are reused
// wholesale by Section 11.2, so the visual and the logic cannot drift apart.

/** A single point in a Shape's coordinate space. */
export type Point = { x: number; y: number };

/** A polygon figure, as an ordered list of vertices. */
export type Shape = {
	points: Point[];
};

/** A translation: how far to slide, right/left over up/down (a column vector). */
export type Vector = { dx: number; dy: number };

/** A figure's reference point — the vertex a translation is measured against. */
function anchor(shape: Shape): Point {
	return shape.points[0];
}

/** Slides every point of a Shape by the same Vector, returning a new Shape. */
export function translate(shape: Shape, vector: Vector): Shape {
	return {
		points: shape.points.map((p) => ({ x: p.x + vector.dx, y: p.y + vector.dy }))
	};
}

/** The Vector that slides `from`'s anchor onto `to`'s anchor. */
export function translationVector(from: Shape, to: Shape): Vector {
	return {
		dx: anchor(to).x - anchor(from).x,
		dy: anchor(to).y - anchor(from).y
	};
}
