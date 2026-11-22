<script lang="ts">
	import { isCommon, rangeFor } from './multiplesHunt';
	import { isFactor } from './numbers';
	import { useCopy } from './useCopy';

	// The pattern behind a finished Multiples Hunt Board: 1 up to the Board's range,
	// ten to a row, with every multiple dark and (for two or three numbers) the
	// multiples of only some of them light. Multiples of 6 fall on a slanting line;
	// common multiples repeat at the same distance. Each cell says what it is in
	// words for a screen reader as well as in shade.
	let { set }: { set: number[] } = $props();

	const copy = useCopy();
	const t = $derived(copy.t.games.multiplesHunt.pattern);
	const numbers = $derived(Array.from({ length: rangeFor(set) }, (_, i) => i + 1));
	const stateOf = (n: number): 'all' | 'some' | 'none' =>
		isCommon(set, n) ? 'all' : set.length > 1 && set.some((s) => isFactor(n, s)) ? 'some' : 'none';
</script>

<div class="space-y-3">
	<h3 class="font-display font-bold">{t.heading}</h3>
	<ol class="mx-auto grid max-w-sm grid-cols-10 gap-1">
		{#each numbers as n (n)}
			{@const state = stateOf(n)}
			<li
				class="flex aspect-square items-center justify-center rounded text-xs font-semibold sm:text-sm {state ===
				'all'
					? 'bg-primary text-primary-content'
					: state === 'some'
						? 'bg-primary/15 ring-primary/40 ring-1'
						: 'bg-base-200 ink-muted'}"
				aria-label={t.cell(n, state)}
			>
				{n}
			</li>
		{/each}
	</ol>
	<p class="ink-muted text-center text-sm">
		{set.length === 1 ? t.legendOne(set[0]) : t.legendMany}
	</p>
</div>
