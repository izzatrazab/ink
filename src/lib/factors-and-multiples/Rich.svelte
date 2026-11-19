<script lang="ts">
	import { parseRich } from './copy';

	// Renders copy with **bold** runs as real <strong> elements — no {@html}.
	let { text }: { text: string } = $props();
	const runs = $derived(parseRich(text));
</script>

{#each runs as run, i (i)}{#if run.bold}<strong>{run.text}</strong>{:else}{run.text}{/if}{/each}
