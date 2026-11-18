<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { hint, isDone, product, rowsOf, tryDivisor, type LadderMode } from './ladder';

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
	}

	let { presets, mode = 'single' }: Props = $props();

	const DIVISORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13];

	let presetIndex = $state(0);
	let divisors = $state<number[]>([]);
	let message = $state('');
	let refused = $state<number | null>(null);
	let hinting = $state(false);
	let playing = $state(false);

	const start = $derived(presets[presetIndex]);
	const rows = $derived(rowsOf(start, divisors, mode));
	const current = $derived(rows[rows.length - 1]);
	const done = $derived(isDone(current, mode));
	const suggested = $derived(hint(current, mode));
	const answer = $derived(product(divisors));

	const label = (row: number[]) => row.join(', ');

	function setMessage(text: string) {
		message = text;
	}

	function choose(d: number) {
		if (done) return;
		const result = tryDivisor(current, d, mode);
		hinting = false;
		if (!result.ok) {
			refused = d;
			const r = result.rejection;
			if (r.kind === 'not-prime') {
				setMessage(
					d === 1
						? '1 cannot be used — dividing by 1 changes nothing.'
						: `${d} is not a prime number — it is ${r.smallestFactor} × ${d / r.smallestFactor}. Divide by a prime instead, like ${r.smallestFactor}.`
				);
			} else if (r.kind === 'remainder') {
				setMessage(
					`${r.number} ÷ ${d} leaves a remainder of ${r.remainder}, so ${d} does not divide ${r.number} completely.${mode === 'hcf' ? ' For the HCF, the divisor must divide every number.' : ''}`
				);
			} else {
				setMessage(`${d} does not divide any of the numbers, so nothing would change.`);
			}
			return;
		}
		refused = null;
		divisors = [...divisors, d];
		if (isDone(result.next, mode)) {
			playing = false;
			setMessage(
				mode === 'single'
					? `${label(current)} ÷ ${d} = ${label(result.next)}. The bottom is 1 — we are finished! Now multiply all the numbers on the left.`
					: `Finished! Now multiply all the numbers on the left.`
			);
		} else {
			setMessage(
				mode === 'single'
					? `${label(current)} ÷ ${d} = ${label(result.next)}. Keep going: divide ${label(result.next)} by a prime.`
					: `Divided by ${d}: ${label(result.next)}. Keep going.`
			);
		}
	}

	function pickPreset(i: number) {
		presetIndex = i;
		reset();
	}

	function reset() {
		divisors = [];
		message = '';
		refused = null;
		hinting = false;
		playing = false;
	}

	function undo() {
		playing = false;
		hinting = false;
		refused = null;
		divisors = divisors.slice(0, -1);
		message = '';
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
		message = 'Watch: each time, we divide by the smallest prime that goes in.';
		playing = true;
	}

	const finalLine = $derived(
		mode === 'single'
			? `${start[0]} = ${divisors.join(' × ')}`
			: `${mode === 'hcf' ? 'HCF' : 'LCM'} = ${divisors.join(' × ')} = ${answer}`
	);
</script>

<div class="space-y-4">
	{#if presets.length > 1}
		<div class="flex flex-wrap items-center justify-center gap-2">
			<span class="text-sm font-semibold tracking-wide uppercase opacity-60">Number</span>
			{#each presets as preset, i (i)}
				<button
					class="btn btn-sm {i === presetIndex ? 'btn-primary' : 'btn-outline'}"
					aria-pressed={i === presetIndex}
					onclick={() => pickPreset(i)}>{label(preset)}</button
				>
			{/each}
		</div>
	{/if}

	<div
		class="border-base-300 bg-base-200 mx-auto max-w-sm rounded-2xl border p-5 font-mono text-xl"
		aria-label="Division ladder for {label(start)}"
	>
		{#each rows as row, i (i)}
			<div class="flex min-h-12 items-center" in:fly={{ y: -14, duration: 300 }}>
				<span
					class="w-14 pr-3 text-right font-bold {done ? 'text-success' : 'text-primary'}"
					aria-label={divisors[i] ? `divisor ${divisors[i]}` : undefined}
				>
					{divisors[i] ?? ''}
				</span>
				<span
					class="border-base-content/60 flex-1 border-l-2 py-1 pl-4 {i === rows.length - 1 && !done
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
			{done ? 'Finished' : 'Divide by…'}
		</p>
		<div class="flex flex-wrap justify-center gap-2">
			{#each DIVISORS as d (d)}
				<button
					class="btn btn-sm btn-square {hinting && suggested === d
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

	<p class="min-h-16 text-center leading-relaxed" aria-live="polite">
		{#if message}
			{message}
		{:else}
			Choose a prime number that divides <strong>{label(current)}</strong> completely.
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
			onclick={() => (hinting = !hinting)}>{hinting ? 'Hide hint' : 'Hint'}</button
		>
		<button class="btn btn-sm btn-outline" disabled={playing} onclick={watch}>Watch it</button>
		<button class="btn btn-sm btn-ghost" disabled={divisors.length === 0} onclick={undo}
			>Undo</button
		>
		<button class="btn btn-sm btn-ghost" disabled={divisors.length === 0} onclick={reset}
			>Start over</button
		>
	</div>
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
