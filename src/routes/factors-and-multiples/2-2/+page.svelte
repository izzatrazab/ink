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

	// The Latihan: is it a common multiple? The verdict is derived from the pair
	// (commonMultipleQuiz.correctAnswer); the Reveal hops along a lane per number
	// and shows whether each one lands on the target.
	const latihan = startLatihan(latihanConfig, pairs);
	const isCommon = $derived(correctAnswer(latihan.pair));
	const miss = $derived(firstMiss(latihan.pair));
	const list = $derived(latihan.pair.of.join(', ').replace(/, (\d+)$/, ' and $1'));
</script>

<LessonShell
	chapter="factors-and-multiples"
	number="2.2"
	title="Multiples, Common Multiples and Lowest Common Multiple (LCM)"
	description="Section 2.2: multiples, common multiples and the lowest common multiple — explored with a number chart and a division ladder."
	prev={{ href: '/factors-and-multiples/2-1', label: '← 2.1 Factors and HCF' }}
>
	<!-- Beat 1 — Multiples and common multiples (concept + Explorable: number chart) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Common multiples</h2>
		<p class="leading-relaxed">
			Count in 9s: 9, 18, 27, … These are the <strong>multiples</strong> of 9. A number that is a
			multiple of two numbers is a <strong>common multiple</strong> of them.
		</p>
		<p class="leading-relaxed">Pick two numbers. Green means common. What pattern do you see?</p>
		<CommonMultiples />
	</section>

	<!-- Beat 2 — Latihan: is it a common multiple? -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Practice</h2>

		<LatihanShell {latihan} lang="en" aspect="5/3" cardClass="max-w-md" viewBox="0 0 200 120">
			{#snippet reveal(playing)}
				<MultipleLanes n={latihan.pair.n} of={latihan.pair.of} {playing} />
			{/snippet}

			{#snippet input(answered)}
				<p class="text-center text-lg">
					Is <strong>{latihan.pair.n}</strong> a common multiple of <strong>{list}</strong>?
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<button class="btn btn-primary" disabled={answered} onclick={() => latihan.submit(true)}>
						Yes
					</button>
					<button class="btn btn-outline" disabled={answered} onclick={() => latihan.submit(false)}>
						No
					</button>
				</div>
			{/snippet}

			{#snippet feedback()}
				{#if isCommon}
					Counting in each one lands on {latihan.pair.n}.
				{:else}
					Counting in {miss}s skips over {latihan.pair.n}.
				{/if}
			{/snippet}
		</LatihanShell>
	</section>

	<!-- Beat 3 — The LCM with the same division ladder, one rule changed (Example 11(b)) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Lowest common multiple (LCM)</h2>
		<p class="leading-relaxed">
			The smallest common multiple of 6 and 8 is 24 — the
			<strong>lowest common multiple (LCM)</strong>.
		</p>
		<p class="leading-relaxed">
			Use the ladder again, with one change: the prime needs to go into
			<strong>at least one</strong> number. The others come down unchanged. Stop at all 1s, then multiply
			the left column.
		</p>
		<DivisionLadder mode="lcm" presets={[[3, 6, 9]]} />
	</section>
</LessonShell>
