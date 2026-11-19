<script lang="ts">
	import LessonShell from '$lib/transformasi/LessonShell.svelte';
	import LatihanShell from '$lib/transformasi/LatihanShell.svelte';
	import DivisionLadder from '$lib/factors-and-multiples/DivisionLadder.svelte';
	import FactorTiles from '$lib/factors-and-multiples/FactorTiles.svelte';
	import TileArray from '$lib/factors-and-multiples/TileArray.svelte';
	import { startLatihan } from '$lib/transformasi/latihan.svelte';
	import { pairs, latihanConfig, correctAnswer } from '$lib/factors-and-multiples/factorQuiz';
	import { leftover } from '$lib/factors-and-multiples/numbers';
	import Rich from '$lib/factors-and-multiples/Rich.svelte';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const c = useCopy();
	const t = $derived(c.t);

	// The Latihan: is this row size a factor? The verdict is derived from the pair
	// (factorQuiz.correctAnswer); the Reveal arranges the tiles into rows of that
	// size, so the answer is something you see, not just read.
	const latihan = startLatihan(latihanConfig, pairs);
	const isAFactor = $derived(correctAnswer(latihan.pair));
	const rest = $derived(leftover(latihan.pair.total, latihan.pair.size));
</script>

<LessonShell
	chapter="factors-and-multiples"
	number="2.1"
	description={t.meta.desc21}
	next={{ href: '/factors-and-multiples/2-2', label: t.nav.next22 }}
>
	<!-- Beat 1 — What are factors? (concept + Explorable: arrange the tiles) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s21.factorsHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s21.factorsIntro} /></p>
		<FactorTiles />
		<p class="text-sm opacity-70">{t.s21.oneIsFactor}</p>
	</section>

	<!-- Beat 2 — Latihan: is it a factor? -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.practice}</h2>

		<LatihanShell
			{latihan}
			wording={t.quiz}
			aspect="5/3"
			cardClass="max-w-md"
			viewBox="0 0 200 120"
		>
			{#snippet reveal(playing)}
				<TileArray
					total={latihan.pair.total}
					perRow={playing ? latihan.pair.size : latihan.pair.total}
				/>
			{/snippet}

			{#snippet input(answered)}
				<p class="text-center text-lg">
					<Rich text={t.s21.isFactorQ(latihan.pair.size, latihan.pair.total)} />
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<button class="btn btn-primary" disabled={answered} onclick={() => latihan.submit(true)}>
						{t.yes}
					</button>
					<button class="btn btn-outline" disabled={answered} onclick={() => latihan.submit(false)}>
						{t.no}
					</button>
				</div>
			{/snippet}

			{#snippet feedback()}
				{#if isAFactor}
					{t.s21.factorYes(
						latihan.pair.total,
						latihan.pair.size,
						latihan.pair.total / latihan.pair.size
					)}
				{:else}
					{t.s21.leftOver(rest)}
				{/if}
			{/snippet}
		</LatihanShell>
	</section>

	<!-- Beat 3 — Prime factors, then the repeated-division ladder -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s21.primeHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s21.primeIntro} /></p>
		<p class="leading-relaxed"><Rich text={t.s21.primeMethod} /></p>
		<DivisionLadder presets={[[60], [72], [84], [90], [126]]} />
	</section>

	<!-- Beat 4 — The same ladder with several numbers: the HCF (Example 8(b)) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s21.hcfHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s21.hcfIntro} /></p>
		<DivisionLadder mode="hcf" presets={[[36, 60, 72]]} />
	</section>
</LessonShell>
