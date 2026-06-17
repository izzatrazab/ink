<script lang="ts">
	import Stage from '$lib/transformasi/Stage.svelte';
	import SlideToOverlay from '$lib/transformasi/SlideToOverlay.svelte';
	import { translate, type Shape, type Vector } from '$lib/transformasi/geometry';

	// The object, and its image produced purely by the geometry seam. Authoring the
	// image as translate(objek, …) keeps the picture on screen equal to the function
	// the slide-to-overlay animates, so visual and geometry cannot drift.
	const objek: Shape = {
		points: [
			{ x: 18, y: 28 },
			{ x: 58, y: 38 },
			{ x: 50, y: 82 },
			{ x: 14, y: 66 }
		]
	};
	const translasi: Vector = { dx: 112, dy: 0 };
	const imej: Shape = translate(objek, translasi);

	let moved = $state(false);
</script>

<svelte:head>
	<title>11.2 Translasi</title>
	<meta
		name="description"
		content="Bahagian 11.2: translasi — menggelongsorkan setiap titik objek jarak yang sama dalam arah yang sama."
	/>
</svelte:head>

<div class="container mx-auto max-w-2xl space-y-12 px-8 py-16">
	<hgroup class="space-y-2">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
			Bab 11 · Transformasi Isometri
		</p>
		<h1 class="text-4xl font-bold">11.2 Translasi</h1>
	</hgroup>

	<!-- Beat 1 — Translasi (concept): every point moves the same (a, b), and a
	     translation preserves shape, size, AND orientation — the property that
	     later distinguishes it from reflection. No coordinate grid here yet. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Translasi</h2>
		<p class="leading-relaxed">
			<strong>Translasi</strong> ialah transformasi yang menggelongsorkan setiap titik objek
			jarak yang sama dalam arah yang sama. Setiap titik beralih mengikut anjakan
			<strong>(a, b)</strong> yang serupa — <em>a</em> unit ke kiri atau kanan, dan
			<em>b</em> unit ke atas atau ke bawah.
		</p>
		<p class="leading-relaxed">
			Oleh kerana seluruh rajah bergerak sebagai satu, translasi mengekalkan bentuk, saiz, dan
			<strong>orientasi</strong> objek. <strong>Imej</strong> menghadap arah yang sama seperti
			<strong>objek</strong> — inilah yang membezakan translasi daripada pantulan kelak.
		</p>

		<figure class="space-y-4">
			<div
				class="border-base-300 bg-base-200 text-primary mx-auto aspect-[19/10] w-full max-w-xl rounded-2xl border p-4"
			>
				<Stage viewBox="0 0 190 100" class="h-full w-full">
					<!-- objek slides onto its imej; the slide-to-overlay derives the
					     vector from the two figures, so the motion can't drift. -->
					<SlideToOverlay object={objek} target={imej} play={moved} targetVariant="ghost" />
				</Stage>
			</div>

			<figcaption class="text-center opacity-70">
				Objek menggelongsor ke imejnya — setiap titik beralih anjakan yang sama, jadi bentuk, saiz,
				dan orientasi tetap sama.
			</figcaption>
		</figure>

		<div class="text-center">
			<button class="btn btn-primary" onclick={() => (moved = !moved)}>
				{moved ? 'Set semula' : 'Tunjuk translasi'}
			</button>
		</div>
	</section>
</div>
