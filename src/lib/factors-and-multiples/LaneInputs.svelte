<script lang="ts">
	import { laneY, rowIssue } from './lanes';
	import { useCopy } from './useCopy';

	// The number of each lane, as text boxes sitting in the label column of the lanes
	// stage, so the student types straight onto the lane. Drawn inside the stage's
	// SVG through <foreignObject>, so the boxes scale with the figure and line up
	// with their lanes exactly. A lane is removed with the ✕ before its box.
	interface Props {
		inputs: string[];
		values: (number | null)[];
		onremove: (index: number) => void;
	}

	let { inputs = $bindable(), values, onremove }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t.lanes);
</script>

{#each inputs as _, i (i)}
	{@const bad = rowIssue(inputs, values, i) === 'invalid'}
	<foreignObject x="0" y={laneY(i, inputs.length) - 6} width="26" height="12">
		<div class="row">
			{#if inputs.length > 1}
				<button
					type="button"
					class="remove"
					aria-label={t.removeLane(i + 1)}
					onclick={() => onremove(i)}>✕</button
				>
			{/if}
			<input
				type="text"
				inputmode="numeric"
				maxlength="3"
				placeholder="?"
				aria-label={t.laneLabel(i + 1)}
				aria-invalid={bad}
				class:bad
				bind:value={inputs[i]}
			/>
		</div>
	</foreignObject>
{/each}

<style>
	/* Sizes are SVG user units: the whole figure scales together. */
	.row {
		display: flex;
		align-items: center;
		height: 12px;
		gap: 0.5px;
	}
	input {
		width: 17px;
		height: 10px;
		box-sizing: border-box;
		padding: 0 1px;
		font:
			700 7px/1 ui-monospace,
			monospace;
		text-align: center;
		color: inherit;
		background: transparent;
		border: 0.6px solid currentColor;
		border-radius: 2px;
	}
	input.bad {
		border-color: var(--color-error);
		color: var(--color-error);
	}
	input:focus {
		outline: 0.8px solid currentColor;
	}
	.remove {
		width: 6px;
		padding: 0;
		font-size: 5px;
		line-height: 1;
		color: inherit;
		opacity: 0.5;
		background: none;
		border: 0;
		cursor: pointer;
	}
	.remove:hover {
		opacity: 1;
	}
</style>
