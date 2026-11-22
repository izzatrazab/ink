<script lang="ts">
	import GameShell from '$lib/transformasi/GameShell.svelte';
	import MeetAgain from '$lib/factors-and-multiples/MeetAgain.svelte';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const copy = useCopy();
</script>

<GameShell
	chapter="factors-and-multiples"
	game="meet-again"
	description={copy.t.games.meetAgain.desc}
>
	<MeetAgain />
</GameShell>
