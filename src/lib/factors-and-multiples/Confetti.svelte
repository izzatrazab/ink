<script lang="ts">
	import { PALETTE, makePieces } from './confetti';

	// A burst of confetti over the whole screen, for a perfect Prime Hunt board.
	// Pure CSS: each piece falls once and fades. It is decoration only — hidden from
	// assistive technology, never catches a tap — and is not drawn at all for readers
	// who ask for reduced motion. Mount it to play it; it plays once per mount.
	let { count = 48 }: { count?: number } = $props();
	const pieces = $derived(makePieces(count));
</script>

<div class="confetti" aria-hidden="true">
	{#each pieces as p, i (i)}
		<span
			class="piece"
			style:left="{p.left}%"
			style:width="{p.size}px"
			style:height="{p.size * 1.6}px"
			style:background="var({PALETTE[p.color]})"
			style:animation-delay="{p.delay}s"
			style:animation-duration="{p.duration}s"
			style:--drift="{p.drift}px"
			style:--spin="{p.spin}deg"
		></span>
	{/each}
</div>

<style>
	.confetti {
		position: fixed;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 50;
	}
	.piece {
		position: absolute;
		top: -24px;
		border-radius: 2px;
		opacity: 0;
		animation-name: fall;
		animation-timing-function: cubic-bezier(0.25, 0.6, 0.5, 1);
		animation-fill-mode: forwards;
	}
	@keyframes fall {
		0% {
			opacity: 1;
			transform: translate(0, 0) rotate(0);
		}
		80% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translate(var(--drift), 105vh) rotate(var(--spin));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.confetti {
			display: none;
		}
	}
</style>
