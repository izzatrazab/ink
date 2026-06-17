<script lang="ts">
	import type { Snippet } from 'svelte';

	// The bordered, rounded card that frames a <Stage>. A thin presentational
	// wrapper: it owns the card surface (border, background, padding, centering)
	// and its aspect ratio, and renders whatever Stage it is given as children.
	interface Props {
		/** CSS aspect-ratio for the card, e.g. "19/10" or "1/1". */
		aspect: string;
		/** Extra literal classes, e.g. a max-width utility like "max-w-md". */
		class?: string;
		children: Snippet;
	}

	let { aspect, class: className = 'max-w-xl', children }: Props = $props();
</script>

<div
	class="border-base-300 bg-base-200 text-primary mx-auto w-full rounded-2xl border p-4 {className}"
	style:aspect-ratio={aspect}
>
	{@render children()}
</div>
