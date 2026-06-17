<script lang="ts">
	import type { Point } from './geometry';

	// Draws the Translation vector as an arrow: a line from the Object's anchor to
	// anchor + vector, capped with an arrowhead. Presentational and px-only — the
	// caller maps Cartesian → px through grid.ts's toPx (ADR-0009) and hands the
	// two endpoints here, so the arrow and the geometry cannot drift. It renders
	// SVG content meant to sit inside a caller's <Stage>.
	interface Props {
		/** The arrow's tail, in SVG px (the Object's anchor). */
		from: Point;
		/** The arrow's head, in SVG px (anchor + vector). */
		to: Point;
		/** Unique marker id, so multiple arrows on one page don't collide. */
		id?: string;
	}

	let { from, to, id = 'vector-arrowhead' }: Props = $props();

	// A zero vector has no direction to point — show the anchor as a dot instead
	// of a degenerate, orientation-less arrowhead.
	const isZero = $derived(from.x === to.x && from.y === to.y);
</script>

{#if isZero}
	<circle cx={from.x} cy={from.y} r="1.5" fill="currentColor" />
{:else}
	<defs>
		<marker
			{id}
			markerWidth="6"
			markerHeight="6"
			refX="5"
			refY="3"
			orient="auto"
			markerUnits="strokeWidth"
		>
			<path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
		</marker>
	</defs>
	<line
		x1={from.x}
		y1={from.y}
		x2={to.x}
		y2={to.y}
		stroke="currentColor"
		stroke-width="1.5"
		marker-end="url(#{id})"
	/>
{/if}
