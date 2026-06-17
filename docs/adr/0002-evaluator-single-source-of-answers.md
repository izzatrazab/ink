# The Evaluator is the single source of a Question's answer

Every answer is computed by one shared `evaluate(operands, operator)` in `src/lib/questions/evaluate.ts`. A Generator picks valid operands and an operator; it never hand-writes the answer arithmetic.

We did this because answer computation was previously duplicated inline in every drill (`reduce` to sum, `a / b`, etc.), which is where the Standard-6 division bug hid (fractional answers). With one evaluator, a generator's only job is to guarantee its operands are _valid for the grade_, and correctness becomes a single testable claim: "the answer the generator carries equals `evaluate` of its own operands."

## Consequences

- The Generator owns grade validity (e.g. division must pick operands that divide evenly); the Evaluator owns the arithmetic. Pushing answer math back into a generator re-opens the duplication this prevents.
