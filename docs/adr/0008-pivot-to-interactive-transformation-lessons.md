# Pivot from drill generator to interactive transformation lessons

This project was a printable PDF math-drill generator (ADR-0001 through ADR-0007 describe that system). It is being redirected to an **interactive, self-teaching web lesson** built around manipulable SVG — the kind of "explorable" that teaches the _why_ of an idea, not just drills its mechanics. The drill generator is superseded, but its code is **parked, not deleted** (see Consequences); ADR-0001–0007 now document a prior system.

## Why the pivot

The drill generator's stated purpose (a side-income product selling worksheet PDFs) failed in market, and arithmetic drills teach nothing the learner doesn't already mostly know — there is no "why" in `7 + 5` worth visualizing. The honest goal of the rebuild is **portfolio and skill growth**, not reach or income: something the author is proud of, that exercises modern interactive-UI and pedagogy engineering, and that demonstrably teaches a student who is stuck — the qualities the author admires in GeoGebra.

## Why this scope (the explicit no's)

The aspiration — "GeoGebra-level interactive learning" — is unbounded and, taken literally, a graveyard of half-built topics. A _finished, deep_ single tile is a better portfolio piece and a better learning experience than a broad, half-built clone. So the scope is deliberately collapsed:

- **One topic, not a platform.** Form 2 KSSM Mathematics **Chapter 11, Transformasi Isometri**, and within it only **Section 11.2 (Translation)** as the interactive heart, plus **Section 11.1 (Transformation + Congruency)** as its lightweight conceptual on-ramp.
- **Translation, not the whole isometric family.** Reflection (11.3), rotation (11.4), combined transformations (11.5), and rotational symmetry (11.6) are **deferred rewards**, unlocked only if 11.1–11.2 ship complete. Each adds a _new interaction model_ (mirror line, center + angle), i.e. a separate build — not "just another case."
- **Translation was chosen on purpose.** Of the isometries it is the most visually self-evident (drag, it slides) and the cheapest to build, while still unmistakably "interactive math." Critically, SVG's native `transform="translate(x, y)"` _is_ a translation by a vector — the rendering primitive and the concept being taught are the same object (see below), so the topic and the technology reinforce each other.

## Why SVG over canvas

Shapes and grids render as **SVG DOM elements**, not canvas pixels. SVG is declarative (it marries Svelte 5 runes — a shape is an element bound to `$state`, no manual redraw loop), gives free pointer hit-testing for dragging, stays crisp and accessible and inspectable, and — the deciding reason — its `transform` attribute literally expresses the math the chapter teaches. Canvas's advantages (thousands of objects, pixel effects, game-loop animation) do not apply to a handful of polygons on a grid; its costs (imperative repaint, hand-rolled hit-testing) all do.

## Consequences

- **The old drill code is parked, not deleted.** The PDF/`pdfkit` layer, the Question/Generator/Evaluator seam, and the `/generator` UI remain reachable but orphaned. Removing them is a deliberate, separate cleanup to be done _after_ 11.1–11.2 prove the new direction sticks — not a prerequisite for building the lessons. Until then, ADR-0001–0007 and the original `CONTEXT.md` glossary still describe code that is really in the repo.
- **New front door.** The app lands on the chapter (`/transformasi-isometri/`) with sections at `/transformasi-isometri/11-1`, `/transformasi-isometri/11-2`. Routes mirror the textbook's numbering 1:1.
- **No lesson framework upfront.** 11.1 is built as one concrete route. The shared lesson shell (chrome, navigation, section layout) is _extracted_ when 11.2 arrives and the genuine commonality is visible — the same "deepen a seam once a second case appears" discipline as ADR-0005 and ADR-0007. Building a generic "lesson engine" before two real lessons exist is the failure mode to avoid.
- **Content is Malay** (matching the KSSM textbook and the student's own words: _translasi, imej, objek, kongruen_), with strings kept in one place so an English translation can be added later as an additive enhancement — not built now.
