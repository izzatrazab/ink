# The Column-form rendering primitive is shared, even though the drill classes are not

The code that draws one Question in **Column form** — stacked operands, the operator glyph, and the working/answer rule lines — now lives once as `drawColumnForm` in `src/lib/utils/draw.ts`. Both `DrillBase.drawColumnMethod` (used by the standard-form drills) and `ColumnMethod.drawColumnMethod` delegate to it.

Previously this drawing code was copy-pasted verbatim into both classes; the only difference was that `ColumnMethod` drew an extra middle rule line for multi-digit multiplication while `DrillBase` left that block commented out. Two callers rendering the same presentation through duplicated layout math is the seam ADR-0001 names (Column form) without an adapter — delete either copy and the offset arithmetic reappears.

ADR-0004 keeps the drill *classes* separate (ColumnMethod has its own difficulty title box and grid Answer sheet, and stays standalone). This ADR is recorded so a future pass does not read ADR-0004 as "their rendering must stay separate too" and re-duplicate the primitive. The classes stay apart; the per-Question Column-form drawing does not.

`drawColumnForm` stays domain-agnostic: it takes the operands, the **glyph** to display, and an optional `middleLineGap`. It knows nothing about operations or difficulty. The glyph is passed in (not read from `question.operator`) because the displayed symbol is a rendering choice that can differ from the operator — ColumnMethod still passes the `−` minus glyph (ADR-0004). The multiplication middle-line policy (`operation === 'multiplication' && second_number_of_digits > 1`) stays inside `ColumnMethod`, which owns operation and difficulty; it expresses that policy by passing `middleLineGap`, not by teaching the primitive about it.

## Consequences

- A change to how a column problem is laid out (spacing, line positions, glyph placement) is made once. Pushing operation- or difficulty-specific logic into `drawColumnForm` re-couples it to the domain ADR-0004 keeps in `ColumnMethod` — express such differences as parameters instead.
- There are still no rendering tests (see ADR-0004), so this extraction is verified by construction — the shared body is the two former copies, and each call site passes the same arguments it passed before. A rendering harness (golden-PDF comparison with seeded randomness) remains the natural next step before any further rendering consolidation.
