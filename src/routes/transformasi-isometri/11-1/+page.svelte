<script lang="ts">
	import Stage from '$lib/transformasi/Stage.svelte';
	import Figure from '$lib/transformasi/Figure.svelte';
	import type { Shape } from '$lib/transformasi/geometry';

	// One static objek, proving Shape → <polygon> renders end-to-end through
	// <Figure> inside <Stage>. The vocabulary beat and congruency classifier
	// land in later issues.
	const objek: Shape = {
		points: [
			{ x: 30, y: 18 },
			{ x: 72, y: 30 },
			{ x: 62, y: 74 },
			{ x: 24, y: 58 }
		]
	};
</script>

<svelte:head>
	<title>11.1 Transformasi dan Kekongruenan</title>
	<meta
		name="description"
		content="Bahagian 11.1: pengenalan kepada transformasi dan kekongruenan."
	/>
</svelte:head>

<div class="container mx-auto max-w-2xl px-8 py-16 space-y-10">
	<hgroup class="space-y-2">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
			Bab 11 · Transformasi Isometri
		</p>
		<h1 class="text-4xl font-bold">11.1 Transformasi dan Kekongruenan</h1>
	</hgroup>

	<figure class="space-y-3">
		<div
			class="border-base-300 bg-base-200 text-primary mx-auto aspect-square w-full max-w-sm rounded-2xl border p-4"
		>
			<Stage class="h-full w-full">
				<Figure shape={objek} />
			</Stage>
		</div>
		<figcaption class="text-center opacity-70">Sebuah objek.</figcaption>
	</figure>
</div>
