# Math Drill Generator

Generates printable, bilingual (English / Malay) PDF maths worksheets for Malaysian primary-school grades. Each worksheet is a grid of arithmetic questions plus an answer sheet.

## Architecture

Two layers, separated by the **Question** seam:

- **`src/lib/questions/`** — the pure layer. Generators pick operands; the Evaluator computes answers. No `pdfkit`, no server code. This is where the maths lives and where it is tested. (ADR-0001, ADR-0002)
- **`src/lib/server/`** — the drawing layer. Drill classes only render pre-generated Questions onto the page (most extend `DrillBase`, a `pdfkit` document; ColumnMethod is standalone — ADR-0004). Routes under `src/routes/exports/` turn a Drill into a PDF HTTP response. The grade Drills (Standard 1 and Standard 6) are reached through one **Drill registry** (`src/lib/server/exports/registry.ts`) behind a single `[type]` route per grade; ColumnMethod and LongDivisionMethod keep their own routes (ADR-0007).

To understand a drill, read its Generator (the rules) and its drawing class (the layout) — they are separate on purpose. Long division sits in the seam too, but on its own shape (the **Long-division problem**, not the **Question**) with its own evaluator (ADR-0003).

## Language

**Drill**:
One kind of worksheet — a specific grade + operation + presentation (e.g. "Standard 1 Subtraction, standard form"). Implemented today as a class.

**Worksheet**:
The rendered PDF a Drill produces: N question pages followed by an answer sheet.
_Avoid_: document, sheet (when you mean the whole thing).

**Question**:
The data for one arithmetic problem, independent of how it is drawn: a list of operands, one operator, and one answer. Shape: `{ operands: number[]; operator: string; answer: number }`.
_Avoid_: problem, sum, equation.

**Generator**:
The part of a Drill that picks a Question's operands and operator so they are valid for that grade (e.g. Standard-1 subtraction never goes negative; division divides evenly). It does not draw and does not compute the answer.
_Avoid_: builder, factory.

**Evaluator**:
The single shared function that computes a Question's answer from its operands and operator (`+` sum, `-` fold-subtract, `×` product, `÷` fold-divide). One true source of answers.

**Long-division problem**:
The data for one long-division item — its own shape, distinct from a **Question** because the answer is two numbers, not one (ADR-0003). Shape: `{ dividend: number; divisor: number; quotient: number; remainder: number }`. The `divisor` is single-digit and `≥ 2`; difficulty sizes the `dividend` only. `remainder > 0` exactly when the drill asks for remainder problems.
_Avoid_: dividing the dividend and divisor into a generic `operands` array — their roles are asymmetric.

**Long-division evaluator**:
The shared `longDivide(dividend, divisor) → { quotient, remainder }` — the one true source of a **Long-division problem**'s answer, the same role the **Evaluator** plays for a **Question** (ADR-0002, ADR-0003). A long-division Generator picks a valid dividend/divisor; it never hand-writes the quotient or remainder.

**Operator**:
The arithmetic symbol of a Question: `+`, `-`, `×`, `÷`.
_Avoid_: operation symbol, sign.

**Standard**:
A Malaysian primary grade (Standard / Tahun 1–6). Sets the difficulty rules a Generator must satisfy.
_Avoid_: grade, level, year (in code/identifiers).

**Inline form**:
A presentation style that draws a Question on one line: `n)  a + b = `.

**Column form** (a.k.a. standard form / _bentuk lazim_):
A presentation style that stacks the operands vertically for column arithmetic.
_Avoid_: vertical form.

**Answer sheet**:
The final section of a Worksheet listing every Question's answer.
_Avoid_: answer key, marking scheme.

## Relationships

- A **Drill** owns a **Generator** and renders in either **Inline form** or **Column form**.
- A **Generator** produces **Questions**; the **Evaluator** fills in each Question's answer.
- A **Drill** produces one **Worksheet** = question pages (drawn from the Questions) + one **Answer sheet** (drawn from the same Questions).
- A **Standard** constrains what operands a **Generator** may pick.

## Example dialogue

> **Dev:** "Where does Standard-6 division make sure the answer is a whole number?"
> **Domain expert:** "That's the **Generator's** job — it must only pick operands that divide evenly. The **Evaluator** just computes `a ÷ b`; it trusts the operands are valid."

## Flagged ambiguities

- "Drill" was used loosely for both the class and the PDF — resolved: the class is a **Drill**, the PDF it produces is a **Worksheet**.
- Long division does **not** fit the `{operands, operator, answer}` **Question** shape (it has a quotient *and* a remainder). Resolved: it has its own **Long-division problem** shape and its own **Long-division evaluator**, inside the same Generator/drawing seam (ADR-0003). Earlier the answer sheet printed a truncated decimal (`17 ÷ 5` → "3.40") and showed no remainder at all — that was a bug, not a decimal-division feature.
