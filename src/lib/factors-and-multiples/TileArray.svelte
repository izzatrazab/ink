<script lang="ts">
	import { tileLayout } from './tiles';

	// Draws `total` tiles wrapped into rows of `perRow` inside a 200 × 120 stage
	// (use viewBox="0 0 200 120"). Complete rows are solid; tiles left over in an
	// incomplete last row are drawn in the warning colour, so "does not divide
	// completely" is something you can see. Each tile carries its own transform, so
	// changing `perRow` makes the tiles glide to their new places.
	interface Props {
		total: number;
		perRow: number;
	}

	let { total, perRow }: Props = $props();

	const W = 200;
	const H = 120;
	const layout = $derived(tileLayout(total, perRow, W, H));
</script>

<g
	class="array"
	style:transform="translate({layout.offsetX}px, {layout.offsetY}px) scale({layout.scale})"
>
	{#each layout.tiles as tile, i (i)}
		<rect
			class="tile"
			width="0.88"
			height="0.88"
			rx="0.16"
			fill={tile.full ? 'currentColor' : 'var(--color-warning)'}
			style:transform="translate({tile.col + 0.06}px, {tile.row + 0.06}px)"
		/>
	{/each}
</g>

<style>
	.array,
	.tile {
		transform-origin: 0 0;
		transition: transform 0.35s ease;
	}
	.tile {
		transition:
			transform 0.35s ease,
			fill 0.2s ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.array,
		.tile {
			transition: none;
		}
	}
</style>
