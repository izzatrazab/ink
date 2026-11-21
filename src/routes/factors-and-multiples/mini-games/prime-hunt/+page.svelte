<script lang="ts">
	import GameShell from '$lib/transformasi/GameShell.svelte';
	import PrimeHunt from '$lib/factors-and-multiples/PrimeHunt.svelte';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const copy = useCopy();
</script>

<GameShell
	chapter="factors-and-multiples"
	game="prime-hunt"
	description={copy.t.games.primeHunt.desc}
>
	<PrimeHunt />
</GameShell>
