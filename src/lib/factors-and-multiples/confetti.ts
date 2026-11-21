// The layout of a confetti burst, as plain data: where each piece starts, when it
// falls, how long for, how big, how far it drifts and spins, and which colour.
// Kept apart from the component so it is deterministic given a random function.

/** The theme colours confetti is drawn in, as CSS variables (see app.css). */
export const PALETTE = [
	'--color-primary',
	'--color-secondary',
	'--color-accent',
	'--color-success',
	'--color-warning',
	'--color-info'
] as const;

export interface Piece {
	/** Horizontal start, as a percentage of the width. */
	left: number;
	/** Seconds before it starts to fall. */
	delay: number;
	/** Seconds it takes to fall. */
	duration: number;
	/** Width in pixels; the piece is a little taller than wide. */
	size: number;
	/** Sideways drift in pixels over the fall, negative to the left. */
	drift: number;
	/** Turns about its own axis over the fall, in degrees. */
	spin: number;
	/** Index into `PALETTE`. */
	color: number;
}

const between = (rng: () => number, lo: number, hi: number) => lo + rng() * (hi - lo);

/** `count` pieces for one burst. */
export function makePieces(count: number, rng: () => number = Math.random): Piece[] {
	return Array.from({ length: count }, () => ({
		left: between(rng, 0, 100),
		delay: between(rng, 0, 0.8),
		duration: between(rng, 1.8, 3.2),
		size: between(rng, 7, 13),
		drift: between(rng, -120, 120),
		spin: between(rng, 360, 1080) * (rng() < 0.5 ? -1 : 1),
		color: Math.floor(rng() * PALETTE.length)
	}));
}
