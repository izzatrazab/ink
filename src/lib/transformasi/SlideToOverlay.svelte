<script lang="ts">
	import Figure from './Figure.svelte';
	import { translationVector, type Shape } from './geometry';

	// The slide-to-overlay reveal: an `object` Figure slides onto a `target`
	// Figure by the Translation vector that maps one onto the other, so "same
	// shape and size, just moved" becomes visible. The vector is derived from the
	// two figures actually drawn here (the geometry seam), never supplied
	// separately, so the motion and the geometry cannot drift (PRD User Story 20).
	//
	// It renders only the two figure groups — it sits inside a caller's <Stage>,
	// which owns the viewBox and surrounding layout. `play` drives the slide both
	// ways: false leaves the object at rest, true slides it onto the target.
	//
	// In Section 11.1 `play` is scripted (a button, or a committed answer); in
	// Section 11.2 the same mechanic becomes the student-driven Explorable.
	interface Props {
		/** The moving figure (objek). */
		object: Shape;
		/** The figure the object slides onto. */
		target: Shape;
		/** Whether the slide is engaged. */
		play: boolean;
		/**
		 * How the target is drawn: `ghost` (a faint destination) or `outline`
		 * (a stroked shape the filled object covers — or fails to).
		 */
		targetVariant?: 'ghost' | 'outline';
	}

	let { object, target, play, targetVariant = 'ghost' }: Props = $props();

	const v = $derived(translationVector(object, target));
</script>

{#if targetVariant === 'ghost'}
	<g class="opacity-25">
		<Figure shape={target} />
	</g>
{:else}
	<Figure shape={target} fill="none" stroke="currentColor" strokeWidth={2} />
{/if}

<g class="mover" style:transform={play ? `translate(${v.dx}px, ${v.dy}px)` : 'translate(0px, 0px)'}>
	<Figure shape={object} />
</g>

<style>
	.mover {
		transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
