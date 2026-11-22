<script lang="ts">
	// The grid of numbers a Mini-game's Board is drawn as: four across, each a
	// button judged by whoever owns the game. Shared by Prime Hunt and Multiples
	// Hunt so a Board looks and sounds the same in both. A tap that is right turns
	// green with a pop, a wrong one red with a shake; both carry a mark as well as
	// a colour, and the motion drops out for readers who ask for reduced motion
	// (app.css).
	type CellState = 'open' | 'found' | 'wrong';

	interface Props {
		numbers: number[];
		stateOf: (n: number) => CellState;
		/** What a screen reader says for a cell, e.g. "12: prime, found". */
		label: (n: number, state: CellState) => string;
		ontap: (n: number) => void;
		/** Describes the whole grid. */
		ariaLabel: string;
	}

	let { numbers, stateOf, label, ontap, ariaLabel }: Props = $props();
</script>

<div class="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-3" role="group" aria-label={ariaLabel}>
	{#each numbers as n (n)}
		{@const state = stateOf(n)}
		<button
			type="button"
			class="btn font-display relative h-16 text-2xl sm:h-20 {state === 'found'
				? 'btn-success cell-pop'
				: state === 'wrong'
					? 'btn-error cell-shake'
					: 'btn-outline'}"
			aria-label={label(n, state)}
			aria-disabled={state === 'open' ? undefined : true}
			onclick={() => ontap(n)}
		>
			{n}
			{#if state !== 'open'}
				<span class="absolute top-1 right-2 text-xs font-bold" aria-hidden="true"
					>{state === 'found' ? '✓' : '✗'}</span
				>
			{/if}
		</button>
	{/each}
</div>

<style>
	/* Played once, when a cell first gets the class. Reduced motion zeroes these in app.css. */
	@keyframes cell-pop {
		0% {
			transform: scale(1);
		}
		40% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes cell-shake {
		0%,
		100% {
			translate: 0;
		}
		20% {
			translate: -7px;
		}
		40% {
			translate: 7px;
		}
		60% {
			translate: -4px;
		}
		80% {
			translate: 4px;
		}
	}
	:global(.cell-pop) {
		animation: cell-pop 0.35s ease-out;
	}
	:global(.cell-shake) {
		animation: cell-shake 0.4s ease-in-out;
	}
</style>
