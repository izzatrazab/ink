# ColumnMethod is in the Question seam but stays standalone

`ColumnMethod` (`src/lib/server/ColumnMethod.ts`) was migrated across the **Question** seam (ADR-0001, ADR-0002): it renders a pre-generated `Question[]` from `generateColumnMethod` and reads each answer from the **Evaluator** instead of picking operands and computing answers inline. But unlike the other in-seam drills, it deliberately keeps extending `PDFDocument` directly rather than `DrillBase`.

ColumnMethod produces a different **Worksheet**: it carries difficulty levels (easy/medium/hard digit counts), a cartoon difficulty title box, and a grid-positioned **Answer sheet** where each answer sits where its question sat. `DrillBase` provides none of these — it renders one inline/column presentation with a 3-column answer list. Folding ColumnMethod into `DrillBase` would mean porting all of that onto the base or losing it, and there are no rendering tests to catch a regression. Keeping it standalone won the educational-correctness gain (operands and answers through the pure seam) at zero rendering risk.

The per-question **Operator** is still drawn from the drill's `operation_symbol`, not from `question.operator`, so the worksheet stays pixel-identical (it preserves the `−` minus glyph). The seam owns operand selection and answer arithmetic; the display glyph is a rendering concern and stays in the drawing layer.

This is recorded so a future architecture pass does not flag ColumnMethod as "the one in-seam drill that doesn't extend `DrillBase`" and try to unify it. If the drills' rendering is ever consolidated, ColumnMethod's difficulty title and grid answer sheet must be carried over, and the migration must stay verified by rendering output — not by construction alone.
