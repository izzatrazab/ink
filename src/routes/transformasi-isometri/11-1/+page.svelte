<script lang="ts">
	import Stage from '$lib/transformasi/Stage.svelte';
	import Figure from '$lib/transformasi/Figure.svelte';
	import {
		translate,
		translationVector,
		type Shape,
		type Vector
	} from '$lib/transformasi/geometry';
	import {
		pairs,
		initialState,
		submitAnswer,
		nextPair,
		currentPair,
		isAnswered,
		isCorrect,
		isLast,
		type Answer
	} from '$lib/transformasi/classifier';

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

	// The "congruent even when flipped" illustration. The second figure is the first
	// reflected across a vertical axis (x' = 160 - x) and authored as plain points —
	// no transformation mechanic. Reflection is an isometry, so the two figures are
	// genuinely congruent (same shape and size) while facing opposite ways.
	const rajahA: Shape = {
		points: [
			{ x: 20, y: 30 },
			{ x: 70, y: 40 },
			{ x: 45, y: 85 }
		]
	};
	const rajahB: Shape = {
		points: [
			{ x: 140, y: 30 },
			{ x: 90, y: 40 },
			{ x: 115, y: 85 }
		]
	};

	// Congruency classifier — interaction lives in the pure state machine; the page
	// only holds the current snapshot and reads derived view-state off it.
	let quiz = $state(initialState(pairs));
	const pair = $derived(currentPair(quiz));
	const answered = $derived(isAnswered(quiz));
	const correct = $derived(isCorrect(quiz));
	const last = $derived(isLast(quiz));

	// The slide that drives the congruent-pair "why": the same translationVector
	// the geometry seam uses for the demo above, recovered from the two figures.
	const slide = $derived(
		quiz.overlayPlaying ? translationVector(pair.objek, pair.banding) : { dx: 0, dy: 0 }
	);

	function answer(choice: Answer) {
		quiz = submitAnswer(quiz, choice);
	}
</script>

<svelte:head>
	<title>11.1 Transformasi dan Kekongruenan</title>
	<meta
		name="description"
		content="Bahagian 11.1: pengenalan kepada transformasi dan kekongruenan."
	/>
</svelte:head>

<div class="container mx-auto max-w-2xl space-y-12 px-8 py-16">
	<hgroup class="space-y-2">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
			Bab 11 · Transformasi Isometri
		</p>
		<h1 class="text-4xl font-bold">11.1 Transformasi dan Kekongruenan</h1>
	</hgroup>

	<!-- Beat 1 — Transformasi: what a transformation is, shown by an objek becoming
	     an imej through a change in position. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Transformasi</h2>
		<p class="leading-relaxed">
			<strong>Transformasi</strong> ialah perubahan kedudukan, orientasi, atau saiz sesuatu rajah.
			Rajah asal dipanggil <strong>objek</strong>, dan rajah yang terhasil dipanggil
			<strong>imej</strong>.
		</p>

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
				{moved ? 'Set semula' : 'Tunjuk transformasi'}
			</button>
		</div>
	</section>

	<!-- Beat 2 — Kekongruenan: same shape and size regardless of position or
	     orientation, with the coin touchstone and the flipped-but-congruent nuance. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Kekongruenan</h2>
		<p class="leading-relaxed">
			Dua rajah dikatakan <strong>kongruen</strong> jika kedua-duanya mempunyai bentuk dan saiz yang sama,
			tidak kira kedudukan atau orientasinya.
		</p>
		<p class="leading-relaxed">
			Contohnya, semua syiling 10 sen adalah kongruen. Tetapi syiling 20 sen dan syiling 10 sen
			hanya <em>serupa</em> — sama bentuk tetapi berlainan saiz — maka kedua-duanya
			<strong>tidak kongruen</strong>.
		</p>
		<p class="leading-relaxed">
			Dua rajah boleh kongruen walaupun ia diputar atau dibalikkan. <strong>Orientasi</strong> yang berbeza
			tidak menjejaskan kekongruenan — yang penting bentuk dan saiznya tetap sama.
		</p>

		<figure class="space-y-4">
			<div
				class="border-base-300 bg-base-200 text-primary mx-auto aspect-[8/5] w-full max-w-xl rounded-2xl border p-4"
			>
				<Stage viewBox="0 0 160 100" class="h-full w-full">
					<Figure shape={rajahA} />
					<Figure shape={rajahB} />
				</Stage>
			</div>

			<figcaption class="text-center opacity-70">
				Dua rajah kongruen — satu ialah balikan (pantulan) yang satu lagi, namun bentuk dan saiznya
				tetap sama.
			</figcaption>
		</figure>
	</section>

	<!-- Beat 3 — Latihan: one pair at a time, the student commits kongruen/tak
	     kongruen, then gets feedback. For congruent pairs the object slides onto the
	     comparand (the geometry seam's translationVector) as the visual "why". -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Latihan: Kongruen atau tidak?</h2>
		<p class="leading-relaxed">
			Lihat setiap pasangan rajah, kemudian tentukan sama ada kedua-duanya kongruen.
		</p>

		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
			Pasangan {quiz.index + 1} daripada {pairs.length}
		</p>

		<figure>
			<div
				class="border-base-300 bg-base-200 text-primary mx-auto aspect-[2/1] w-full max-w-xl rounded-2xl border p-4"
			>
				{#key quiz.index}
					<Stage viewBox="0 0 200 100" class="h-full w-full">
						<!-- comparand: drawn as an outline target -->
						<Figure shape={pair.banding} fill="none" stroke="currentColor" strokeWidth={2} />
						<!-- objek: filled; slides onto the comparand when the "why" plays -->
						<g class="mover" style:transform="translate({slide.dx}px, {slide.dy}px)">
							<Figure shape={pair.objek} />
						</g>
					</Stage>
				{/key}
			</div>
		</figure>

		<div class="flex justify-center gap-3">
			<button
				class="btn btn-outline btn-primary"
				class:btn-active={answered && quiz.selected === 'kongruen'}
				disabled={answered}
				onclick={() => answer('kongruen')}
			>
				Kongruen
			</button>
			<button
				class="btn btn-outline btn-primary"
				class:btn-active={answered && quiz.selected === 'tak-kongruen'}
				disabled={answered}
				onclick={() => answer('tak-kongruen')}
			>
				Tak kongruen
			</button>
		</div>

		{#if answered}
			<div class="alert" class:alert-success={correct} class:alert-error={!correct} role="status">
				<span>
					<strong>{correct ? 'Betul!' : 'Belum tepat.'}</strong>
					{pair.explanation}
				</span>
			</div>

			<div class="text-center">
				{#if last}
					<p class="opacity-70">Tahniah — anda telah menyelesaikan semua pasangan.</p>
				{:else}
					<button class="btn btn-primary" onclick={() => (quiz = nextPair(quiz))}>
						Pasangan seterusnya
					</button>
				{/if}
			</div>
		{/if}
	</section>
</div>

<style>
	.mover {
		transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
