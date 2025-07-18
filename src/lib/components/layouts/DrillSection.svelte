<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	interface propInterface {
		heading?: string;
		id?: string;
		main?: Snippet;
		info?: Snippet;
	}

	let { heading = '', id = '', main, info }: propInterface = $props();
	const uid = $props.id();

	onMount(() => {
		id = `${uid}-${id}`;
	});
</script>

<div>
	<h2 class="text-xl font-bold">{heading}</h2>
	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<div class="flex-1">{@render info?.()}</div>
		<div>{@render main?.()}</div>
	</article>
</div>
