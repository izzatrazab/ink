<script lang="ts">
	import type { Snippet } from 'svelte';
	import FigureCard from './FigureCard.svelte';
	import Stage from './Stage.svelte';
	import { malayWording, type LatihanWording } from './latihanWording';

	// The shared chrome around a Section's Latihan — the graded exercise that closes
	// every Section (CONTEXT.md). The deck-walking lives in latihan.ts; this is its
	// rendered counterpart, extracted once a second Section needed the same view
	// (11.1's congruency verdict and 11.2's find-the-vector), the deepen-on-second-
	// case discipline that already produced <LessonShell> (ADR-0008). It owns what
	// every Latihan renders the same way: the "Pasangan N daripada M" counter, the
	// keyed figure stage, the Betul/Belum-tepat verdict alert, and the advance/
	// congrats footer. It renders one started Latihan (latihan.svelte.ts): it reads
	// the view-state off it and calls `next()` to advance — the adapter resets the
	// Section's draft, so advancing and resetting cannot get out of step.
	//
	// What differs between Sections is supplied as snippets: the answer input (two
	// verdict buttons vs. the (a, b) stepper), the feedback sentence (an authored
	// explanation vs. a derived vector), and the **Reveal** — the motion that plays
	// the "why" (Slide-to-overlay for translation; Fold-to-overlay, planned for
	// reflection in 11.3). `input` receives the `answered` flag so each Section keeps
	// its own answered-state behaviour — 11.1 leaves its buttons visible-but-disabled,
	// 11.2 swaps its stepper away.
	//
	// The Reveal seam: the shell renders `reveal(playing)` inside its Stage and
	// knows nothing of the figures or the motion. Its contract is that each pair
	// gets a fresh mount (the `{#key}` on the index below) and `playing` flips false → true
	// on commit when the Section's `revealsWhy` says that pair reveals (11.1 only
	// reveals congruent pairs), so a Reveal replays per pair by being a pure
	// function of `playing` — no state of its own, no reading the index. A Reveal
	// derives its motion from the figures it is given, never from separately
	// authored data. A single boolean should suffice even for the two-phase fold:
	// a throwaway prototype (branch prototype/fold-reveal) showed one scale 1 → -1
	// transition flattens onto the axis and unfolds mirrored.
	//
	// Presentational and px-only, like FigureCard/Stage: the `latihan` prop's type is
	// declared here (LatihanView), so it imports nothing from the machine or the
	// adapter and stays separable — any object with those members renders.
	/** What the shell reads off a started Latihan — declared here so the shell imports nothing from the machine or the adapter. */
	interface LatihanView {
		/** Zero-based index of the current pair. */
		readonly index: number;
		/** Total pairs in the deck. */
		readonly total: number;
		/** Whether the current pair has been answered (the commitment is final). */
		readonly answered: boolean;
		/** Whether the committed answer is correct. */
		readonly correct: boolean;
		/** Whether this is the last pair in the deck. */
		readonly last: boolean;
		/** Whether the Reveal is currently playing. */
		readonly revealing: boolean;
		/** Advance to the next pair. */
		next(): void;
	}

	interface Props {
		/** The started Latihan this shell renders. */
		latihan: LatihanView;
		/** Aspect ratio of the figure card, e.g. "2/1" or "1/1". Unused with a `stage`. */
		aspect?: string;
		/** Extra classes for the figure card (e.g. a max-width like "max-w-md"). */
		cardClass?: string;
		/** A fixed viewBox for the Stage — Section 11.1's raw px space. */
		viewBox?: string;
		/** A Cartesian grid half-extent for the Stage — Section 11.2's satah Cartes. */
		range?: number;
		/** The Reveal drawn inside the Stage, given `playing`. Remounted per pair. */
		reveal?: Snippet<[boolean]>;
		/**
		 * Instead of the SVG card, a Section may draw its own figure (plain HTML), given
		 * `playing`. Remounted per pair, like the Reveal. For figures that are lists or
		 * tables, which an SVG stage would only shrink.
		 */
		stage?: Snippet<[boolean]>;
		/** The answer control, given the current `answered` flag. */
		input: Snippet<[boolean]>;
		/** The feedback sentence, rendered after the Betul/Belum-tepat verdict. */
		feedback: Snippet;
		/** The shell's own wording (counter, verdict, advance, finished line). Defaults to Malay. */
		wording?: LatihanWording;
	}

	let {
		latihan,
		aspect,
		cardClass,
		viewBox,
		range,
		reveal,
		stage,
		input,
		feedback,
		wording: t = malayWording
	}: Props = $props();
</script>

<p class="text-sm font-semibold tracking-wide uppercase ink-muted">
	{t.questionOf(latihan.index, latihan.total)}
</p>

<figure>
	{#if stage}
		{#key latihan.index}
			{@render stage(latihan.revealing)}
		{/key}
	{:else if reveal && aspect}
		<FigureCard {aspect} class={cardClass}>
			{#key latihan.index}
				<Stage {viewBox} {range} class="h-full w-full">
					{@render reveal(latihan.revealing)}
				</Stage>
			{/key}
		</FigureCard>
	{/if}
</figure>

{@render input(latihan.answered)}

{#if latihan.answered}
	<!-- The verdict never rests on colour alone: a tick or a cross and the word say it too. -->
	<div
		class="alert ink-verdict"
		class:alert-success={latihan.correct}
		class:alert-error={!latihan.correct}
		role="status"
	>
		<svg
			class="size-6 shrink-0"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			{#if latihan.correct}
				<path d="M5 12.5l4.5 4.5L19 7.5" />
			{:else}
				<path d="M6 6l12 12M18 6L6 18" />
			{/if}
		</svg>
		<span>
			<strong>{latihan.correct ? t.correct : t.incorrect}</strong>
			{@render feedback()}
		</span>
	</div>

	<div class="text-center">
		{#if latihan.last}
			<p class="ink-muted">{t.allDone}</p>
		{:else}
			<button class="btn btn-primary" onclick={() => latihan.next()}>{t.nextQuestion}</button>
		{/if}
	</div>
{/if}
