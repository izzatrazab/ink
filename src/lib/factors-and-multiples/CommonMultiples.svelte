<script lang="ts">
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import { commonMultiples, isFactor } from './numbers';

	// The Explorable for "What are common multiples?": a number chart from 1 to 72.
	// Pick two numbers; the multiples of each light up in their own colour, and the
	// numbers that are multiples of both light up in a third — you can see the
	// common multiples appear, and how they repeat at regular steps.
	const MIN = 2;
	const MAX = 9;
	const LIMIT = 72; // lcm of any two numbers in 2…9 is at most 72, so one always shows

	let a = $state(6);
	let b = $state(8);

	const copy = useCopy();
	const t = $derived(copy.t.chart);
	const common = $derived(commonMultiples([a, b], LIMIT));
	const first = $derived(common[0]);
	const rest = $derived(common.slice(1));
	const cells = Array.from({ length: LIMIT }, (_, i) => i + 1);

	function kind(n: number): 'both' | 'a' | 'b' | 'none' {
		const ofA = isFactor(n, a);
		const ofB = isFactor(n, b);
		return ofA && ofB ? 'both' : ofA ? 'a' : ofB ? 'b' : 'none';
	}

	const styles = {
		both: 'bg-success text-success-content font-bold',
		a: 'bg-primary text-primary-content font-semibold',
		b: 'bg-secondary text-secondary-content font-semibold',
		none: 'opacity-60'
	} as const;
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-center gap-6">
		{#each [{ id: 'a', value: a, swatch: 'bg-primary', set: (v: number) => (a = v) }, { id: 'b', value: b, swatch: 'bg-secondary', set: (v: number) => (b = v) }] as picker (picker.id)}
			<div class="flex items-center gap-3">
				<span class="size-4 rounded {picker.swatch}" aria-hidden="true"></span>
				<button
					class="btn btn-circle btn-outline size-10! min-h-0"
					aria-label={t.smaller}
					disabled={picker.value <= MIN}
					onclick={() => picker.set(picker.value - 1)}>−</button
				>
				<span class="min-w-20 text-center text-lg font-semibold">
					{t.multiplesOf(picker.value)}
				</span>
				<button
					class="btn btn-circle btn-outline size-10! min-h-0"
					aria-label={t.bigger}
					disabled={picker.value >= MAX}
					onclick={() => picker.set(picker.value + 1)}>+</button
				>
			</div>
		{/each}
	</div>

	<ol
		class="border-base-300 bg-base-200 mx-auto grid max-w-md grid-cols-12 gap-1 rounded-2xl border p-3"
		aria-label={t.numbersFrom(LIMIT)}
	>
		{#each cells as n (n)}
			{@const k = kind(n)}
			<li
				class="flex aspect-square items-center justify-center rounded text-xs transition-colors sm:text-sm {styles[
					k
				]}"
				aria-label="{n}, {t.cell[k]}"
			>
				{n}
			</li>
		{/each}
	</ol>

	<div class="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
		<span class="flex items-center gap-2"
			><span class="bg-primary size-3 rounded"></span>{t.multiplesOf(a)}</span
		>
		<span class="flex items-center gap-2"
			><span class="bg-secondary size-3 rounded"></span>{t.multiplesOf(b)}</span
		>
		<span class="flex items-center gap-2"
			><span class="bg-success size-3 rounded"></span>{t.both}</span
		>
	</div>

	<p class="min-h-8 text-center leading-relaxed" aria-live="polite">
		{#if a === b}
			{t.same}
		{:else if rest.length > 0}
			<Rich text={t.many(common, first)} />
		{:else}
			<Rich text={t.one(first)} />
		{/if}
	</p>
</div>
