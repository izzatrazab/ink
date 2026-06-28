# Expand scope from Translation-only to a section-by-section isometry build

ADR-0008 deliberately collapsed scope to **Translation (11.2)** plus its on-ramp (**11.1**), deferring reflection, rotation, combined transformations, and rotational symmetry as "rewards" to be unlocked only once 11.1–11.2 shipped _finished and deep_. We are reversing that one "no": the project will build the rest of Chapter 11 **one Section at a time**, starting with **Reflection (Section 11.3)** — even though 11.1 and 11.2 are admittedly still rough, not the polished tiles ADR-0008 set as the precondition.

## Why

The goal is portfolio and skill growth (ADR-0008). Building a second, structurally _different_ interaction model — a draggable **Axis of reflection** with an orientation-reversing **Fold-to-overlay** reveal — demonstrates more range than further polishing Translation, and reflection is the natural next concept: it reuses the geometry seam, the **Coordinate grid**, the `latihan.ts` deck-walker, and the lesson shell, so most of the work is content plus one new interaction, not a new platform. Each later Section remains its own build, added only when chosen — this is _not_ a commitment to finish all of Chapter 11.

## Consequences

- This **supersedes only the "Translation, not the whole isometric family" decision in ADR-0008**. The rest of ADR-0008 stands unchanged: one topic done well over breadth, SVG over canvas, the drill generator parked-not-deleted, routes mirroring the textbook 1:1. ADR-0009's Cartesian convention is inherited as-is (`reflect` works in Cartesian; the y-flip stays at the render boundary).
- The depth-first discipline is now a standing risk, not a guarantee. With 11.1/11.2 rough and 11.3 added, the "graveyard of half-built topics" ADR-0008 warned against is the failure mode to watch: polishing earlier Sections now competes with adding new ones. The mitigation is to keep each new Section a _finished_ slice rather than starting 11.4 before 11.3 is whole.
- `CONTEXT.md`'s scope statement and its "reflection out of scope" flagged ambiguity are updated to match. Rotation (11.4), combined transformations (11.5), and rotational symmetry (11.6) remain deferred until separately chosen.
