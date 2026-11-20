<script lang="ts">
	import type { Copy } from './copy';
	import type { Picker } from './picker.svelte';

	// The chip row and "Your own" form for a ladder's starting numbers. Markup only:
	// the state and rules live in the `Picker` object it is given.
	interface Props {
		picker: Picker;
		presets: number[][];
		custom: boolean;
		/** The ladder's wording. */
		t: Copy['ladder'];
		/** Whether the student's own numbers are a single number (changes the error wording). */
		single: boolean;
	}

	let { picker, presets, custom, t, single }: Props = $props();

	const label = (row: number[]) => row.join(', ');
</script>

{#if presets.length > 1 || custom}
	<div class="flex flex-wrap items-center justify-center gap-2">
		<span class="text-sm font-semibold tracking-wide uppercase opacity-60">{t.number}</span>
		{#each presets as preset, i (i)}
			<button
				class="btn btn-sm {i === picker.index ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={i === picker.index}
				onclick={() => picker.pick(i)}>{label(preset)}</button
			>
		{/each}
		{#if custom}
			<button
				class="btn btn-sm {picker.isCustom ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={picker.isCustom}
				onclick={() => picker.pick(presets.length)}>{t.own}</button
			>
		{/if}
	</div>
{/if}

{#if picker.isCustom}
	<form
		class="flex flex-wrap items-center justify-center gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			picker.apply();
		}}
	>
		<input
			class="input input-bordered input-sm w-48 font-mono"
			type="text"
			inputmode="numeric"
			placeholder={t.ownPlaceholder}
			aria-label={t.own}
			bind:value={picker.text}
		/>
		<button class="btn btn-sm btn-primary" type="submit">{t.ownGo}</button>
	</form>
	{#if picker.error}
		<p class="text-error text-center text-sm" role="alert">{t.ownInvalid(single)}</p>
	{:else if !picker.ready}
		<p class="text-center opacity-70">{t.ownEmpty}</p>
	{/if}
{/if}
