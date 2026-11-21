<script lang="ts">
	// One factor pair, a × b, drawn as two chips either side of the ×. Shared by the
	// "What are factors?" tiles (found vs still "?") and the HCF comparison
	// (common vs not), so a factor pair looks the same wherever it appears.
	// `dim` is a number not (yet) highlighted, `on` is highlighted, `best` is the
	// highlighted one that is the HCF.
	type Mark = 'dim' | 'on' | 'best';
	interface Props {
		a: number | string;
		b: number | string;
		markA?: Mark;
		markB?: Mark;
		/** Delay before the chips change, for staggering a list. */
		delay?: number;
	}

	let { a, b, markA = 'dim', markB = 'dim', delay = 0 }: Props = $props();
</script>

<div
	class="flex items-center justify-center gap-2 font-mono text-base font-semibold"
	style:transition-delay="{delay}ms"
>
	<span class="chip {markA}" style:transition-delay="{delay}ms">{a}</span>
	<span class="ink-muted">×</span>
	<span class="chip {markB}" style:transition-delay="{delay}ms">{b}</span>
</div>

<style>
	.chip {
		min-width: 2.5rem;
		padding: 0.2rem 0.5rem;
		text-align: center;
		font-weight: 600;
		border: 1.5px solid color-mix(in oklab, currentColor 25%, transparent);
		border-radius: 0.5rem;
		opacity: 0.55;
		transition:
			background-color 0.25s ease,
			color 0.25s ease,
			opacity 0.25s ease,
			transform 0.25s ease;
	}
	.on,
	.best {
		opacity: 1;
		color: var(--color-primary-content);
		background: var(--color-primary);
		border-color: var(--color-primary);
	}
	.best {
		transform: scale(1.12);
		outline: 3px solid color-mix(in oklab, var(--color-primary) 35%, transparent);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		.chip {
			transition: none;
		}
	}
</style>
