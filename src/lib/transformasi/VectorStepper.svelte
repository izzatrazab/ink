<script lang="ts">
	import type { Vector } from './geometry';

	// A reusable (a, b) stepper for a Translation vector: a +/− pair per component.
	// It is the input device for the Section 11.2 Explorable and is reused by the
	// 11.2 exercise (issue 05) for (a, b) entry. It is purely presentational — it
	// owns no geometry: it proposes the next Vector via `onchange`, and the caller
	// decides what to store (e.g. after clamping onto the grid). Holding the rune
	// in the caller keeps the clamp/translate math in the seams, not in here.
	interface Props {
		/** The current vector (a = dx, b = dy). */
		value: Vector;
		/** Called with the proposed next vector when a button is pressed. */
		onchange: (next: Vector) => void;
		/** How much each press changes a component. */
		step?: number;
	}

	let { value, onchange, step = 1 }: Props = $props();

	function bump(component: 'dx' | 'dy', delta: number) {
		onchange({ ...value, [component]: value[component] + delta });
	}
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center gap-3">
		<span class="w-4 font-mono text-lg italic">a</span>
		<button
			class="btn btn-circle btn-outline btn-sm"
			aria-label="Kurangkan a"
			onclick={() => bump('dx', -step)}>−</button
		>
		<span class="w-8 text-center font-mono text-lg tabular-nums" aria-live="polite">{value.dx}</span>
		<button
			class="btn btn-circle btn-outline btn-sm"
			aria-label="Tambah a"
			onclick={() => bump('dx', step)}>+</button
		>
	</div>
	<div class="flex items-center gap-3">
		<span class="w-4 font-mono text-lg italic">b</span>
		<button
			class="btn btn-circle btn-outline btn-sm"
			aria-label="Kurangkan b"
			onclick={() => bump('dy', -step)}>−</button
		>
		<span class="w-8 text-center font-mono text-lg tabular-nums" aria-live="polite">{value.dy}</span>
		<button
			class="btn btn-circle btn-outline btn-sm"
			aria-label="Tambah b"
			onclick={() => bump('dy', step)}>+</button
		>
	</div>
</div>
