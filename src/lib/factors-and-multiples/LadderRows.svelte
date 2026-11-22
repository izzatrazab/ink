<script lang="ts">
	import { fly } from 'svelte/transition';
	import { motionDuration } from '$lib/motion';
	import { useCopy } from './useCopy';

	// The rows of a Division ladder as the textbook draws it: each divisor on the
	// left of a vertical bar, the row it produced beside it, a rule under each
	// rung. Shared by the lesson's <DivisionLadder> and the Prime Breaker game, so
	// a ladder looks the same wherever the student builds one.
	interface Props {
		rows: number[][];
		/** The divisor that produced each row after the first. */
		divisors: number[];
		/** Whether the ladder is finished (the last rung needs no rule under it). */
		done: boolean;
		/** Describes the ladder for assistive technology. */
		label: string;
	}

	let { rows, divisors, done, label }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t.ladder);
	const list = (row: number[]) => row.join(', ');
</script>

<div class="ink-card mx-auto max-w-sm p-5 font-mono text-xl" aria-label={label}>
	{#each rows as row, i (i)}
		<div class="flex min-h-12 items-center" in:fly={{ y: -14, duration: motionDuration(300) }}>
			<span
				class="w-14 pr-3 text-right font-bold {done ? 'text-success' : 'text-primary'}"
				aria-label={divisors[i] ? t.divisor(divisors[i]) : undefined}
			>
				{divisors[i] ?? ''}
			</span>
			<span
				class="border-base-content/60 flex-1 border-l-2 py-1 pl-4 {i === rows.length - 1 && !done
					? 'font-bold'
					: ''}"
			>
				{list(row)}
			</span>
		</div>
		{#if i < rows.length - 1 || !done}
			<div class="flex h-0">
				<span class="w-14"></span>
				<span class="border-base-content/60 flex-1 border-t-2 border-l-2"></span>
			</div>
		{/if}
	{/each}
</div>
