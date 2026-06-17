# Long division joins the seam on its own shape

`LongDivisionMethod` is now migrated across the Generator/Evaluator seam (ADR-0001, ADR-0002), but on a shape of its own — the **Long-division problem** `{ dividend, divisor, quotient, remainder }` — not the `{operands, operator, answer}` **Question**. This carries out the door ADR-0003 left open: _"if long division is ever brought under a seam, it should get its own shape, not an extension of Question."_ ADR-0003's status as "parked / not migrated" is superseded by this ADR; its reasoning (the answer is a quotient _and_ a remainder) is what the new shape implements.

Operand selection and the grade invariant now live in a pure Generator, `generateLongDivision(difficulty, hasRemainder)` under `src/lib/questions/long-division/`. The answer is computed by a shared **Long-division evaluator**, `longDivide(dividend, divisor) → { quotient, remainder }`, the same single-source-of-answers discipline ADR-0002 set for the **Evaluator**. The Generator guarantees: the divisor is single-digit and `≥ 2`; difficulty sizes the dividend only (preserving the old drill's hardcoded single-digit divisor, now explicit instead of buried); `remainder > 0` exactly when `hasRemainder`; and `quotient * divisor + remainder === dividend`. These are asserted as property tests over thousands of generated problems — the test surface long division never had, because its operand-picking and the remainder re-roll previously lived inside `LongDivisionMethod.drawAllQuestions` (a `pdfkit` loop).

## The answer-sheet output changes on purpose

The old answer sheet never printed a remainder. For remainder problems it printed a truncated decimal — `Math.floor((num / divisor) * 100) / 100` then `toFixed(2)`, so `17 ÷ 5` rendered as "3.40". That was a placeholder bug, not a decimal-division feature: the `has_remainder` flag exists precisely to generate problems whose answer _is_ a remainder, and truncating it to a decimal hid the thing the worksheet is teaching. The migration deliberately changes the rendered answer sheet to show quotient + remainder.

There are still no rendering tests (ADR-0004, ADR-0005). This answer change is therefore verified by the pure layer — the `quotient`/`remainder` the drawing code now reads are the property-tested output of `longDivide` — not by golden-PDF comparison. A rendering harness remains the natural next step before further drawing changes.

## Consequences

- A long-division Generator picks a valid dividend/divisor; it never hand-writes the quotient or remainder. Pushing that arithmetic back into the generator (or into the drawing code, as before) re-opens exactly the untestable-correctness problem ADR-0001/ADR-0002 closed for the other drills.
- The **Long-division problem** is its own shape on purpose. Do not fold `dividend`/`divisor` into a generic `operands` array — their roles are asymmetric — and do not add `remainder` to the common **Question** to make one drill fit (the reason ADR-0003 parked it in the first place).
