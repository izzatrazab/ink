<script lang="ts">
	import type { Snippet } from 'svelte';
	import FigureCard from './FigureCard.svelte';
	import Stage from './Stage.svelte';

	// The shared chrome around a Section's Latihan — the graded exercise that closes
	// every Section (CONTEXT.md). The deck-walking lives in latihan.ts; this is its
	// rendered counterpart, extracted once a second Section needed the same view
	// (11.1's congruency verdict and 11.2's find-the-vector), the deepen-on-second-
	// case discipline that already produced <LessonShell> (ADR-0008). It owns what
	// every Latihan renders the same way: the "Pasangan N daripada M" counter, the
	// keyed figure stage, the Betul/Belum-tepat verdict alert, and the advance/
	// congrats footer.
	//
	// What differs between Sections is supplied as snippets: the answer input (two
	// verdict buttons vs. the (a, b) stepper), the feedback sentence (an authored
	// explanation vs. a derived vector), and the **Reveal** — the motion that plays
	// the "why" (Slide-to-overlay for translation; Fold-to-overlay, planned for
	// reflection in 11.3). `input` receives the `answered` flag so each Section keeps its own
	// answered-state behaviour — 11.1 leaves its buttons visible-but-disabled, 11.2
	// swaps its stepper away.
	//
	// The Reveal seam: the shell renders `reveal(playing)` inside its Stage and
	// knows nothing of the figures or the motion. Its contract is that each pair
	// gets a fresh mount (the `{#key index}` below) and `playing` flips false → true
	// on commit when the Section's `revealsWhy` says that pair reveals (11.1 only
	// reveals congruent pairs), so a Reveal replays per pair by being a pure
	// function of `playing` — no state of its own, no reading the index. A Reveal
	// derives its motion from the figures it is given, never from separately
	// authored data. A single boolean should suffice even for the two-phase fold:
	// a throwaway prototype (branch prototype/fold-reveal) showed one scale 1 → -1
	// transition flattens onto the axis and unfolds mirrored.
	//
	// Presentational and px-only, like FigureCard/Stage: it reads view-state scalars
	// off the caller's latihan snapshot; it imports nothing from latihan.ts, so the
	// machine and its shell stay separable.
	interface Props {
		/** Zero-based index of the current pair. */
		index: number;
		/** Total pairs in the deck. */
		total: number;
		/** Whether the current pair has been answered (the commitment is final). */
		answered: boolean;
		/** Whether the committed answer is correct. */
		correct: boolean;
		/** Whether this is the last pair in the deck. */
		last: boolean;
		/** Whether the Reveal is currently playing; passed to `reveal` as `playing`. */
		overlayPlaying: boolean;
		/** Aspect ratio of the figure card, e.g. "2/1" or "1/1". */
		aspect: string;
		/** Extra classes for the figure card (e.g. a max-width like "max-w-md"). */
		cardClass?: string;
		/** A fixed viewBox for the Stage — Section 11.1's raw px space. */
		viewBox?: string;
		/** A Cartesian grid half-extent for the Stage — Section 11.2's satah Cartes. */
		range?: number;
		/** The Reveal drawn inside the Stage, given `playing`. Remounted per pair. */
		reveal: Snippet<[boolean]>;
		/** The answer control, given the current `answered` flag. */
		input: Snippet<[boolean]>;
		/** The feedback sentence, rendered after the Betul/Belum-tepat verdict. */
		feedback: Snippet;
		/** Advance to the next pair. */
		onnext: () => void;
	}

	let {
		index,
		total,
		answered,
		correct,
		last,
		overlayPlaying,
		aspect,
		cardClass,
		viewBox,
		range,
		reveal,
		input,
		feedback,
		onnext
	}: Props = $props();
</script>

<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
	Pasangan {index + 1} daripada {total}
</p>

<figure>
	<FigureCard {aspect} class={cardClass}>
		{#key index}
			<Stage {viewBox} {range} class="h-full w-full">
				{@render reveal(overlayPlaying)}
			</Stage>
		{/key}
	</FigureCard>
</figure>

{@render input(answered)}

{#if answered}
	<div class="alert" class:alert-success={correct} class:alert-error={!correct} role="status">
		<span>
			<strong>{correct ? 'Betul!' : 'Belum tepat.'}</strong>
			{@render feedback()}
		</span>
	</div>

	<div class="text-center">
		{#if last}
			<p class="opacity-70">Tahniah — anda telah menyelesaikan semua pasangan.</p>
		{:else}
			<button class="btn btn-primary" onclick={onnext}>Pasangan seterusnya</button>
		{/if}
	</div>
{/if}
