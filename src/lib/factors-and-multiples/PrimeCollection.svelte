<script lang="ts">
	import { TIERS, isKnown, tierPrimes, type Progress } from './primeHunt';
	import { useCopy } from './useCopy';

	// The prime collection: a 1–100 grid in which a prime lights up once the student
	// knows it (found cleanly on two Boards). Only known primes are marked, so the
	// grid never tells a student which numbers are prime: Prime Hunt stays a recall
	// test, and the collection is the reward for it. Each cell says "known" in words
	// for a screen reader as well as in colour.
	let { progress }: { progress: Progress } = $props();

	const copy = useCopy();
	const t = $derived(copy.t.games.primeHunt.collection);
	const max = TIERS[TIERS.length - 1];
	const numbers = Array.from({ length: max }, (_, i) => i + 1);
	const total = tierPrimes(max).length;
	const known = $derived(tierPrimes(max).filter((p) => isKnown(progress, p)).length);
</script>

<details class="ink-card p-5" open={known > 0}>
	<summary class="font-display cursor-pointer text-lg font-bold">
		{t.heading(known, total)}
	</summary>
	<div class="mt-4 space-y-3">
		<ol class="mx-auto grid max-w-sm grid-cols-10 gap-1">
			{#each numbers as n (n)}
				{@const lit = isKnown(progress, n)}
				<li
					class="flex aspect-square items-center justify-center rounded text-xs font-semibold sm:text-sm {lit
						? 'bg-success text-success-content ring-success/40 ring-2'
						: 'bg-base-200 ink-muted'}"
					aria-label={lit ? t.known(n) : `${n}`}
				>
					{n}
				</li>
			{/each}
		</ol>
		<p class="ink-muted text-center text-sm">{t.note}</p>
	</div>
</details>
