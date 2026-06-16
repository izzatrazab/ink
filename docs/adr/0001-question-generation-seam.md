# Question generation is separate from drawing

A Drill's number-picking logic (the **Generator**) lives in `src/lib/questions/` as pure functions that return a **Question** (`{operands, operator, answer}`) and contain no `pdfkit`, no server-only code, and no `$lib` alias imports. The drill classes under `src/lib/server/` only *draw* pre-generated Questions.

We did this because the educational correctness of a worksheet (grade-appropriate operands, no negative subtraction, exact division) previously existed only as a side effect of drawing into a PDF, so it could not be tested. Keeping the question layer pure makes it the test surface — invariants are asserted over thousands of generated Questions with no PDF involved.

## Consequences

- A new drill is added by writing a pure Generator + tests first, then a thin drawing class that consumes `Question[]`.
- The questions layer must stay free of `pdfkit`/server imports, or it stops being independently testable. Treat a `$lib`/`pdfkit` import creeping into `src/lib/questions/` as a regression.
