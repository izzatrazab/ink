<script lang="ts">
	import LessonShell from '$lib/transformasi/LessonShell.svelte';
	import LatihanShell from '$lib/transformasi/LatihanShell.svelte';
	import FactorTiles from '$lib/factors-and-multiples/FactorTiles.svelte';
	import TileArray from '$lib/factors-and-multiples/TileArray.svelte';
	import { startLatihan } from '$lib/transformasi/latihan.svelte';
	import { pairs, latihanConfig, correctAnswer } from '$lib/factors-and-multiples/factorQuiz';
	import { leftover } from '$lib/factors-and-multiples/numbers';

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
	title="Factors, Prime Factors and Highest Common Factor (HCF)"
	description="Section 2.1: what factors are, found by arranging tiles into equal rows."
	next={{ href: '/factors-and-multiples/2-2', label: '2.2 Multiples and LCM →' }}
>
	<!-- Beat 1 — What are factors? (concept). Defined through the picture the
	     Explorable below lets you build: equal rows with nothing left over. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">What are factors?</h2>
		<p class="leading-relaxed">
			Can you split 12 tiles into equal rows with none left over? Rows of 3 work: 4 rows of 3. Rows
			of 5 don't: 2 rows of 5, and 2 tiles are stranded.
		</p>
		<p class="leading-relaxed">
			The numbers that work — the ones that divide 12 <strong>completely</strong> — are called the
			<strong>factors</strong> of 12. A factor is a whole number that divides another number with no remainder.
		</p>
	</section>

	<!-- Beat 2 — Explorable: arrange the tiles. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Arrange the tiles</h2>
		<p class="leading-relaxed">
			Choose how many tiles go in each row. Solid rows with nothing left over mean you've found a
			factor — and it always comes with a partner. Can you find every factor? Then try a different
			number of tiles.
		</p>
		<FactorTiles />
		<p class="text-sm leading-relaxed opacity-70">
			Tip: 1 is a factor of every number, because 1 tile per row always works.
		</p>
	</section>

	<!-- Beat 3 — Latihan: is it a factor? -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Practice: is it a factor?</h2>
		<p class="leading-relaxed">
			Decide whether the row size is a factor of the number of tiles, then check your answer.
		</p>

		<LatihanShell {latihan} lang="en" aspect="5/3" cardClass="max-w-md" viewBox="0 0 200 120">
			{#snippet reveal(playing)}
				<TileArray
					total={latihan.pair.total}
					perRow={playing ? latihan.pair.size : latihan.pair.total}
				/>
			{/snippet}

			{#snippet input(answered)}
				<p class="text-center text-lg">
					Is <strong>{latihan.pair.size}</strong> a factor of <strong>{latihan.pair.total}</strong>?
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<button class="btn btn-primary" disabled={answered} onclick={() => latihan.submit(true)}>
						Yes, it's a factor
					</button>
					<button class="btn btn-outline" disabled={answered} onclick={() => latihan.submit(false)}>
						No, it's not
					</button>
				</div>
			{/snippet}

			{#snippet feedback()}
				{#if isAFactor}
					{latihan.pair.total} tiles make {latihan.pair.total / latihan.pair.size} full rows of {latihan
						.pair.size}, with none left over — so {latihan.pair.size} is a factor of {latihan.pair
						.total}.
				{:else}
					In rows of {latihan.pair.size}, {rest}
					{rest === 1 ? 'tile is' : 'tiles are'} left over — so {latihan.pair.size} is not a factor of
					{latihan.pair.total}.
				{/if}
			{/snippet}
		</LatihanShell>
	</section>

	<p class="text-sm opacity-60">
		Coming next in this section: prime factors, common factors, the highest common factor (HCF), and
		problem solving.
	</p>
</LessonShell>
