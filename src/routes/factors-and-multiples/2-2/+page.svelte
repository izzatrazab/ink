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
	<!-- Beat 1 — What are multiples? (concept) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">What are multiples?</h2>
		<p class="leading-relaxed">
			Count in 9s: 9, 18, 27, … Each number you land on is 9 times a whole number — 9 × 1, 9 × 2, 9
			× 3 — and they are called the <strong>multiples</strong> of 9.
		</p>
		<p class="leading-relaxed">
			Now count in 6s and in 8s at the same time. Some numbers get hit by both counts. A number that
			is a multiple of two (or more) numbers is a <strong>common multiple</strong> of them.
		</p>
	</section>

	<!-- Beat 2 — Explorable: the number chart. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Find the common multiples</h2>
		<p class="leading-relaxed">
			Pick two numbers and watch their multiples light up on the chart. The green numbers are common
			multiples. Where does the first green one appear — and what do you notice about the ones after
			it? Try other pairs.
		</p>
		<CommonMultiples />
	</section>

	<!-- Beat 3 — Latihan: is it a common multiple? -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Practice: is it a common multiple?</h2>
		<p class="leading-relaxed">
			A number is a common multiple only if <em>every</em> number on the list divides it completely.
		</p>

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
						Yes, it is
					</button>
					<button class="btn btn-outline" disabled={answered} onclick={() => latihan.submit(false)}>
						No, it isn't
					</button>
				</div>
			{/snippet}

			{#snippet feedback()}
				{#if isCommon}
					Counting up in each of {list}, you land exactly on {latihan.pair.n} — so {latihan.pair.n} is
					a common multiple.
				{:else}
					Counting up in {miss}s skips over {latihan.pair.n} ({latihan.pair.n} ÷ {miss} leaves a remainder)
					— so {latihan.pair.n} is not a common multiple of {list}.
				{/if}
			{/snippet}
		</LatihanShell>
	</section>

	<!-- Beat 4 — The lowest common multiple, found with the same division ladder
	     as in 2.1 but with one rule changed (textbook Example 11(b)). -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">The lowest common multiple (LCM)</h2>
		<p class="leading-relaxed">
			The common multiples of 6 and 8 are 24, 48, 72, … The smallest one, 24, is the
			<strong>lowest common multiple (LCM)</strong>.
		</p>
		<p class="leading-relaxed">
			You can find it with the ladder from Section 2.1, with <strong>one rule changed</strong>.
			Write the numbers side by side and divide by a prime that goes into
			<strong>at least one</strong>
			of them. The numbers it does <em>not</em> divide are simply brought down unchanged. Keep going until
			every number is 1, then multiply all the numbers on the left. Try the LCM of 3, 6 and 9.
		</p>
		<DivisionLadder mode="lcm" presets={[[3, 6, 9]]} />
		<p class="text-sm leading-relaxed opacity-70">
			Compare with the HCF ladder: for the HCF the prime must divide <em>every</em> number and we
			stop early; for the LCM it needs to divide only <em>one</em>, and we go all the way down to 1.
		</p>
	</section>

	<p class="text-sm opacity-60">
		Coming next in this section: more ways to find the LCM, and problem solving.
	</p>
</LessonShell>
