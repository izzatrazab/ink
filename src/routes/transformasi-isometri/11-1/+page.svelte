<script lang="ts">
	import Stage from '$lib/transformasi/Stage.svelte';
	import Figure from '$lib/transformasi/Figure.svelte';
	import {
		translate,
		translationVector,
		type Shape,
		type Vector
	} from '$lib/transformasi/geometry';

	// The object, and its image produced purely by the geometry seam. Authoring the
	// image as translate(objek, …) — rather than a second hand-placed shape — means
	// the picture on screen is the function under test.
	const objek: Shape = {
		points: [
			{ x: 18, y: 28 },
			{ x: 58, y: 38 },
			{ x: 50, y: 82 },
			{ x: 14, y: 66 }
		]
	};
	const displacement: Vector = { dx: 112, dy: 0 };
	const imej: Shape = translate(objek, displacement);

	// The slide the animation plays is recovered from the two figures, so the visual
	// motion and the logic share one source and cannot drift.
	const v: Vector = translationVector(objek, imej);

	let moved = $state(false);
</script>

<svelte:head>
	<title>11.1 Transformasi dan Kekongruenan</title>
	<meta
		name="description"
		content="Bahagian 11.1: pengenalan kepada transformasi dan kekongruenan."
	/>
</svelte:head>

<div class="container mx-auto max-w-2xl space-y-10 px-8 py-16">
	<hgroup class="space-y-2">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
			Bab 11 · Transformasi Isometri
		</p>
		<h1 class="text-4xl font-bold">11.1 Transformasi dan Kekongruenan</h1>
	</hgroup>

	<figure class="space-y-4">
		<div
			class="border-base-300 bg-base-200 text-primary mx-auto aspect-[19/10] w-full max-w-xl rounded-2xl border p-4"
		>
			<Stage viewBox="0 0 190 100" class="h-full w-full">
				<!-- imej: where the object lands, drawn faintly as the target -->
				<g class="opacity-25">
					<Figure shape={imej} />
				</g>
				<!-- objek: slides by v to coincide with the imej -->
				<g
					class="mover"
					style:transform={moved ? `translate(${v.dx}px, ${v.dy}px)` : 'translate(0px, 0px)'}
				>
					<Figure shape={objek} />
				</g>
			</Stage>
		</div>

		<figcaption class="text-center opacity-70">
			Objek dan imejnya — bentuk dan saiz yang sama, hanya beralih kedudukan.
		</figcaption>
	</figure>

	<div class="text-center">
		<button class="btn btn-primary" onclick={() => (moved = !moved)}>
			{moved ? 'Set semula' : 'Tunjuk kenapa'}
		</button>
	</div>
</div>

<style>
	.mover {
		transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
