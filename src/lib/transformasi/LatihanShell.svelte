<script lang="ts">
	import type { Snippet } from 'svelte';
	import FigureCard from './FigureCard.svelte';
	import Stage from './Stage.svelte';
	import { uiText, type Language } from '$lib/chapters';

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
		/** Language of the shell's own wording (counter, verdict, advance). Defaults to Malay. */
		lang?: Language;
		/** Per-chapter wording that replaces the shared counter / finished line. */
		wording?: { questionOf: (index: number, total: number) => string; allDone: string };
	}

	let {
		latihan,
		aspect,
		cardClass,
		viewBox,
		range,
		reveal,
		input,
		feedback,
		lang = 'ms',
		wording
	}: Props = $props();
	const t = $derived({ ...uiText(lang), ...wording });
</script>

<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
	{t.questionOf(latihan.index, latihan.total)}
</p>

<figure>
	<FigureCard {aspect} class={cardClass}>
		{#key latihan.index}
			<Stage {viewBox} {range} class="h-full w-full">
				{@render reveal(latihan.revealing)}
			</Stage>
		{/key}
	</FigureCard>
</figure>

{@render input(latihan.answered)}

{#if latihan.answered}
	<div
		class="alert"
		class:alert-success={latihan.correct}
		class:alert-error={!latihan.correct}
		role="status"
	>
		<span>
			<strong>{latihan.correct ? t.correct : t.incorrect}</strong>
			{@render feedback()}
		</span>
	</div>

	<div class="text-center">
		{#if latihan.last}
			<p class="opacity-70">{t.allDone}</p>
		{:else}
			<button class="btn btn-primary" onclick={() => latihan.next()}>{t.nextQuestion}</button>
		{/if}
	</div>
{/if}
