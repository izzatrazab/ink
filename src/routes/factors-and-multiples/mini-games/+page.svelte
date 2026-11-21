<script lang="ts">
	import MiniGamesHub from '$lib/transformasi/MiniGamesHub.svelte';
	import { getChapter } from '$lib/chapters';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const copy = useCopy();
</script>

<MiniGamesHub chapter={getChapter('factors-and-multiples')} description={copy.t.games.hubDesc} />
