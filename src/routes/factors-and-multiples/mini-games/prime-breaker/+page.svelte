<script lang="ts">
	import GameShell from '$lib/transformasi/GameShell.svelte';
	import PrimeBreaker from '$lib/factors-and-multiples/PrimeBreaker.svelte';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const copy = useCopy();
</script>

<GameShell
	chapter="factors-and-multiples"
	game="prime-breaker"
	description={copy.t.games.primeBreaker.desc}
>
	<PrimeBreaker />
</GameShell>
