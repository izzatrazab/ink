<script lang="ts">
	import { toPx, RANGE } from './grid';

	// The Coordinate grid (satah Cartes): axes, unit gridlines, and integer tick
	// labels for a centered four-quadrant plane. Presentational — it asks grid.ts
	// where each Cartesian coordinate falls in px (so the y-flip stays in one pure
	// place, ADR-0009) and draws lines and upright text there. It renders only SVG
	// children; it sits inside a caller's <Stage>, which owns the viewBox.
	interface Props {
		/** Half-extent of the plane to draw: gridlines/ticks run −range…+range. */
		range?: number;
	}

	let { range = RANGE }: Props = $props();

	// The integer coordinates -range..range, the lines and ticks sit on these.
	const ticks = $derived(Array.from({ length: 2 * range + 1 }, (_, i) => i - range));
</script>

<g class="grid">
	<!-- Unit gridlines: one per integer coordinate, on both axes. -->
	<g class="gridlines">
		{#each ticks as i (i)}
			<line
				x1={toPx({ x: i, y: -range }).x}
				y1={toPx({ x: i, y: -range }).y}
				x2={toPx({ x: i, y: range }).x}
				y2={toPx({ x: i, y: range }).y}
			/>
			<line
				x1={toPx({ x: -range, y: i }).x}
				y1={toPx({ x: -range, y: i }).y}
				x2={toPx({ x: range, y: i }).x}
				y2={toPx({ x: range, y: i }).y}
			/>
		{/each}
	</g>

	<!-- The two axes through the origin, drawn stronger than the gridlines. -->
	<g class="axes">
		<line
			x1={toPx({ x: -range, y: 0 }).x}
			y1={toPx({ x: -range, y: 0 }).y}
			x2={toPx({ x: range, y: 0 }).x}
			y2={toPx({ x: range, y: 0 }).y}
		/>
		<line
			x1={toPx({ x: 0, y: -range }).x}
			y1={toPx({ x: 0, y: -range }).y}
			x2={toPx({ x: 0, y: range }).x}
			y2={toPx({ x: 0, y: range }).y}
		/>
	</g>

	<!-- Integer tick labels. Upright (no SVG transform): the y-flip is in toPx. -->
	<g class="ticks">
		{#each ticks as i (i)}
			{#if i !== 0}
				<!-- x-axis labels sit just below the axis. -->
				<text class="tick" x={toPx({ x: i, y: 0 }).x} y={toPx({ x: i, y: 0 }).y + 8}>
					{i}
				</text>
				<!-- y-axis labels sit just left of the axis. -->
				<text class="tick tick-y" x={toPx({ x: 0, y: i }).x - 4} y={toPx({ x: 0, y: i }).y}>
					{i}
				</text>
			{/if}
		{/each}
		<!-- A single 0 at the origin, tucked into the lower-left quadrant. -->
		<text class="tick" x={toPx({ x: 0, y: 0 }).x - 4} y={toPx({ x: 0, y: 0 }).y + 8}>0</text>
	</g>
</g>

<style>
	.gridlines line {
		stroke: currentColor;
		stroke-width: 0.5;
		opacity: 0.15;
	}
	.axes line {
		stroke: currentColor;
		stroke-width: 1;
		opacity: 0.5;
	}
	.tick {
		fill: currentColor;
		font-size: 6px;
		opacity: 0.55;
		text-anchor: middle;
		dominant-baseline: middle;
	}
	.tick-y {
		text-anchor: end;
	}
</style>
