<script lang="ts">
	import { onMount } from 'svelte';
	import MiniGamesHub from '$lib/transformasi/MiniGamesHub.svelte';
	import { getChapter } from '$lib/chapters';
	import { gameProgress } from '$lib/factors-and-multiples/gameProgress';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const copy = useCopy();

	// What the reader has done is in their browser, so it appears after mount; it is
	// re-worded from the same saved numbers when the language changes.
	let loaded = $state(false);
	onMount(() => (loaded = true));
	const progress = $derived(
		loaded ? gameProgress((key) => localStorage.getItem(key), copy.t.games.hub) : {}
	);
</script>

<MiniGamesHub
	chapter={getChapter('factors-and-multiples')}
	description={copy.t.games.hubDesc}
	{progress}
/>
