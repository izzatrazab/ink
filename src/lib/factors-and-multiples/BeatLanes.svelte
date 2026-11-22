<script lang="ts">
	import { isMeeting } from './meetAgain';
	import { multiples } from './numbers';
	import { laneY } from './lanes';
	import { useCopy } from './useCopy';

	// Meet Again's lights as lanes, growing beat by beat: a dot for every beat a light
	// was lit so far, and a bigger green one where they were all lit at once. Shown
	// only in step-by-step mode, which has no clock and is for thinking: in timed
	// play it would hand the student every meeting. Drawn in the same 200-wide stage
	// as the lanes in 2.2 and 2.3. Everything is derived from the periods and the
	// beat, never authored.
	interface Props {
		periods: number[];
		beat: number;
	}
	let { periods, beat }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t.lanes);
	const LEFT = 26;
	const RIGHT = 190;
	// The lanes start at a fixed width and compress as the Round runs on, so nothing jumps.
	const span = $derived(Math.max(beat, 24));
	const x = (b: number) => LEFT + ((RIGHT - LEFT) * (b - 1)) / (span - 1);
	const y = (lane: number) => laneY(lane, periods.length);
</script>

{#each periods as period, lane (period)}
	<line x1={LEFT} x2={RIGHT} y1={y(lane)} y2={y(lane)} stroke="currentColor" opacity="0.25" />
	<text x="2" y={y(lane) + 3} font-size="8" fill="currentColor">{t.label(period)}</text>
	{#each multiples(period, beat) as b (b)}
		{#if !isMeeting(periods, b)}
			<circle cx={x(b)} cy={y(lane)} r="1.8" fill="currentColor" />
		{/if}
	{/each}
{/each}
{#each Array.from({ length: beat }, (_, i) => i + 1).filter((b) => isMeeting(periods, b)) as b (b)}
	{#each periods as _, lane (lane)}
		<circle cx={x(b)} cy={y(lane)} r="3" fill="var(--color-success)" />
	{/each}
{/each}
{#if beat > 0}
	<line
		x1={x(beat)}
		x2={x(beat)}
		y1={y(0) - 7}
		y2={y(periods.length - 1) + 7}
		stroke="currentColor"
		stroke-dasharray="2 2"
		opacity="0.6"
	/>
{/if}
