<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import StartingNumbers from './StartingNumbers.svelte';
	import { startPicker } from './picker.svelte';
	import { startStepper } from './stepper.svelte';
	import { autoDivisors, product, reachedOnes, rowsOf, wasBroughtDown } from './ladder';
	import { hcf as hcfOf, lcm as lcmOf } from './numbers';

	// The HCF ladder and the LCM ladder for the SAME numbers, side by side. One
	// "Step" advances both by one rung (each takes the smallest prime its own rule
	// allows), so the student sees exactly where they part: the LCM ladder brings
	// numbers down unchanged, the HCF ladder refuses any prime that misses one.
	// The only state is how many steps have been taken; every row is derived.
	interface Props {
		presets: number[][];
		custom?: boolean;
	}

	let { presets, custom = false }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t);

	let steps = $state(0);
	const picker = startPicker(
		() => ({ presets, custom, count: 'several' }),
		() => reset()
	);
	const ready = $derived(picker.ready);
	const start = $derived(picker.start);

	const plan = $derived({
		hcf: autoDivisors(start, 'hcf'),
		lcm: autoDivisors(start, 'lcm')
	});
	const total = $derived(Math.max(plan.hcf.length, plan.lcm.length));
	const finished = $derived(steps >= total);

	const sides = $derived(
		(['hcf', 'lcm'] as const).map((mode) => {
			const divisors = plan[mode].slice(0, steps);
			return {
				mode,
				divisors,
				rows: rowsOf(start, divisors, mode),
				done: steps >= plan[mode].length
			};
		})
	);

	const label = (row: number[]) => row.join(', ');

	function reset() {
		stepper.stop();
		steps = 0;
	}

	function step() {
		if (!finished) steps += 1;
	}

	const stepper = startStepper(() => {
		step();
		return !finished;
	});
	onDestroy(stepper.stop);

	function play() {
		reset();
		stepper.play();
	}
</script>

<div class="space-y-4">
	<StartingNumbers {picker} {presets} {custom} t={t.ladder} single={false} />

	{#if ready}
		<div class="grid gap-4 md:grid-cols-2" aria-label={t.compare.aria(label(start))}>
			{#each sides as side (side.mode)}
				{@const isHcf = side.mode === 'hcf'}
				<div
					class="rounded-3xl border p-5 {isHcf
						? 'bg-primary/5 border-primary/20'
						: 'bg-secondary/5 border-secondary/20'}"
				>
					<h3 class="text-lg font-bold {isHcf ? 'text-primary' : 'text-secondary'}">
						{isHcf ? t.ladder.hcf : t.ladder.lcm}
					</h3>
					<p class="mb-3 opacity-80">
						<Rich text={isHcf ? t.compare.hcfRule : t.compare.lcmRule} />
					</p>

					<div class="bg-base-200 rounded-xl p-3 font-mono text-lg">
						{#each side.rows as row, i (i)}
							<div class="flex min-h-10 items-center" in:fly={{ y: -12, duration: 300 }}>
								<span
									class="w-10 pr-2 text-right font-bold {isHcf ? 'text-primary' : 'text-secondary'}"
								>
									{side.divisors[i] ?? ''}
								</span>
								<span
									class="border-base-content/60 flex flex-1 flex-wrap gap-x-2 border-l-2 py-1 pl-3"
								>
									{#each row as n, j (j)}
										{#if wasBroughtDown(side.mode, side.rows, i, j)}
											<span class="bg-warning/30 rounded px-1" title={t.compare.broughtDown}
												>{n}</span
											>
										{:else}
											<span class="px-1">{n}</span>
										{/if}
									{/each}
								</span>
							</div>
							{#if i < side.rows.length - 1 || !side.done}
								<div class="flex h-0">
									<span class="w-10"></span>
									<span class="border-base-content/60 flex-1 border-t-2 border-l-2"></span>
								</div>
							{/if}
						{/each}
					</div>

					{#if side.done}
						<div class="mt-3 space-y-1" in:fade>
							{#if isHcf && !reachedOnes(side.rows)}
								<p class="text-sm">{t.compare.stopHcf}</p>
							{/if}
							<p class="font-mono font-bold">
								{isHcf ? t.ladder.hcf : t.ladder.lcm}
								= {side.divisors.length ? side.divisors.join(' × ') + ' = ' : ''}{product(
									side.divisors
								)}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<p class="text-center text-sm">
			<span class="bg-warning/30 rounded px-1">n</span>
			{t.compare.broughtDown}
		</p>

		{#if finished && steps > 0}
			<div class="alert alert-success justify-center text-center" in:fade role="status">
				<Rich text={t.compare.summary(hcfOf(start), lcmOf(start))} />
			</div>
		{/if}

		<div class="flex flex-wrap items-center justify-center gap-2">
			<button class="btn btn-sm btn-primary" disabled={finished || stepper.playing} onclick={step}>
				{t.compare.step}
			</button>
			<button class="btn btn-sm btn-outline" disabled={stepper.playing} onclick={play}>
				{t.ladder.watch}
			</button>
			<button class="btn btn-sm btn-ghost" disabled={steps === 0} onclick={reset}>
				{t.ladder.reset}
			</button>
			{#if steps > 0}
				<span class="ink-muted">{t.compare.stepsTaken(steps)}</span>
			{/if}
		</div>
	{/if}
</div>
