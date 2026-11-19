<script lang="ts">
	import LessonShell from '$lib/transformasi/LessonShell.svelte';
	import LatihanShell from '$lib/transformasi/LatihanShell.svelte';
	import DivisionLadder from '$lib/factors-and-multiples/DivisionLadder.svelte';
	import CommonMultiples from '$lib/factors-and-multiples/CommonMultiples.svelte';
	import MultipleLanes from '$lib/factors-and-multiples/MultipleLanes.svelte';
	import { startLatihan } from '$lib/transformasi/latihan.svelte';
	import {
		pairs,
		latihanConfig,
		correctAnswer,
		firstMiss
	} from '$lib/factors-and-multiples/commonMultipleQuiz';
	import Rich from '$lib/factors-and-multiples/Rich.svelte';
	import { copy } from '$lib/factors-and-multiples/copy';
	import { getChapter } from '$lib/chapters';
	import { reader } from '$lib/language.svelte';

	const lang = $derived(reader.for(getChapter('factors-and-multiples')));
	const t = $derived(copy[lang]);

	// The Latihan: is it a common multiple? The verdict is derived from the pair
	// (commonMultipleQuiz.correctAnswer); the Reveal hops along a lane per number
	// and shows whether each one lands on the target.
	const latihan = startLatihan(latihanConfig, pairs);
	const isCommon = $derived(correctAnswer(latihan.pair));
	const miss = $derived(firstMiss(latihan.pair));
	const list = $derived(t.s22.and(latihan.pair.of));
</script>

<LessonShell
	chapter="factors-and-multiples"
	number="2.2"
	title={t.s22.title}
	description={t.meta.desc22}
	prev={{ href: '/factors-and-multiples/2-1', label: t.nav.prev22 }}
>
	<!-- Beat 1 — Multiples and common multiples (concept + Explorable: number chart) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s22.multiplesHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s22.multiplesIntro} /></p>
		<p class="leading-relaxed">{t.s22.multiplesPrompt}</p>
		<CommonMultiples />
	</section>

	<!-- Beat 2 — Latihan: is it a common multiple? -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.practice}</h2>

		<LatihanShell
			{latihan}
			{lang}
			wording={t.quiz}
			aspect="5/3"
			cardClass="max-w-md"
			viewBox="0 0 200 120"
		>
			{#snippet reveal(playing)}
				<MultipleLanes n={latihan.pair.n} of={latihan.pair.of} {playing} />
			{/snippet}

			{#snippet input(answered)}
				<p class="text-center text-lg">
					<Rich text={t.s22.isCommonQ(latihan.pair.n, list)} />
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
				{#if isCommon}
					{t.s22.commonYes(latihan.pair.n)}
				{:else}
					{t.s22.commonNo(miss ?? 0, latihan.pair.n)}
				{/if}
			{/snippet}
		</LatihanShell>
	</section>

	<!-- Beat 3 — The LCM with the same division ladder, one rule changed (Example 11(b)) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s22.lcmHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s22.lcmIntro} /></p>
		<p class="leading-relaxed"><Rich text={t.s22.lcmMethod} /></p>
		<DivisionLadder mode="lcm" presets={[[3, 6, 9]]} />
	</section>
</LessonShell>
