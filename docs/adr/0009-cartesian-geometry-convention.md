# Geometry is Cartesian; the y-flip lives at the render boundary

The `transformasi` geometry seam (`geometry.ts`, and the new `grid.ts`) treats its coordinates as **Cartesian** — signed `(x, y)` with **y increasing upward**, matching the textbook and `CONTEXT.md`'s definition of a **Translation vector** (`a` right/left over `b` up/down, up positive). The SVG y-down flip happens only at the render edge, inside a pure `toPx({x, y})` function in `grid.ts`, never as an SVG `transform`. Pages compute everything (translate, translationVector) in Cartesian space and map shapes through `toPx` just before handing them to `<Figure>`.

We did this so the column vector a student sees on screen is *literally* the `Vector {dx, dy}` in code: dialing `b = +3` ("3 up") moves the image up, with no sign inversion hidden anywhere. That keeps the "visual and logic cannot drift" discipline the geometry seam was built for (ADR-0008): the seam stays the honest single source of truth for where the image goes, in the same coordinate language the chapter teaches.

## Considered options

- **SVG-space seam with inverted input** — keep coordinates y-down and map "up" to `dy = −b` at the input boundary. Rejected: the seam's numbers would no longer match the taught concept, reintroducing exactly the drift we forbid.
- **The flip as an SVG `transform` on `<Stage>`** (e.g. `scale(1, -1)` or a negative-height viewBox). Rejected: it renders all text — axis tick labels, the column-vector readout — upside down. A pure `toPx` keeps text upright while still flipping figures and arrows.
- **Author 11.2 shapes so the picture happens to look right** with no principled rule. Rejected: that is the drift, not a fix for it.

## Consequences

- Two coordinate conventions coexist deliberately: Section 11.1's shipped shapes stay authored in raw SVG px (untouched), while Section 11.2 onward works in Cartesian and renders via `toPx`. `<Stage>`/`<Figure>` remain px-only and presentational; the page owns the Cartesian→px mapping.
- `grid.ts` joins `geometry.ts` as a pure, framework-free, Vitest-tested module (`toPx` + flip, `snap`/`toCartesian`, `clamp`). An SVG/DOM import creeping into either is a regression, same as ADR-0008.
- Later sections (reflection, rotation) inherit the Cartesian convention; reversing it would mean re-authoring shapes and the mapping layer, which is why it is recorded here.
