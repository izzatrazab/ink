<script lang="ts">
	import type { Snippet } from 'svelte';
	import Grid from './Grid.svelte';
	import { VIEW_BOX } from './grid';

	// The SVG viewport every figure is drawn into. Thin and presentational:
	// it sizes a coordinate space and renders whatever Figures it is given.
	//
	// When given a `range` it draws the Coordinate grid (satah Cartes) behind its
	// children and adopts the grid's viewBox; without one it stays gridless and
	// honours the `viewBox` prop, so Section 11.1's usage is unchanged.
	interface Props {
		/** The visible coordinate window, as "minX minY width height". */
		viewBox?: string;
		/** When set, draw a Cartesian grid spanning −range…+range behind children. */
		range?: number;
		class?: string;
		children?: Snippet;
	}

	let { viewBox = '0 0 100 100', range, class: className = '', children }: Props = $props();

	const resolvedViewBox = $derived(range !== undefined ? VIEW_BOX : viewBox);
</script>

<svg
	viewBox={resolvedViewBox}
	class={className}
	xmlns="http://www.w3.org/2000/svg"
	role="img"
	preserveAspectRatio="xMidYMid meet"
>
	{#if range !== undefined}
		<Grid {range} />
	{/if}
	{@render children?.()}
</svg>
