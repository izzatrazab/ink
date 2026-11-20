<script lang="ts" module>
	function isDoneAllOnes(rows: number[][]): boolean {
		return rows[rows.length - 1].every((n) => n === 1);
	}
</script>

<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import { autoDivisors, parseNumbers, product, rowsOf, type LadderMode } from './ladder';
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

	let presetIndex = $state(0);
	let steps = $state(0);
	let playing = $state(false);
	let customText = $state('');
	let customStart = $state<number[] | null>(null);
	let customError = $state(false);

	const isCustom = $derived(custom && presetIndex === presets.length);
	const ready = $derived(!isCustom || customStart !== null);
	const start = $derived((isCustom ? customStart : presets[presetIndex]) ?? [1]);

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

	function pickPreset(i: number) {
		presetIndex = i;
		reset();
	}

	function reset() {
		steps = 0;
		playing = false;
	}

	function applyCustom() {
		const nums = parseNumbers(customText, 'hcf');
		customError = nums === null;
		if (nums) {
			customStart = nums;
			reset();
		}
	}

	function step() {
		if (!finished) steps += 1;
		if (steps >= total) playing = false;
	}

	$effect(() => {
		if (!playing) return;
		const id = setInterval(step, 1200);
		return () => clearInterval(id);
	});

	function play() {
		reset();
		playing = true;
	}

	/** In the LCM ladder, a number that survives a rung untouched was "brought down". */
	const broughtDown = (mode: LadderMode, rows: number[][], i: number, j: number) =>
		mode === 'lcm' && i > 0 && rows[i][j] > 1 && rows[i][j] === rows[i - 1][j];
</script>

<div class="space-y-4">
	{#if presets.length > 1 || custom}
		<div class="flex flex-wrap items-center justify-center gap-2">
			<span class="text-sm font-semibold tracking-wide uppercase opacity-60">{t.ladder.number}</span
			>
			{#each presets as preset, i (i)}
				<button
					class="btn btn-sm {i === presetIndex ? 'btn-primary' : 'btn-outline'}"
					aria-pressed={i === presetIndex}
					onclick={() => pickPreset(i)}>{label(preset)}</button
				>
			{/each}
			{#if custom}
				<button
					class="btn btn-sm {isCustom ? 'btn-primary' : 'btn-outline'}"
					aria-pressed={isCustom}
					onclick={() => pickPreset(presets.length)}>{t.ladder.own}</button
				>
			{/if}
		</div>
	{/if}

	{#if isCustom}
		<form
			class="flex flex-wrap items-center justify-center gap-2"
			onsubmit={(e) => {
				e.preventDefault();
				applyCustom();
			}}
		>
			<input
				class="input input-bordered input-sm w-48 font-mono"
				type="text"
				inputmode="numeric"
				placeholder={t.ladder.ownPlaceholder}
				aria-label={t.ladder.own}
				bind:value={customText}
			/>
			<button class="btn btn-sm btn-primary" type="submit">{t.ladder.ownGo}</button>
		</form>
		{#if customError}
			<p class="text-error text-center text-sm" role="alert">{t.ladder.ownInvalid(false)}</p>
		{:else if !ready}
			<p class="text-center opacity-70">{t.ladder.ownEmpty}</p>
		{/if}
	{/if}

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
					<p class="mb-3 text-sm opacity-80">
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
										{#if broughtDown(side.mode, side.rows, i, j)}
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
							{#if isHcf && !isDoneAllOnes(side.rows)}
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
			<button class="btn btn-sm btn-primary" disabled={finished || playing} onclick={step}>
				{t.compare.step}
			</button>
			<button class="btn btn-sm btn-outline" disabled={playing} onclick={play}>
				{t.ladder.watch}
			</button>
			<button class="btn btn-sm btn-ghost" disabled={steps === 0} onclick={reset}>
				{t.ladder.reset}
			</button>
			{#if steps > 0}
				<span class="text-sm opacity-70">{t.compare.stepsTaken(steps)}</span>
			{/if}
		</div>
	{/if}
</div>
