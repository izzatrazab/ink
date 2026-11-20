<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import {
		hint,
		parseNumbers,
		isDone,
		narrate,
		product,
		rowsOf,
		tryDivisor,
		type LadderMode,
		type TryResult
	} from './ladder';

	// The interactive "method of repeated division". The student builds the ladder
	// one rung at a time by choosing a divisor; every choice is checked by the rules
	// in ladder.ts and either accepted (a new row drops in) or refused with the
	// reason. The only state is the list of divisors chosen — rows, "done" and the
	// final product are all derived. "Hint" points at the smallest prime that works;
	// "Watch" plays the whole ladder by itself, narrating each step.
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

	const DIVISORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 17, 19];

	let presetIndex = $state(0);
	let divisors = $state<number[]>([]);
	// What the message line is about, not its text: the sentence is derived below in
	// the reader's current language, so toggling EN/BM rewrites it in place.
	let note = $state<{ before: number[]; d: number; result: TryResult } | 'watch' | null>(null);
	let refused = $state<number | null>(null);
	let hinting = $state(false);
	let playing = $state(false);

	let customText = $state('');
	let customStart = $state<number[] | null>(null);
	let customError = $state(false);

	const isCustom = $derived(custom && presetIndex === presets.length);
	// Before the student has entered valid numbers the ladder is hidden; [1] only
	// keeps the derived values below well-defined.
	const ready = $derived(!isCustom || customStart !== null);
	const start = $derived((isCustom ? customStart : presets[presetIndex]) ?? [1]);
	const rows = $derived(rowsOf(start, divisors, mode));
	const current = $derived(rows[rows.length - 1]);
	const done = $derived(isDone(current, mode));
	const suggested = $derived(hint(current, mode));
	const answer = $derived(product(divisors));
	const message = $derived(
		note === 'watch' ? t.watchNote : note ? narrate(note.before, note.d, note.result, mode, t) : ''
	);

	const label = (row: number[]) => row.join(', ');

	function choose(d: number) {
		if (done) return;
		// `current` moves on as soon as the divisor is added, so the narration works
		// from this snapshot of the row that was actually divided.
		const before = current;
		const result = tryDivisor(before, d, mode);
		hinting = false;
		note = { before, d, result };
		if (!result.ok) {
			refused = d;
			return;
		}
		refused = null;
		divisors = [...divisors, d];
		if (isDone(result.next, mode)) playing = false;
	}

	function pickPreset(i: number) {
		presetIndex = i;
		reset();
	}

	function applyCustom() {
		const nums = parseNumbers(customText, mode);
		customError = nums === null;
		if (nums) {
			customStart = nums;
			reset();
		}
	}

	function reset() {
		divisors = [];
		note = null;
		refused = null;
		hinting = false;
		playing = false;
	}

	function undo() {
		playing = false;
		hinting = false;
		refused = null;
		divisors = divisors.slice(0, -1);
		note = null;
	}

	// "Watch": take the hint step every 1.2 s until the ladder is done.
	$effect(() => {
		if (!playing) return;
		const id = setInterval(() => {
			const d = hint(rowsOf(start, divisors, mode).at(-1)!, mode);
			if (d === undefined) {
				playing = false;
				return;
			}
			choose(d);
		}, 1200);
		return () => clearInterval(id);
	});

	function watch() {
		reset();
		note = 'watch';
		playing = true;
	}

	const finalLine = $derived(
		mode === 'single'
			? `${start[0]} = ${divisors.join(' × ')}`
			: `${mode === 'hcf' ? t.hcf : t.lcm} = ${divisors.join(' × ')} = ${answer}`
	);
</script>

<div class="space-y-4">
	{#if presets.length > 1 || custom}
		<div class="flex flex-wrap items-center justify-center gap-2">
			<span class="text-sm font-semibold tracking-wide uppercase opacity-60">{t.number}</span>
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
					onclick={() => pickPreset(presets.length)}>{t.own}</button
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
				placeholder={t.ownPlaceholder}
				aria-label={t.own}
				bind:value={customText}
			/>
			<button class="btn btn-sm btn-primary" type="submit">{t.ownGo}</button>
		</form>
		{#if customError}
			<p class="text-error text-center text-sm" role="alert">{t.ownInvalid(mode === 'single')}</p>
		{:else if !ready}
			<p class="text-center opacity-70">{t.ownEmpty}</p>
		{/if}
	{/if}

	{#if ready}
		<div
			class="border-base-300 bg-base-200 mx-auto max-w-sm rounded-2xl border p-5 font-mono text-xl"
			aria-label={t.aria(label(start))}
		>
			{#each rows as row, i (i)}
				<div class="flex min-h-12 items-center" in:fly={{ y: -14, duration: 300 }}>
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
			<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
				{done ? t.finished : t.divideBy}
			</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each DIVISORS as d (d)}
					<button
						class="btn btn-square size-10! min-h-0 {hinting && suggested === d
							? 'btn-warning'
							: refused === d
								? 'btn-error'
								: 'btn-outline'}"
						class:shake={refused === d}
						disabled={done}
						onclick={() => {
							playing = false;
							choose(d);
						}}>{d}</button
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
			<div class="alert alert-success justify-center text-xl" in:fade role="status">
				<span class="font-mono font-bold">{finalLine}</span>
			</div>
		{/if}

		<div class="flex flex-wrap justify-center gap-2">
			<button
				class="btn btn-sm btn-outline"
				disabled={done || playing}
				onclick={() => (hinting = !hinting)}>{hinting ? t.hideHint : t.hint}</button
			>
			<button class="btn btn-sm btn-outline" disabled={playing} onclick={watch}>{t.watch}</button>
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
