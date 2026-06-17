# Long division is intentionally outside the Question shape

`LongDivisionMethod` is deliberately _not_ migrated to the `{operands, operator, answer}` **Question** shape, and is excluded from the Generator/Evaluator seam (ADR-0001, ADR-0002).

A long-division problem has both a quotient and a remainder and a distinct stepwise visual, so it does not fit a single `answer: number` or share the inline/column renderers. Forcing it into the common Question type would add `remainder`/partial-step fields that only one drill uses, making the common case pay for the rare one.

This is recorded so a future architecture pass does not flag long division as "the one drill that wasn't migrated" and try to fold it in. If long division is ever brought under a seam, it should get its own shape, not an extension of Question.
