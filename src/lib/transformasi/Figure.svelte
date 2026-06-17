<script lang="ts">
	import type { Shape } from './geometry';

	// Draws a Shape as an SVG <polygon>. Thin and presentational: props in,
	// SVG out, no business logic. Colour defaults to `currentColor` so the
	// caller can theme the figure through the surrounding CSS cascade.
	interface Props {
		shape: Shape;
		fill?: string;
		stroke?: string;
		strokeWidth?: number;
	}

	let { shape, fill = 'currentColor', stroke = 'none', strokeWidth = 0 }: Props = $props();

	const points = $derived(shape.points.map((p) => `${p.x},${p.y}`).join(' '));
</script>

<polygon {points} {fill} {stroke} stroke-width={strokeWidth} />
