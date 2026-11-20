<script lang="ts">
	import { useCopy } from './useCopy';
	import { hcf } from './numbers';
	import { laneY } from './lanes';

	// The HCF counterpart of <MultipleLanes>, drawn in the same 200 × 120 stage: one
	// lane per number, its length proportional to the number, cut into equal pieces
	// of the HCF. Every lane divides into whole pieces — that is what "goes into
	// every number" looks like. Pieces appear one after another when `playing` turns
	// true. Everything is derived from `of`, never authored.
	interface Props {
		/** One entry per lane; null is a lane still empty (drawn as a bare line). */
		of: (number | null)[];
		playing: boolean;
		/** Whether to write each lane's number (off when inputs sit there instead). */
		labels?: boolean;
	}

	let { of: lanes, playing, labels = true }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t.lanes);
	const LEFT = 26;
	const RIGHT = 168;
	const TOP = 16;
	const valid = $derived(lanes.filter((v): v is number => v !== null));
	// An all-empty set (the student has not typed yet) draws bare lanes only.
	const size = $derived(valid.length ? hcf(valid) : 1);
	const longest = $derived(valid.length ? Math.max(...valid) : 1);
	const x = (v: number) => LEFT + ((RIGHT - LEFT) * v) / longest;
	const y = (lane: number) => laneY(lane, lanes.length);
</script>

{#if valid.length}
	<text
		class="fade"
		x={(LEFT + RIGHT) / 2}
		y={TOP - 8}
		text-anchor="middle"
		font-size="8"
		fill="currentColor"
		font-weight="bold"
		style:opacity={playing ? 1 : 0}
	>
		{t.piece(size)}
	</text>
{/if}

{#each lanes as v, lane (lane)}
	<line x1={LEFT} x2={RIGHT} y1={y(lane)} y2={y(lane)} stroke="currentColor" opacity="0.25" />
	{#if v !== null}
		{@const count = v / size}
		{#if labels}
			<text x="2" y={y(lane) + 3} font-size="8" fill="currentColor">{v}</text>
		{/if}
		{#each { length: count } as _, i (i)}
			<rect
				class="fade"
				x={x(i * size) + 0.6}
				y={y(lane) - 5}
				width={x(size) - x(0) - 1.2}
				height="10"
				rx="1.5"
				fill="currentColor"
				opacity="0.35"
				style:opacity={playing ? 0.35 : 0}
				style:transition-delay="{playing ? Math.min(i * 80, 700) : 0}ms"
			/>
		{/each}
		<text
			class="fade"
			x={RIGHT + 4}
			y={y(lane) + 3}
			font-size="7"
			fill="currentColor"
			style:opacity={playing ? 1 : 0}
			style:transition-delay="{playing ? 500 : 0}ms">= {count} × {size}</text
		>
	{/if}
{/each}

<style>
	.fade {
		transition: opacity 0.25s ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.fade {
			transition: none;
		}
	}
</style>
