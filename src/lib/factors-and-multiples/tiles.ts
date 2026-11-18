// Layout for the tile array: where each of `total` tiles sits when put into rows
// of `perRow`, and how the whole array scales to fit a viewport. Pure geometry,
// kept apart from the Svelte component so it can be tested. Positions are in
// "tile units" (one tile = 1); the component applies `scale`/`offset` once on the
// group, so tiles can glide between layouts with plain CSS transitions.

export interface TileLayout {
	/** Tiles in reading order. `full` is false for the leftover (incomplete) last row. */
	tiles: { col: number; row: number; full: boolean }[];
	/** Tile units → viewport units. */
	scale: number;
	/** Where the array's top-left sits in the viewport, centring it. */
	offsetX: number;
	offsetY: number;
}

export function tileLayout(
	total: number,
	perRow: number,
	width: number,
	height: number,
	maxTile = 20
): TileLayout {
	const cols = Math.min(perRow, total);
	const rows = Math.ceil(total / perRow);
	const fullCount = total - (total % perRow);
	const scale = Math.min(width / cols, height / rows, maxTile);
	return {
		tiles: Array.from({ length: total }, (_, i) => ({
			col: i % perRow,
			row: Math.floor(i / perRow),
			full: i < fullCount
		})),
		scale,
		offsetX: (width - cols * scale) / 2,
		offsetY: (height - rows * scale) / 2
	};
}
