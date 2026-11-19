<script lang="ts">
	import LessonShell from '$lib/transformasi/LessonShell.svelte';
	import LatihanShell from '$lib/transformasi/LatihanShell.svelte';
	import DivisionLadder from '$lib/factors-and-multiples/DivisionLadder.svelte';
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
	description="Section 2.1: factors, prime factors and the highest common factor — explored with tiles and a step-by-step division ladder."
	next={{ href: '/factors-and-multiples/2-2', label: '2.2 Multiples and LCM →' }}
>
	<!-- Beat 1 — What are factors? (concept + Explorable: arrange the tiles) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">What are factors?</h2>
		<p class="leading-relaxed">
			A <strong>factor</strong> of a number divides it completely, with nothing left over. Can you split
			the tiles into equal rows?
		</p>
		<FactorTiles />
		<p class="text-sm opacity-70">1 is a factor of every number.</p>
	</section>

	<!-- Beat 2 — Latihan: is it a factor? -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Practice</h2>

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
						Yes
					</button>
					<button class="btn btn-outline" disabled={answered} onclick={() => latihan.submit(false)}>
						No
					</button>
				</div>
			{/snippet}

			{#snippet feedback()}
				{#if isAFactor}
					{latihan.pair.total} = {latihan.pair.size} × {latihan.pair.total / latihan.pair.size}.
					Nothing left over.
				{:else}
					{rest}
					{rest === 1 ? 'tile is' : 'tiles are'} left over.
				{/if}
			{/snippet}
		</LatihanShell>
	</section>

	<!-- Beat 3 — Prime factors, then the repeated-division ladder -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Prime factors</h2>
		<p class="leading-relaxed">
			A factor that is a prime number is a <strong>prime factor</strong>. The factors of 18 are 1,
			<strong>2</strong>, <strong>3</strong>, 6, 9, 18 — so 18 = 2 × 3 × 3. This is called
			<strong>prime factorisation</strong>.
		</p>
		<p class="leading-relaxed">
			Find it by <strong>repeated division</strong>: keep dividing by primes until you reach
			<strong>1</strong>. The primes on the left are the prime factors.
		</p>
		<DivisionLadder presets={[[60], [72], [84], [90], [126]]} />
	</section>

	<!-- Beat 4 — The same ladder with several numbers: the HCF (Example 8(b)) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Highest common factor (HCF)</h2>
		<p class="leading-relaxed">
			A number that divides them all is a <strong>common factor</strong>. The biggest is the
			<strong>highest common factor (HCF)</strong>. Find it with the ladder — the prime must go into
			<strong>every</strong> number. Multiply the left column.
		</p>
		<DivisionLadder mode="hcf" presets={[[36, 60, 72]]} />
	</section>
</LessonShell>
