# Transformasi Isometri — Interactive Lessons

An interactive web app that _teaches_ (not merely drills) Form 2 KSSM Mathematics **Chapter 11, Transformasi Isometri**, through manipulable SVG. The chapter is built one **Section** at a time: **Transformation + Congruency** (Section 11.1, the conceptual on-ramp), **Translation** (Section 11.2), and **Reflection** (Section 11.3). Rotation (11.4), combined transformations (11.5), and rotational symmetry (11.6) remain deferred — each is a new interaction model, a separate build (ADR-0008 as amended by ADR-0010).

> The earlier PDF drill generator is superseded but its code is still in the repo, parked at `/generator`. ADR-0001–0007 describe that prior system, not this one.

## Language

Headwords are English (used in code); the Malay term in parentheses is what appears on screen, taken from the textbook.

**Transformation** (_Transformasi_):
A change to an object's position, orientation, or size. Produces an **Image**.
_Avoid_: move, change, manipulation.

**Isometric transformation** (_Transformasi isometri_):
A **Transformation** that preserves shape and size — so its **Image** is **congruent** to the **Object**. Translation, reflection, and rotation are isometric; enlargement is not.
_Avoid_: rigid motion, isometry (in UI text — use the full term).

**Object** (_Objek_):
The original figure, before a **Transformation** is applied.
_Avoid_: original, source, pre-image.

**Image** (_Imej_):
The figure produced by applying a **Transformation** to an **Object**.
_Avoid_: copy, result, output.

**Congruency** (_Kekongruenan_):
The property of two figures having the same shape and size, regardless of position or orientation. The textbook's touchstone: all 10-sen coins are congruent; a 20-sen and a 10-sen are _similar but not congruent_.
_Avoid_: equality, sameness, similarity (similarity is a different concept — same shape, different size).

**Orientation** (_Orientasi_):
The rotational/reflective "facing" of a figure. The distinguishing property among isometries: **Translation** preserves orientation; reflection reverses it.
_Avoid_: direction, angle, rotation.

**Translation** (_Translasi_):
The **Isometric transformation** that slides every point of a figure the same distance in the same direction. Preserves shape, size, **and** orientation. Described by a **Translation vector**.
_Avoid_: slide, move, shift (in domain text).

**Translation vector** (_Vektor translasi_):
The data that fully describes a **Translation**: a direction and magnitude, written as a column vector (units right/left over units up/down) and drawn as an arrow. A translation _is_ its vector.
_Avoid_: direction, arrow (when you mean the vector itself), offset.

**Reflection** (_Pantulan_):
The **Isometric transformation** that flips every point to the opposite side of an **Axis of reflection**, the same perpendicular distance from it. Preserves shape and size but **reverses Orientation** — the **Image** is a mirror image (_songsang_) of the **Object**. A point already on the axis maps to itself.
_Avoid_: flip, mirror (as the name of the transformation), inversion.

**Axis of reflection** (_Paksi pantulan_):
The line a **Reflection** flips across: the perpendicular bisector of the segment joining every **Object** point to its **Image** point. In code a `Line` — for now vertical (`x = h`) or horizontal (`y = k`), with the two textbook axes (_paksi-x_, _paksi-y_) being the `h = 0` / `k = 0` cases; the diagonals `y = ±x` are deferred. Derived from a figure pair via `axisOfReflection`, never authored separately.
_Avoid_: mirror line, line of symmetry, axis (bare).

**Coordinate grid** (_Satah Cartes_):
The Cartesian plane the figures live on: signed `(x, y)` coordinates, an origin, and four quadrants. It is the frame a **Translation vector** is read against — `a` units right/left, `b` units up/down, where up is positive. Introduced in Section 11.2; Section 11.1 deliberately has none, because **Congruency** is about shape and size, not position.
_Avoid_: graph, chart, axes (when you mean the whole plane).

**Section**:
One textbook subsection rendered as one screen and one route (e.g. Section 11.1 at `/transformasi-isometri/11-1`). The app's structure mirrors the textbook's numbering 1:1.
_Avoid_: page, lesson, chapter (a chapter contains sections).

**Beat**:
One stacked segment of a **Section**'s single scrolling screen. A Section is a vertical stack of beats in a fixed order: a concept beat (prose + a scripted reveal), the **Explorable** beat, and the **Latihan** beat. A structural/pedagogical unit, not a code type.
_Avoid_: step, panel, stage, slide.

**Explorable**:
The interactive widget within a **Section** where the student manipulates something and the result updates live — the place where the visualization _is_ the explanation.
_Avoid_: demo, widget, simulation.

**Slide-to-overlay**:
The reveal in which an **Object** slides onto a target figure by the **Translation vector** that maps one onto the other, making "same shape and size, just moved" visible. The motion is always derived from the two figures actually on screen — never a separately-authored vector — so the visual and the geometry cannot drift. In Section 11.1 it is _scripted_ (driven by a button or a committed answer); in Section 11.2 the same mechanic becomes the student-driven **Explorable** (the student sets the **Translation vector**). A non-congruent target lands anchor-on-anchor but visibly fails to coincide — that mismatch is the lesson.
_Avoid_: animation, transition, tween (those name the CSS, not the concept).

