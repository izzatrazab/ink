// Pure geometry types for the Transformasi Isometri lessons.
//
// This module stays free of Svelte, the DOM, SVG, and any `$lib`/server
// imports so it remains independently testable (ADR-0008, the geometry seam).
// `translate`/`translationVector` join it later, when Section 11.1's classifier
// needs them; the walking skeleton only needs to name a Shape.

/** A single point in a Shape's coordinate space. */
export type Point = { x: number; y: number };

/** A polygon figure, as an ordered list of vertices. */
export type Shape = {
	points: Point[];
};
