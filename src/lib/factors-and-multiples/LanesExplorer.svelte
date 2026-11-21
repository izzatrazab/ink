<script lang="ts">
	import FigureCard from '$lib/transformasi/FigureCard.svelte';
	import Stage from '$lib/transformasi/Stage.svelte';
	import FactorPairs from './FactorPairs.svelte';
	import LaneInputs from './LaneInputs.svelte';
	import MultipleLanes from './MultipleLanes.svelte';
	import Rich from './Rich.svelte';
	import { hcf, lcm } from './numbers';
	import { MAX_LANES, lcmDrawable, rowIssue, rowValues, stageHeight } from './lanes';
	import { useCopy } from './useCopy';

	// An Explorable built on two pictures. The student picks a set of numbers and
	// watches it: the HCF as every number's factor pairs with the shared factors lit
	// (<FactorPairs>), the LCM as jumps that finally land together
	// (<MultipleLanes>). `show` chooses one or both; with both, the same numbers sit
	// side by side so the contrast (looking down vs waiting) is visible.
	//
	// "Your own" starts with a single empty row whose number is a box at its head;
	// typing draws it at once, and "Add lane" below adds the next. With both figures
	// shown, the HCF one carries the boxes and the LCM one labels its lanes.
	// State is the chosen preset, the typed boxes and a replay counter; everything
	// drawn is derived from them.
	interface Props {
		presets: number[][];
		show: 'hcf' | 'lcm' | 'both';
		/** Adds a "Your own" chip where the student builds their own lanes. */
		custom?: boolean;
	}

	let { presets, show, custom = false }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t);

	let presetIndex = $state(0);
	let run = $state(0);
	let playing = $state(false);
	let inputs = $state(['']);

	const isCustom = $derived(custom && presetIndex === presets.length);
	// One entry per lane. In "Your own", a lane with no usable number stays null so the
	// other lanes keep their rows while the student is still typing.
	const rows = $derived<(number | null)[]>(isCustom ? rowValues(inputs) : presets[presetIndex]);
	const numbers = $derived(rows.filter((v): v is number => v !== null));
	const enough = $derived(numbers.length >= 2);
	const list = $derived(t.s22.and(numbers));
	// What can be drawn: a single typed lane already draws; a set too big for the stage
	// falls back to bare lanes plus a message.
	const drawLcm = $derived(numbers.length > 0 && lcmDrawable(numbers));
	const bare = $derived(rows.map(() => null));
	const height = $derived(stageHeight(rows.length));
	const showLcm = $derived(enough && drawLcm);
	const anyInvalid = $derived(
		isCustom && inputs.some((_, i) => rowIssue(inputs, rows, i) === 'invalid')
	);

	// Each (re)play starts from a blank stage so the dots and pieces animate in.
	$effect(() => {
		void run;
		void presetIndex;
		void numbers.join();
		playing = false;
		const id = setTimeout(() => (playing = true), 80);
		return () => clearTimeout(id);
	});

	function remove(i: number) {
		inputs.splice(i, 1);
	}
</script>

{#snippet editing()}
	<LaneInputs bind:inputs values={rows} onremove={remove} />
{/snippet}

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-center gap-2">
		<span class="text-sm font-semibold tracking-wide uppercase ink-muted">{t.ladder.number}</span>
		{#each presets as preset, i (i)}
			<button
				class="btn btn-sm {i === presetIndex ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={i === presetIndex}
				onclick={() => (presetIndex = i)}>{preset.join(', ')}</button
			>
		{/each}
		{#if custom}
			<button
				class="btn btn-sm {isCustom ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={isCustom}
				onclick={() => (presetIndex = presets.length)}>{t.ladder.own}</button
			>
		{/if}
	</div>

	<div class="grid gap-4 {show === 'both' ? 'md:grid-cols-2' : ''}">
		{#if show !== 'lcm'}
			<div class="space-y-2">
				{#if show === 'both'}
					<h3 class="text-primary text-center font-bold">{t.lanes.hcfTitle}</h3>
				{/if}
				{#if isCustom}
					<FactorPairs of={rows} {playing} bind:inputs onremove={remove} />
				{:else}
					<FactorPairs of={rows} {playing} />
				{/if}
				<p class="text-center leading-relaxed" aria-live="polite">
					{#if enough}
						<Rich text={t.lanes.commonCaption(list, hcf(numbers))} />
					{:else if isCustom}
						<span class="opacity-70">{t.lanes.addSecond}</span>
					{/if}
				</p>
			</div>
		{/if}
		{#if show !== 'hcf'}
			<div class="space-y-2">
				{#if show === 'both'}
					<h3 class="text-secondary text-center font-bold">{t.lanes.lcmTitle}</h3>
				{/if}
				<FigureCard aspect="200/{height}" class="max-w-md">
					<Stage
						viewBox="0 0 200 {height}"
						class="h-full w-full"
						interactive={isCustom && show === 'lcm'}
					>
						<MultipleLanes
							n={drawLcm ? lcm(numbers) : 0}
							of={drawLcm ? rows : bare}
							{playing}
							labels={!(isCustom && show === 'lcm')}
						/>
						{#if isCustom && show === 'lcm'}{@render editing()}{/if}
					</Stage>
				</FigureCard>
				<p class="text-center leading-relaxed" aria-live="polite">
					{#if showLcm}
						<Rich text={t.lanes.lcmCaption(list, lcm(numbers))} />
					{:else if enough}
						<span class="opacity-70">{t.lanes.tooLong(lcm(numbers))}</span>
					{:else if isCustom}
						<span class="opacity-70">{t.lanes.addSecond}</span>
					{/if}
				</p>
			</div>
		{/if}
	</div>

	{#if isCustom}
		{#if anyInvalid}
			<p class="text-error text-center text-sm" role="alert">{t.lanes.ownInvalid}</p>
		{/if}
		<div class="text-center">
			<button
				class="btn btn-sm btn-outline"
				disabled={inputs.length >= MAX_LANES}
				onclick={() => inputs.push('')}>+ {t.lanes.addLane}</button
			>
		</div>
	{/if}

	<div class="text-center">
		<button class="btn btn-sm btn-outline" onclick={() => run++}>{t.lanes.replay}</button>
	</div>
</div>