**Fold-to-overlay**:
The **Reflection** counterpart of **Slide-to-overlay**: the **Object** folds across the **Axis of reflection** onto its **Image** — scaling to flat _on_ the axis, then unfolding mirrored on the far side — so "opposite side, same perpendicular distance, **Orientation** reversed" becomes visible. Like Slide-to-overlay, the motion is derived from the two figures on screen (their perpendicular bisector is the axis), never authored, so the visual and the geometry cannot drift. Scripted in Section 11.3's concept beat; the "why" reveal in its **Latihan**.
_Avoid_: flip animation, mirror tween.

**Latihan**:
The graded exercise that closes a **Section**: a deck of authored pairs walked one at a time, where the student commits a single answer, sees whether it is correct and a **Slide-to-overlay** "why", then advances to the next pair. The commitment is final — a second answer for the same pair is ignored. Every **Section** has one. What varies between Sections is only the answer (a congruency verdict in 11.1, a **Translation vector** in 11.2, an **Axis of reflection** in 11.3), how the correct answer is derived from the pair (never authored separately), which pairs reveal the "why" on commit, and which reveal plays it (**Slide-to-overlay** in 11.1/11.2, **Fold-to-overlay** in 11.3). Everything else is shared: the stepping (`latihan.ts`) and the rendered chrome — progress counter, the reveal replay, the verdict, the advance — (`LatihanShell.svelte`), which takes each Section's answer input, feedback sentence, and reveal as snippets.
_Avoid_: quiz, drill, test, exercise engine.

## Relationships

- A **Transformation** maps one **Object** to one **Image**.
- An **Isometric transformation** produces an **Image** that is **congruent** to its **Object**.
- A **Translation** is an **Isometric transformation** described by exactly one **Translation vector**; it preserves shape, size, and **Orientation**.
- A **Section** mirrors one textbook subsection and contains at most one primary **Explorable** and one **Latihan**.
- Section 11.2's **Explorable** is vector-controlled: the student sets the **Translation vector**, and the **Image** slides to match while the **Object** stays fixed.
- The **Slide-to-overlay** reveal derives its motion from the geometry seam (`translate`/`translationVector`); Section 11.2's **Explorable** is the same mechanic with a student-controlled **Translation vector** instead of a scripted one.
- A **Reflection** is an **Isometric transformation** described by exactly one **Axis of reflection**; it preserves shape and size but **reverses Orientation**.
- Section 11.3's **Explorable** is axis-controlled: the student sets the **Axis of reflection** (dragging a vertical/horizontal mirror line, toggling between the two), and the **Image** flips live while the **Object** stays fixed.
- The **Fold-to-overlay** reveal derives its fold from the geometry seam (`reflect`/`axisOfReflection`), the **Reflection** counterpart of how **Slide-to-overlay** derives its slide from `translate`/`translationVector`.

## Example dialogue

> **Dev:** "If a student drags the image somewhere random, is that still a translation?"
> **Domain expert:** "Only if every point moved the same way — that's what a single **Translation vector** guarantees. If they could move just one corner, the **Image** would stop being **congruent** to the **Object**, and it wouldn't be a translation at all. The whole figure slides as one, or it isn't a translation."

> **Dev:** "Why does reflection get its own section instead of being another vector?"
> **Domain expert:** "Because reflection reverses **Orientation** — the image faces the other way. Translation never does. They're both isometric, but they're different transformations, so different sections (ADR-0008)."

## Flagged ambiguities

- "Isometric translation" was used loosely to mean both _just translation_ and _the whole isometric-transformations chapter_. Resolved: the project builds the chapter Section by Section — shipped or in progress are **Transformation + Congruency** (11.1), **Translation** (11.2), and **Reflection** (11.3); rotation (11.4), combined transformations (11.5), and rotational symmetry (11.6) remain deferred (ADR-0008 as amended by ADR-0010).
- "Image" in this domain means the transformed figure (_imej_), never a raster/picture file.
- The previous `CONTEXT.md` and ADR-0001–0007 describe the superseded **Math Drill Generator**, not this context.
- The **Slide-to-overlay** entry says a non-congruent target's visible failure-to-coincide "is the lesson," implying the reveal should play for non-congruent **Latihan** pairs in Section 11.1. The shipped 11.1 **Latihan** plays it _only_ for congruent pairs (its `revealsWhy`), so a non-congruent pair currently shows no slide. Unresolved: either 11.1 should play the reveal for every pair (and `revealsWhy` becomes always-true there, matching 11.2), or the doc overstates and the congruent-only rule stands. The `latihan.ts` seam accommodates either — it is a one-line change to the Section's `revealsWhy`.
