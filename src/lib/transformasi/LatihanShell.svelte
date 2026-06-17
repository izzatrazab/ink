<script lang="ts">
	import type { Snippet } from 'svelte';
	import FigureCard from './FigureCard.svelte';
	import Stage from './Stage.svelte';
	import SlideToOverlay from './SlideToOverlay.svelte';
	import type { Shape } from './geometry';

	// The shared chrome around a Section's Latihan — the graded exercise that closes
	// every Section (CONTEXT.md). The deck-walking lives in latihan.ts; this is its
	// rendered counterpart, extracted once a second Section needed the same view
	// (11.1's congruency verdict and 11.2's find-the-vector), the deepen-on-second-
	// case discipline that already produced <LessonShell> (ADR-0008). It owns what
	// every Latihan renders the same way: the "Pasangan N daripada M" counter, the
	// keyed figure stage that replays the Slide-to-overlay "why" on commit, the
	// Betul/Belum-tepat verdict alert, and the advance/congrats footer.
	//
	// What differs between Sections is supplied as snippets: the answer input (two
	// verdict buttons vs. the (a, b) stepper) and the feedback sentence (an authored
	// explanation vs. a derived vector). `input` receives the `answered` flag so each
	// Section keeps its own answered-state behaviour — 11.1 leaves its buttons
	// visible-but-disabled, 11.2 swaps its stepper away.
	//
	// Presentational and px-only, like FigureCard/Stage: it reads view-state scalars
	// off the caller's latihan snapshot and composes Figure widgets; it imports
	// nothing from latihan.ts, so the machine and its shell stay separable.
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
		/** Whether the Slide-to-overlay "why" is currently playing. */
		overlayPlaying: boolean;
		/** The moving figure (objek), already in SVG px. */
		object: Shape;
		/** The figure the object slides onto (imej/banding), already in SVG px. */
		target: Shape;
		/** Aspect ratio of the figure card, e.g. "2/1" or "1/1". */
		aspect: string;
		/** Extra classes for the figure card (e.g. a max-width like "max-w-md"). */
		cardClass?: string;
		/** A fixed viewBox for the Stage — Section 11.1's raw px space. */
		viewBox?: string;
		/** A Cartesian grid half-extent for the Stage — Section 11.2's satah Cartes. */
		range?: number;
		/** How the target is drawn behind the sliding object. */
		targetVariant?: 'ghost' | 'outline';
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
		object,
		target,
		aspect,
		cardClass,
		viewBox,
		range,
		targetVariant = 'outline',
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
				<SlideToOverlay {object} {target} play={overlayPlaying} {targetVariant} />
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
