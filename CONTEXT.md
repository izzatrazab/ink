# Transformasi Isometri — Interactive Lessons

An interactive web app that _teaches_ (not merely drills) Form 2 KSSM Mathematics **Chapter 11, Transformasi Isometri**, through manipulable SVG. Scope is deliberately one topic: **Translation** (Section 11.2), with **Transformation + Congruency** (Section 11.1) as its conceptual on-ramp. The other isometries are out of scope (ADR-0008).

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

**Section**:
One textbook subsection rendered as one screen and one route (e.g. Section 11.1 at `/transformasi-isometri/11-1`). The app's structure mirrors the textbook's numbering 1:1.
_Avoid_: page, lesson, chapter (a chapter contains sections).

**Explorable**:
The interactive widget within a **Section** where the student manipulates something and the result updates live — the place where the visualization _is_ the explanation.
_Avoid_: demo, widget, simulation.

**Slide-to-overlay**:
The reveal in which an **Object** slides onto a target figure by the **Translation vector** that maps one onto the other, making "same shape and size, just moved" visible. The motion is always derived from the two figures actually on screen — never a separately-authored vector — so the visual and the geometry cannot drift. In Section 11.1 it is _scripted_ (driven by a button or a committed answer); in Section 11.2 the same mechanic becomes the student-driven **Explorable** (the student sets the **Translation vector**). A non-congruent target lands anchor-on-anchor but visibly fails to coincide — that mismatch is the lesson.
_Avoid_: animation, transition, tween (those name the CSS, not the concept).

## Relationships

- A **Transformation** maps one **Object** to one **Image**.
- An **Isometric transformation** produces an **Image** that is **congruent** to its **Object**.
- A **Translation** is an **Isometric transformation** described by exactly one **Translation vector**; it preserves shape, size, and **Orientation**.
- A **Section** mirrors one textbook subsection and contains at most one primary **Explorable**.
- Section 11.2's **Explorable** is vector-controlled: the student sets the **Translation vector**, and the **Image** slides to match while the **Object** stays fixed.
- The **Slide-to-overlay** reveal derives its motion from the geometry seam (`translate`/`translationVector`); Section 11.2's **Explorable** is the same mechanic with a student-controlled **Translation vector** instead of a scripted one.

## Example dialogue

> **Dev:** "If a student drags the image somewhere random, is that still a translation?"
> **Domain expert:** "Only if every point moved the same way — that's what a single **Translation vector** guarantees. If they could move just one corner, the **Image** would stop being **congruent** to the **Object**, and it wouldn't be a translation at all. The whole figure slides as one, or it isn't a translation."

> **Dev:** "Why does reflection get its own section instead of being another vector?"
> **Domain expert:** "Because reflection reverses **Orientation** — the image faces the other way. Translation never does. They're both isometric, but they're different transformations, so different sections (ADR-0008)."

## Flagged ambiguities

- "Isometric translation" was used loosely to mean both _just translation_ and _the whole isometric-transformations chapter_. Resolved: the project scope is **Translation** (Section 11.2) plus its on-ramp (Section 11.1); reflection, rotation, glide reflection, and rotational symmetry are out of scope (ADR-0008).
- "Image" in this domain means the transformed figure (_imej_), never a raster/picture file.
- The previous `CONTEXT.md` and ADR-0001–0007 describe the superseded **Math Drill Generator**, not this context.
