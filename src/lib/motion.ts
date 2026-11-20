// Whether the reader asked their device for less motion. CSS handles this with a
// media query (app.css); Svelte transitions run in JS, so they ask here instead and
// collapse to an instant change. Safe on the server, where there is no `window`.
export function reducedMotion(): boolean {
	return (
		typeof window !== 'undefined' &&
		typeof window.matchMedia === 'function' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

/** `ms` normally, 0 when the reader prefers reduced motion. */
export function motionDuration(ms: number): number {
	return reducedMotion() ? 0 : ms;
}
