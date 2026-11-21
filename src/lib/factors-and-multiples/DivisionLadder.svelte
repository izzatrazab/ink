<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import StartingNumbers from './StartingNumbers.svelte';
	import { startPicker } from './picker.svelte';
	import { startLadder } from './ladderSession.svelte';
	import { narrate, type LadderMode } from './ladder';
	import { motionDuration } from '$lib/motion';

	// The interactive "method of repeated division". The student builds the ladder
	// one rung at a time by choosing a divisor; every choice is checked by the rules
	// in ladder.ts and either accepted (a new row drops in) or refused with the
	// reason. The ladder's state and Watch live in ladderSession.svelte.ts and the
	// starting numbers in picker.svelte.ts; this component is wording and markup.
	interface Props {
		/** The numbers to divide, as one starting row, e.g. [60] or [36, 60, 72]. */
		presets: number[][];
		mode?: LadderMode;
		/** Adds a "Your own" chip where the student types their own numbers. */
		custom?: boolean;
	}

	let { presets, mode = 'single', custom = false }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t.ladder);

	// Primes only: the ladder divides by primes, so the buttons are the primes the
	// student should recall. Composites are no longer offered to pick.
	const DIVISORS = [2, 3, 5, 7, 11, 13, 17, 19];

	const picker = startPicker(
		() => ({ presets, custom, count: mode === 'single' ? 'one' : 'several' }),
		() => ladder.reset()
	);
	// Before the student has entered valid numbers the ladder is hidden; the picker
	// keeps `start` at [1] so what derives from it stays well-defined.
	const ready = $derived(picker.ready);
	const start = $derived(picker.start);
	const ladder = startLadder(() => ({ start, mode }));
	onDestroy(ladder.stop);

	const { choose, undo, reset, watch, toggleHint } = ladder;
	const divisors = $derived(ladder.divisors);
	const rows = $derived(ladder.rows);
	const current = $derived(ladder.current);
	const done = $derived(ladder.done);
	const suggested = $derived(ladder.suggested);
	const refused = $derived(ladder.refused);
	const hinting = $derived(ladder.hinting);
	const note = $derived(ladder.note);
	const message = $derived(
		note === 'watch' ? t.watchNote : note ? narrate(note.before, note.d, note.result, mode, t) : ''
	);

	const label = (row: number[]) => row.join(', ');

	const finalLine = $derived(
		mode === 'single'
			? `${start[0]} = ${divisors.join(' × ')}`
			: `${mode === 'hcf' ? t.hcf : t.lcm} = ${divisors.join(' × ')} = ${ladder.answer}`
	);
</script>

<div class="space-y-4">
	<StartingNumbers {picker} {presets} {custom} {t} single={mode === 'single'} />

	{#if ready}
		<div class="ink-card mx-auto max-w-sm p-5 font-mono text-xl" aria-label={t.aria(label(start))}>
			{#each rows as row, i (i)}
				<div class="flex min-h-12 items-center" in:fly={{ y: -14, duration: motionDuration(300) }}>
					<span
						class="w-14 pr-3 text-right font-bold {done ? 'text-success' : 'text-primary'}"
						aria-label={divisors[i] ? t.divisor(divisors[i]) : undefined}
					>
						{divisors[i] ?? ''}
					</span>
					<span
						class="border-base-content/60 flex-1 border-l-2 py-1 pl-4 {i === rows.length - 1 &&
						!done
							? 'font-bold'
							: ''}"
					>
						{label(row)}
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

		<div class="space-y-2 text-center">
			<p class="text-sm font-semibold tracking-wide uppercase ink-muted">
				{done ? t.finished : t.divideBy}
			</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each DIVISORS as d (d)}
					<button
						class="btn btn-square size-11! min-h-0 {hinting && suggested === d
							? 'btn-warning'
							: refused === d
								? 'btn-error'
								: 'btn-outline'}"
						class:shake={refused === d}
						disabled={done}
						onclick={() => choose(d)}>{d}</button
					>
				{/each}
			</div>
		</div>

		<p class="min-h-12 text-center leading-relaxed" aria-live="polite">
			{#if message}
				{message}
			{:else if current.length > 1 && mode === 'hcf'}
				<Rich text={t.pickEvery} />
			{:else if current.length > 1 && mode === 'lcm'}
				<Rich text={t.pickOne} />
			{:else}
				<Rich text={t.pickPrime(label(current))} />
			{/if}
		</p>

		{#if done}
			<div
				class="alert alert-success justify-center text-xl"
				in:fade={{ duration: motionDuration(400) }}
				role="status"
			>
				<span class="font-mono font-bold">{finalLine}</span>
			</div>
		{/if}

		<div class="flex flex-wrap justify-center gap-2">
			<button class="btn btn-sm btn-outline" disabled={done || ladder.watching} onclick={toggleHint}
				>{hinting ? t.hideHint : t.hint}</button
			>
			<button class="btn btn-sm btn-outline" disabled={ladder.watching} onclick={watch}
				>{t.watch}</button
			>
			<button class="btn btn-sm btn-ghost" disabled={divisors.length === 0} onclick={undo}
				>{t.undo}</button
			>
			<button class="btn btn-sm btn-ghost" disabled={divisors.length === 0} onclick={reset}
				>{t.reset}</button
			>
		</div>
	{/if}
</div>

<style>
	.shake {
		animation: shake 0.35s;
	}
	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.shake {
			animation: none;
		}
	}
</style>
