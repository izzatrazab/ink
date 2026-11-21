<script lang="ts">
	import { useCopy } from './useCopy';
	import { factors, hcf } from './numbers';
	import { rowIssue } from './lanes';
	import FactorPair from './FactorPair.svelte';

	// The HCF as a comparison: one row per number listing all its factors; a factor
	// found in every row lights up (a common factor) and the biggest of those is the
	// HCF. Each chip is a divisor the student already met in "What are factors?", so
	// the answer is read off the lists, not announced. Everything is derived from `of`.
	// With `inputs` given ("Your own"), each row's number is a text box instead.
	interface Props {
		/** One entry per row; null is a row still empty. */
		of: (number | null)[];
		playing: boolean;
		inputs?: string[];
		onremove?: (index: number) => void;
	}

	let { of: rows, playing, inputs = $bindable(), onremove }: Props = $props();

	// Every way to write n as a × b with a ≤ b: 1 × 24, 2 × 12, 3 × 8, 4 × 6.
	const pairs = (n: number): [number, number][] =>
		factors(n)
			.filter((f) => f * f <= n)
			.map((f) => [f, n / f]);

	const copy = useCopy();
	const t = $derived(copy.t.lanes);
	const valid = $derived(rows.filter((v): v is number => v !== null));
	const common = $derived(
		valid.length >= 2
			? new Set(factors(valid[0]).filter((f) => valid.every((v) => v % f === 0)))
			: new Set<number>()
	);
	const best = $derived(valid.length >= 2 ? hcf(valid) : null);
</script>

<div class="rounded-box bg-base-100 mx-auto max-w-2xl space-y-4 p-6 shadow-sm">
	<div
		class="grid gap-x-6 gap-y-6"
		style:grid-template-columns="repeat({rows.length}, minmax(0, 1fr))"
	>
		{#each rows as v, i (i)}
			{@const bad = inputs ? rowIssue(inputs, rows, i) === 'invalid' : false}
			<div class="space-y-2">
				<div class="flex items-center justify-center gap-1">
					{#if inputs}
						{#if inputs.length > 1}
							<button
								type="button"
								class="btn btn-ghost btn-xs"
								aria-label={t.removeLane(i + 1)}
								onclick={() => onremove?.(i)}>✕</button
							>
						{/if}
						<input
							type="text"
							inputmode="numeric"
							maxlength="3"
							placeholder="?"
							aria-label={t.laneLabel(i + 1)}
							aria-invalid={bad}
							class="input input-sm w-16 text-center font-mono text-lg font-bold {bad
								? 'input-error'
								: ''}"
							bind:value={inputs[i]}
						/>
					{:else if v !== null}
						<span class="text-primary text-2xl font-bold">{v}</span>
					{/if}
				</div>
				{#if v !== null}
					<p class="ink-muted text-center text-xs font-semibold">{t.factorsOf(v)}</p>
					<ul class="space-y-2">
						{#each pairs(v) as [a, b], k (a)}
							<li>
								<FactorPair
									{a}
									{b}
									markA={!playing || !common.has(a) ? 'dim' : a === best ? 'best' : 'on'}
									markB={!playing || !common.has(b) ? 'dim' : b === best ? 'best' : 'on'}
									delay={playing ? Math.min(k * 60, 600) : 0}
								/>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
	{#if best !== null}
		<p class="ink-muted text-center text-sm">{t.commonLegend}</p>
	{/if}
</div>
