<script lang="ts">
	import { reader } from '$lib/language.svelte';
	import { getChapter } from '$lib/chapters';
	import { copy } from './copy';
	import { isFactor, multiples } from './numbers';

	// The Reveal for the common-multiple Latihan, drawn in a 200 × 120 stage: one
	// lane per number, hopping along a line from 0 to `n`. Each dot is a multiple
	// of that lane's number. If `n` is a multiple the lane's last dot lands on the
	// dashed line (green); if not, the lane misses it and the line shows a warning
	// cross. Dots appear one after another when `playing` turns true. Everything is
	// derived from `n` and `of`, never authored.
	interface Props {
		n: number;
		of: number[];
		playing: boolean;
	}

	let { n, of: lanes, playing }: Props = $props();

	const t = $derived(copy[reader.for(getChapter('factors-and-multiples'))].lanes);
	const LEFT = 26;
	const RIGHT = 190;
	const TOP = 16;
	const gap = $derived(Math.min(24, 96 / Math.max(lanes.length, 1)));
	const x = (v: number) => LEFT + ((RIGHT - LEFT) * v) / n;
	const y = (lane: number) => TOP + lane * gap + 8;
</script>

<line
	x1={x(n)}
	x2={x(n)}
	y1={TOP - 6}
	y2={y(lanes.length - 1) + 8}
	stroke="currentColor"
	stroke-dasharray="3 2"
	opacity="0.6"
/>
<text
	x={x(n)}
	y={TOP - 8}
	text-anchor="middle"
	font-size="8"
	fill="currentColor"
	font-weight="bold"
>
	{n}
</text>

{#each lanes as d, lane (d)}
	{@const hits = isFactor(n, d)}
	<text x="2" y={y(lane) + 3} font-size="8" fill="currentColor">{t.label(d)}</text>
	<line x1={LEFT} x2={RIGHT} y1={y(lane)} y2={y(lane)} stroke="currentColor" opacity="0.25" />
	{#each multiples(d, n) as m, i (m)}
		{@const landing = m === n}
		<circle
			class="dot"
			cx={x(m)}
			cy={y(lane)}
			r={landing ? 3 : 1.8}
			fill={landing ? 'var(--color-success)' : 'currentColor'}
			style:opacity={playing ? 1 : 0}
			style:transition-delay="{playing ? Math.min(i * 40, 600) : 0}ms"
		/>
	{/each}
	{#if !hits}
		<text
			class="dot"
			x={x(n)}
			y={y(lane) + 3}
			text-anchor="middle"
			font-size="10"
			font-weight="bold"
			fill="var(--color-warning)"
			style:opacity={playing ? 1 : 0}
			style:transition-delay="{playing ? 400 : 0}ms">✕</text
		>
	{/if}
{/each}

<style>
	.dot {
		transition: opacity 0.25s ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.dot {
			transition: none;
		}
	}
</style>
