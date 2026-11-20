<script lang="ts">
	import LessonShell from '$lib/transformasi/LessonShell.svelte';
	import LatihanShell from '$lib/transformasi/LatihanShell.svelte';
	import HcfLanes from '$lib/factors-and-multiples/HcfLanes.svelte';
	import MultipleLanes from '$lib/factors-and-multiples/MultipleLanes.svelte';
	import LanesExplorer from '$lib/factors-and-multiples/LanesExplorer.svelte';
	import CompareLadders from '$lib/factors-and-multiples/CompareLadders.svelte';
	import { startLatihan } from '$lib/transformasi/latihan.svelte';
	import { pairs, latihanConfig, result } from '$lib/factors-and-multiples/hcfLcmQuiz';
	import Rich from '$lib/factors-and-multiples/Rich.svelte';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const copy = useCopy();
	const t = $derived(copy.t);

	// The Latihan: HCF or LCM? The verdict is the pair's authored kind and the number
	// is derived (hcfLcmQuiz.result). Once answered, the ladders open on the problem's
	// own numbers so the student can see the answer come out of the method.
	const latihan = startLatihan(latihanConfig, pairs);
	const answerKind = $derived(latihan.pair.kind);
	const answer = $derived(result(latihan.pair));
	const list = $derived(t.s22.and(latihan.pair.numbers));
</script>

<LessonShell
	chapter="factors-and-multiples"
	number="2.3"
	description={t.meta.desc23}
	prev={{ href: '/factors-and-multiples/2-2', label: t.nav.prev23 }}
>
	<!-- Beat 1 — Same numbers, two questions -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.introHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s23.intro} /></p>
	</section>

	<!-- Beat 2 — The differences at a glance -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.tableHeading}</h2>
		<div class="overflow-x-auto">
			<table class="table-zebra table min-w-lg">
				<thead>
					<tr>
						<th scope="col"><span class="sr-only">{t.s23.tableHeading}</span></th>
						<th scope="col" class="text-primary text-base">{t.ladder.hcf}</th>
						<th scope="col" class="text-secondary text-base">{t.ladder.lcm}</th>
					</tr>
				</thead>
				<tbody>
					{#each t.s23.rows as row (row.aspect)}
						<tr>
							<th scope="row" class="font-semibold">{row.aspect}</th>
							<td><Rich text={row.hcf} /></td>
							<td><Rich text={row.lcm} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Beat 3 — The same numbers on lanes: HCF cuts, LCM waits (Explorable) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.lanesHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s23.lanesIntro} /></p>
		<LanesExplorer
			show="both"
			custom
			presets={[
				[12, 18],
				[24, 36],
				[8, 12],
				[15, 20]
			]}
		/>
	</section>

	<!-- Beat 4 — The two ladders side by side (Explorable) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.ladderHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s23.ladderIntro} /></p>
		<CompareLadders
			custom
			presets={[
				[12, 18],
				[36, 60, 72],
				[8, 9]
			]}
		/>
	</section>

	<!-- Beat 5 — Which one do I need? -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.cluesHeading}</h2>
		<p class="leading-relaxed">{t.s23.cluesIntro}</p>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="border-primary/50 space-y-2 rounded-2xl border-2 p-4">
				<h3 class="text-primary font-bold">{t.s23.hcfClue.title}</h3>
				<p>{t.s23.hcfClue.problem}</p>
				<p class="font-semibold"><Rich text={t.s23.hcfClue.answer} /></p>
			</div>
			<div class="border-secondary/50 space-y-2 rounded-2xl border-2 p-4">
				<h3 class="text-secondary font-bold">{t.s23.lcmClue.title}</h3>
				<p>{t.s23.lcmClue.problem}</p>
				<p class="font-semibold"><Rich text={t.s23.lcmClue.answer} /></p>
			</div>
		</div>
	</section>

	<!-- Beat 6 — Latihan: HCF or LCM? -->
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
				<!-- Until answered, only the numbers show: the lane type would give the kind away. -->
				{#if !playing}
					<text x="100" y="65" text-anchor="middle" class="fill-current text-2xl font-bold">
						{latihan.pair.numbers.join(' · ')}
					</text>
				{/if}
				<g opacity={playing ? 1 : 0}>
					{#if answerKind === 'hcf'}
						<HcfLanes of={latihan.pair.numbers} {playing} />
					{:else}
						<MultipleLanes n={answer} of={latihan.pair.numbers} {playing} />
					{/if}
				</g>
			{/snippet}

			{#snippet input(answered)}
				<p class="text-center leading-relaxed">{t.s23.quiz.problems[latihan.pair.key]}</p>
				<p class="text-center font-semibold">{t.s23.quiz.question}</p>
				<div class="flex flex-wrap justify-center gap-3">
					<button class="btn btn-primary" disabled={answered} onclick={() => latihan.submit('hcf')}
						>{t.ladder.hcf}</button
					>
					<button
						class="btn btn-secondary"
						disabled={answered}
						onclick={() => latihan.submit('lcm')}>{t.ladder.lcm}</button
					>
				</div>
			{/snippet}

			{#snippet feedback()}
				{t.s23.quiz.feedback(answerKind, list, answer)}
			{/snippet}
		</LatihanShell>

		{#if latihan.answered}
			{#key latihan.index}
				<p class="text-center text-sm opacity-70">{t.s23.quiz.tryLadder}</p>
				<CompareLadders presets={[latihan.pair.numbers]} />
			{/key}
		{/if}
	</section>
</LessonShell>
