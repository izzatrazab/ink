<script lang="ts">
	import GameShell from '$lib/transformasi/GameShell.svelte';
	import MultiplesHunt from '$lib/factors-and-multiples/MultiplesHunt.svelte';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const copy = useCopy();
</script>

<GameShell
	chapter="factors-and-multiples"
	game="multiples-hunt"
	description={copy.t.games.multiplesHunt.desc}
>
	<MultiplesHunt />
</GameShell>
