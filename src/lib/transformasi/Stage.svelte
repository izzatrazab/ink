<script lang="ts">
	import type { Snippet } from 'svelte';

	// The SVG viewport every figure is drawn into. Thin and presentational:
	// it sizes a coordinate space and renders whatever Figures it is given.
	// No coordinate grid yet — that arrives with Section 11.2.
	interface Props {
		/** The visible coordinate window, as "minX minY width height". */
		viewBox?: string;
		class?: string;
		children?: Snippet;
	}

	let { viewBox = '0 0 100 100', class: className = '', children }: Props = $props();
</script>

<svg
	{viewBox}
	class={className}
	xmlns="http://www.w3.org/2000/svg"
	role="img"
	preserveAspectRatio="xMidYMid meet"
>
	{@render children?.()}
</svg>
