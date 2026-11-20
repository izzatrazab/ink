<script lang="ts">
	import FigureCard from '$lib/transformasi/FigureCard.svelte';
	import Stage from '$lib/transformasi/Stage.svelte';
	import HcfLanes from './HcfLanes.svelte';
	import MultipleLanes from './MultipleLanes.svelte';
	import Rich from './Rich.svelte';
	import { hcf, lcm } from './numbers';
	import { useCopy } from './useCopy';

	// An Explorable built on the two lane Reveals. The student picks a set of numbers
	// and watches it: the LCM as jumps that finally land together (<MultipleLanes>),
	// the HCF as every length cut into equal pieces (<HcfLanes>). `show` chooses
	// one or both; with both, the same numbers sit side by side so the contrast
	// (splitting vs waiting) is visible. Only the chosen preset and a replay counter
	// are state; everything drawn is derived from the numbers.
	interface Props {
		presets: number[][];
		show: 'hcf' | 'lcm' | 'both';
	}

	let { presets, show }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t);

	let presetIndex = $state(0);
	let run = $state(0);
	let playing = $state(false);

	const numbers = $derived(presets[presetIndex]);
	const list = $derived(t.s22.and(numbers));

	// Each (re)play starts from a blank stage so the dots and pieces animate in.
	$effect(() => {
		void run;
		void presetIndex;
		playing = false;
		const id = setTimeout(() => (playing = true), 80);
		return () => clearTimeout(id);
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-center gap-2">
		<span class="text-sm font-semibold tracking-wide uppercase opacity-60">{t.ladder.number}</span>
		{#each presets as preset, i (i)}
			<button
				class="btn btn-sm {i === presetIndex ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={i === presetIndex}
				onclick={() => (presetIndex = i)}>{preset.join(', ')}</button
			>
		{/each}
	</div>

	<div class="grid gap-4 {show === 'both' ? 'md:grid-cols-2' : ''}">
		{#if show !== 'lcm'}
			<div class="space-y-2">
				{#if show === 'both'}
					<h3 class="text-primary text-center font-bold">{t.lanes.hcfTitle}</h3>
				{/if}
				<FigureCard aspect="5/3" class="max-w-md">
					<Stage viewBox="0 0 200 120" class="h-full w-full">
						<HcfLanes of={numbers} {playing} />
					</Stage>
				</FigureCard>
				<p class="text-center leading-relaxed" aria-live="polite">
					<Rich text={t.lanes.hcfCaption(list, hcf(numbers))} />
				</p>
			</div>
		{/if}
		{#if show !== 'hcf'}
			<div class="space-y-2">
				{#if show === 'both'}
					<h3 class="text-secondary text-center font-bold">{t.lanes.lcmTitle}</h3>
				{/if}
				<FigureCard aspect="5/3" class="max-w-md">
					<Stage viewBox="0 0 200 120" class="h-full w-full">
						<MultipleLanes n={lcm(numbers)} of={numbers} {playing} />
					</Stage>
				</FigureCard>
				<p class="text-center leading-relaxed" aria-live="polite">
					<Rich text={t.lanes.lcmCaption(list, lcm(numbers))} />
				</p>
			</div>
		{/if}
	</div>

	<div class="text-center">
		<button class="btn btn-sm btn-outline" onclick={() => run++}>{t.lanes.replay}</button>
	</div>
</div>
