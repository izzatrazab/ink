<script lang="ts">
	import FigureCard from '$lib/transformasi/FigureCard.svelte';
	import Stage from '$lib/transformasi/Stage.svelte';
	import TileArray from './TileArray.svelte';
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

	const all = $derived(factors(total));
	const size = $derived(perRow ?? total);
	const rest = $derived(perRow === null ? 0 : leftover(total, perRow));
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
			aria-label="Fewer tiles"
			disabled={total <= MIN}
			onclick={() => setTotal(total - 1)}>−</button
		>
		<span class="min-w-24 text-center text-lg font-semibold">{total} tiles</span>
		<button
			class="btn btn-circle btn-outline size-10! min-h-0"
			aria-label="More tiles"
			disabled={total >= MAX}
			onclick={() => setTotal(total + 1)}>+</button
		>
	</div>

	<div class="space-y-2 text-center">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">Tiles in each row</p>
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
			Tap a number: how many tiles in each row?
		{:else if rest === 0}
			<strong>{total / perRow}</strong>
			{total / perRow === 1 ? 'row' : 'rows'} of <strong>{perRow}</strong>, none left over. So
			<strong>{perRow}</strong> and <strong>{total / perRow}</strong> are factors!
		{:else}
			<strong class="text-warning">{rest}</strong> left over. {perRow} is not a factor.
		{/if}
	</p>

	<div class="space-y-2 text-center">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
			Factors of {total} found: {found.length} of {all.length}
		</p>
		<ul class="flex flex-wrap justify-center gap-2">
			{#each all as factor (factor)}
				<li class="badge badge-lg {found.includes(factor) ? 'badge-success' : 'badge-ghost'}">
					{found.includes(factor) ? factor : '?'}
				</li>
			{/each}
		</ul>
	</div>

	{#if done}
		<div class="alert alert-success" role="status">
			<span>
				All found! Factors of {total}: {all.join(', ')}.
				{#if isPrime(total)}
					Only one rectangle (1 × {total}) — that makes it a <strong>prime number</strong>.
				{/if}
			</span>
		</div>
	{/if}
</div>
