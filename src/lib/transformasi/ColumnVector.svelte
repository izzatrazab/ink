<script lang="ts">
	import type { Vector } from './geometry';

	// The column-vector notation for a Translation vector: a (a over b) stack in
	// matrix brackets. Presentational — it reads the same Vector the Image and
	// arrow derive from, so the notation on screen always matches the geometry.
	interface Props {
		value: Vector;
	}

	let { value }: Props = $props();
</script>

<span
	class="inline-flex items-stretch gap-1 align-middle font-mono text-2xl leading-none"
	role="math"
	aria-label={`Vektor translasi: a sama dengan ${value.dx}, b sama dengan ${value.dy}`}
>
	<span class="border-current rounded-l border-t-2 border-b-2 border-l-2 px-1" aria-hidden="true"
	></span>
	<span class="flex flex-col justify-center gap-1 py-1 text-center tabular-nums">
		<span>{value.dx}</span>
		<span>{value.dy}</span>
	</span>
	<span class="border-current rounded-r border-t-2 border-r-2 border-b-2 px-1" aria-hidden="true"
	></span>
</span>
