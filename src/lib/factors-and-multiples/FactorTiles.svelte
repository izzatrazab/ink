<script lang="ts">
	import FigureCard from '$lib/transformasi/FigureCard.svelte';
	import Stage from '$lib/transformasi/Stage.svelte';
	import TileArray from './TileArray.svelte';
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import FactorPair from './FactorPair.svelte';
	import { discover, factors, isPrime, leftover } from './numbers';

	// The Explorable for "What are factors?": put N tiles into rows of k. When the
	// rows come out complete, k divides N completely — k is a factor, and so is the
	// number of rows. Every discovered factor pair is remembered; the "?" chips show
	// how many factors are still hidden, without giving them away.
	const MIN = 2;
	const MAX = 24;

	let total = $state(12);
	/** Tiles per row the student last tried, or null before the first tap. */
	let perRow = $state<number | null>(null);
	let found = $state<number[]>([]);

	const copy = useCopy();
	const t = $derived(copy.t.tiles);
	const all = $derived(factors(total));
	const size = $derived(perRow ?? total);
	const rest = $derived(perRow === null ? 0 : leftover(total, perRow));
	// Each factor pair a × b with a ≤ b (a perfect square's 4 × 4 is one row). A pair
	// is found once the student has made complete rows of either of its numbers.
	const pairs = $derived(
		all.filter((a) => a * a <= total).map((a): [number, number] => [a, total / a])
	);
	const foundPairs = $derived(pairs.filter(([a]) => found.includes(a)));
	const done = $derived(found.length === all.length);

	function pick(k: number) {
		perRow = k;
		found = discover(found, total, k);
	}

	function setTotal(next: number) {
		total = Math.min(MAX, Math.max(MIN, next));
		perRow = null;
		found = [];
	}
</script>

<div class="space-y-4">
	<FigureCard aspect="5/3" class="max-w-md">
		<Stage viewBox="0 0 200 120" class="h-full w-full">
			<TileArray {total} perRow={size} />
		</Stage>
	</FigureCard>

	<div class="flex items-center justify-center gap-3">
		<button
			class="btn btn-circle btn-outline size-10! min-h-0"
			aria-label={t.fewer}
			disabled={total <= MIN}
			onclick={() => setTotal(total - 1)}>−</button
		>
		<span class="min-w-24 text-center text-lg font-semibold">{t.count(total)}</span>
		<button
			class="btn btn-circle btn-outline size-10! min-h-0"
			aria-label={t.more}
			disabled={total >= MAX}
			onclick={() => setTotal(total + 1)}>+</button
		>
	</div>

	<div class="space-y-2 text-center">
		<p class="text-sm font-semibold tracking-wide uppercase ink-muted">{t.inEachRow}</p>
		<div class="flex flex-wrap justify-center gap-2">
			{#each { length: total }, i (i)}
				{@const k = i + 1}
				<button
					class="btn btn-square size-10! min-h-0 {perRow === k
						? 'btn-primary'
						: found.includes(k)
							? 'btn-soft btn-success'
							: 'btn-outline'}"
					aria-pressed={perRow === k}
					onclick={() => pick(k)}>{k}</button
				>
			{/each}
		</div>
	</div>

	<p class="min-h-8 text-center leading-relaxed" aria-live="polite">
		{#if perRow === null}
			{t.tap}
		{:else if rest === 0}
			<Rich text={t.complete(total, perRow, total / perRow)} />
		{:else}
			<Rich text={t.leftOver(rest, perRow)} />
		{/if}
	</p>

	<div class="space-y-2 text-center">
		<p class="text-sm font-semibold tracking-wide uppercase ink-muted">
			{t.found(total, foundPairs.length, pairs.length)}
		</p>
		<ul class="mx-auto grid max-w-xs gap-2">
			{#each pairs as [a, b] (a)}
				{@const known = found.includes(a)}
				<li>
					<FactorPair
						a={known ? a : '?'}
						b={known ? b : '?'}
						markA={known ? 'on' : 'dim'}
						markB={known ? 'on' : 'dim'}
					/>
				</li>
			{/each}
		</ul>
	</div>

	{#if done}
		<div class="alert alert-success" role="status">
			<span>
				{t.allFound(total, all)}
				{#if isPrime(total)}
					<Rich text={t.primeNote(total)} />
				{/if}
			</span>
		</div>
	{/if}
</div>
