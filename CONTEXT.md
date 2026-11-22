# Transformasi Isometri — Interactive Lessons

An interactive web app that _teaches_ (not merely drills) Form 2 KSSM Mathematics **Chapter 11, Transformasi Isometri**, through manipulable SVG. The chapter is built one **Section** at a time: **Transformation + Congruency** (Section 11.1, the conceptual on-ramp), **Translation** (Section 11.2), and **Reflection** (Section 11.3). Rotation (11.4), combined transformations (11.5), and rotational symmetry (11.6) remain deferred — each is a new interaction model, a separate build (ADR-0008 as amended by ADR-0010).

> The site now hosts more than one chapter (ADR-0011): the chapter registry in `src/lib/chapters.ts` lists them, and `/` is a chapter index. Form 1 Chapter 2, **Factors and Multiples** (`/factors-and-multiples`, written in English to follow its textbook), has Sections 2.1, 2.2 and 2.3 built plus a **Mini-games hub** (Prime Hunt, Prime Breaker, Multiples Hunt and Meet Again, ADR-0012), and offers Malay as a translation (see **Prime Breaker**:
The second **Mini-game**, in Factors and Multiples: a **Round** hands the student a **Division ladder** to finish by tapping primes (2, 3, 5, 7, 11, 13). Every tap is judged at once by the ladder's own rules (`ladder.ts`): a prime that fits drops a new row with a chime; one that does not is refused with a buzz and the same reason the lesson gives ("180 ÷ 7 leaves 5, so 7 does not go in"). There is no hint, undo or Watch, and the prime buttons stay above the ladder so they do not move as it grows. Played in three **Break kinds**.
_Avoid_: factor tree game, ladder game.

**Round**:
One ladder in **Prime Breaker**: a start row dealt for a **Break kind**, finished when the ladder's own rule says it is done (every number is 1; for HCF, when no prime goes into every number). Untimed, scored 1–3 stars by mistakes (none, one, more); tapping the same refused prime again on the same rung counts once. A perfect Round earns confetti. A Round with no mistake is a **clean Round**.
_Avoid_: level, board (that word is **Prime Hunt**'s), question.

**Break kind**:
What a **Round** asks the student to break: prime factors of one number (**single** ladder mode), the HCF of two or three numbers, or their LCM. The kinds unlock in that order, each after three **clean Rounds** of the one before. Dealt numbers need only the offered primes, and an HCF Round always has an HCF above 1. Progress is kept in the reader's browser.
_Avoid_: level, tier (that word is **Prime Hunt**'s), mode (that is the ladder's).

**Multiples Hunt**:
The third **Mini-game**, in Factors and Multiples: a **Board** of 16 numbers appears and the student taps every multiple of one number, or every **common multiple** of two or three. Every tap is judged at once from the number seam. The traps are the lesson: in a common-multiple Board most wrong numbers are a multiple of one of the numbers but not all of them, and the wrong tap says so ("8 is a multiple of 4, but not of 6: 8 ÷ 6 leaves 2"). A finished Board shows that every common multiple is a multiple of the LCM. Played in three **Hunt kinds**; shares the Board's look and sounds with **Prime Hunt** through `NumberBoard.svelte`.
_Avoid_: times-table drill, multiples quiz.

**Hunt kind**:
What a **Multiples Hunt** Board asks for: multiples of one number, common multiples of two, or of three. Unlocks in that order, each after three **clean Boards** of the one before (a clean Board has no wrong tap). Dealt sets never have one number a multiple of all the rest, and every Board has at least three multiples to find. Progress is kept in the reader's browser.
_Avoid_: level, tier (that word is **Prime Hunt**'s), mode.

**Meet Again**:
The fourth **Mini-game**, in Factors and Multiples, and the only one with a clock. Two or three lights each blink every so many **beats** (a light with period 4 is lit on beats 4, 8, 12, …); the student taps **Together!** on the beats where every light is lit at once. Those are the common multiples of the periods, so the first is their LCM, found by feel. A tap is judged against the beat now lit; a tap on any other beat is a slip, and so is a meeting that passes untapped. A finished Round shows the lights as lanes landing on the LCM. The speed is the student's choice (**step by step** has no clock at all, then slow, then normal), a timed Round pauses when the tab is hidden, a lit light says ON as well as glowing, and nothing blinks faster than the beat. Beats tick softly and identically, so the sound never gives a meeting away.
_Avoid_: rhythm game, reaction game, timer.

**Beat**:
One tick of a **Meet Again** Round, counted from 1. A light with period p is lit on every beat that is a multiple of p. A Round lasts for a few meetings (three, or two when the LCM is over 12), after which it is over.
_Avoid_: second, turn, step (that word belongs to **Division ladder**'s Watch).

**Meeting**:
A **beat** on which every light in a **Meet Again** Round is lit: L, 2L, 3L, … where L is the LCM of the periods. The student catches a meeting by tapping on it.
_Avoid_: match, hit, together (that is the button).

**Replay**:
Playing the same **Board**, **Round** or set of lights again after a finished one with fewer than three stars. The stars are the student's own, but a replay never counts toward progress, unlocks or the streak, so it cannot be used to farm a level: the finished screen offers it, and the game says "Practice run" while it is under way.
_Avoid_: retry (the code's name for it), redo.

**Run**:
Correct taps in a row in **Prime Hunt**, **Multiples Hunt**, **Prime Breaker** and **Fizz Buzz**, shown as a badge ("×4") while it lasts. A slip ends it; the longest run on the Board is shown at the end when it is three or more.
_Avoid_: combo, streak (that word is for perfect Boards in a row).

**Prime collection**:
The 1–100 grid under **Prime Hunt** in which a prime lights up once it is a **Known prime**. Only known primes are marked, so the grid never says which numbers are prime: Prime Hunt stays a recall test and the collection is its reward.
_Avoid_: prime chart, sieve.

**Prime Blitz**:
Prime Hunt's optional 60-second challenge: the same **Boards**, a point for every prime found and one off for every wrong tap (never below 0), new Boards dealt as each is cleared, a personal best per **Prime tier**. It is opt-in and never touches **Known primes** or unlocks.
_Avoid_: timed mode, speed round.

**Boss round**:
An occasional (about one in ten) prime-factors **Round** in **Prime Breaker** dealt from a short list of big numbers made only of the offered primes (1001, 1024, 2310, …). It counts like any other Round.
_Avoid_: bonus round, hard mode.

**Own number**:
A number the student types into **Prime Breaker** to break: 2 to 9999, with every prime factor 31 or smaller, so the buttons can finish it. Free play: it earns stars but never counts toward unlocking.
_Avoid_: custom number, free play (as a name).

**Fizz Buzz**:
**Multiples Hunt**'s side game: count up from 1 and say Fizz for a multiple of one number, Buzz for a multiple of another, FizzBuzz for both and otherwise just the number. FizzBuzz is the **common multiples** said aloud, and the game points out that the first is the LCM. A wrong choice says why and the student tries the same number again. Free play: never touches Multiples Hunt's progress.
_Avoid_: counting game.

**Pattern grid**:
The 1–N grid shown after a finished **Multiples Hunt** Board: multiples dark, and (for two or three numbers) multiples of only some of them light. Multiples of 7 fall on a slanting line; common multiples repeat at the same distance.
_Avoid_: number chart (that is 2.2's).

**Music mode**:
**Meet Again**'s opt-in sound: each light plays its own note when it blinks, so a **meeting** sounds as a chord. A little easier, and it is held while a Round is in play. In step-by-step mode the lights are also drawn as lanes growing beat by beat, since that mode has no clock.
_Avoid_: sound mode.

**Shared result**:
The line a student copies from a finished round ("Prime Breaker ★★☆ ✗1", one line of detail and the page), language-neutral so it reads the same in any class chat. If the browser refuses to copy, the text is shown to select by hand.
_Avoid_: score card, screenshot.

**Reader language**). The rest of this document describes the Transformasi Isometri chapter.

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

**Reveal**:
The motion that makes a **Section**'s "why" visible by playing an **Object** onto its target figure. **Slide-to-overlay** (translation) and **Fold-to-overlay** (reflection) are its two variants. In a **Latihan** it is the slot the shell fills: the shell hands the Section's reveal a `playing` flag, flipped on commit and remounted per pair, and the Section decides which variant to draw. Every Reveal derives its motion from the figures on screen, never from separately authored data.
_Avoid_: animation, transition, tween (those name the CSS, not the concept).

**Latihan**:
The graded exercise that closes a **Section**: a deck of authored pairs walked one at a time, where the student commits a single answer, sees whether it is correct and a **Reveal** "why", then advances to the next pair. The commitment is final — a second answer for the same pair is ignored. Every **Section** has one. What varies between Sections is only the answer (a congruency verdict in 11.1, a **Translation vector** in 11.2, an **Axis of reflection** in 11.3), how the correct answer is derived from the pair (never authored separately), which pairs reveal the "why" on commit, and which reveal plays it (**Slide-to-overlay** in 11.1/11.2, **Fold-to-overlay** in 11.3). Everything else is shared, in three pieces: the stepping rules (`latihan.ts`, a pure state machine); the live object a Section starts from its config and deck (`startLatihan` in `latihan.svelte.ts`), which holds the snapshot, exposes the derived view-state, and owns the student's in-progress answer (the _draft_, reset to the Section's blank on each new pair); and the rendered chrome — progress counter, the **Reveal** replay, the verdict, the advance — (`LatihanShell.svelte`), which takes that live object plus each Section's answer input, feedback sentence, and **Reveal** as snippets.
_Avoid_: quiz, drill, test, exercise engine.

**Mini-game**:
A short, replayable game a chapter offers beside its **Sections**, for practising a skill until it sticks. Unlike a **Section** it is not a textbook subsection: it has no textbook number and mirrors nothing in the textbook. Unlike a **Latihan** it is not a graded deck closing a Section; the student plays as many rounds as they like. A chapter's mini-games are listed on its **Mini-games hub**, which the chapter landing links to apart from its Sections.
_Avoid_: Section 2.4 (it has no textbook number), activity, extra, exercise.

**Mini-games hub**:
The unnumbered page that lists a chapter's **Mini-games** (e.g. `/factors-and-multiples/mini-games`), with each game on its own route beneath it. Each card says how far the reader has got (primes known, levels mastered), read from the progress each game keeps in their browser. The lessons link to the games that practise them from a "Practise this in a game" box at the end of a beat.
_Avoid_: games page, arcade.

**Prime Hunt**:
The first **Mini-game**, in Factors and Multiples: a board of numbers appears and the student taps every prime. The student recalls the primes: nothing marks which numbers are prime until one is tapped. A wrong tap is called out at once and shows why the number is not prime, as a factor pair (e.g. 51 = 3 × 17). Played in three **Prime tiers**.
_Avoid_: prime quiz, prime bingo.

**Prime tier**:
One of the ranges of primes a student memorises in **Prime Hunt**: 2–20, 2–50, 2–100. A student works through the tiers in order, each unlocking when the one before it is mastered: when every prime in it is a **Known prime**.
_Avoid_: level, stage.

**Board**:
One round of **Prime Hunt**: 16 numbers drawn from a **Prime tier**, a mix of primes, composites and look-alikes (odd composites such as 51, 57, 87, 91 that pass for prime), and occasionally 1. The student taps the numbers they think are prime and every tap is judged at once: a prime turns green with a chime, a non-prime turns red with a buzz and shows why (its factor pair, e.g. 51 = 3 × 17). A counter shows how many primes are left to find. The Board is complete when the last prime is found; it has no Check step. Untimed, and scored 1–3 stars by the number of mistakes (none, one, more); a perfect Board earns confetti. Sound can be muted.
_Avoid_: round, level, puzzle, grid (a Board is not the tier's full table).

**Known prime**:
A prime the student has found **cleanly** on two **Boards**: found before any mistake on that Board. A prime found after a wrong tap does not count, so tapping at random cannot earn it. A wrong tap never takes anything away. Boards favour primes that are not yet known. Kept in the reader's browser, so it lasts across visits.
_Avoid_: learned, mastered (that word is for a **Prime tier**), memorised.

**Reader language** (_Bahasa pembaca_):
The language the reader chose to read in, remembered across pages and visits. It applies only to a chapter that offers it; a chapter that does not offer the choice shows its own language. Until the reader chooses, every chapter shows its own language.
_Avoid_: locale, i18n, user language.

**Chapter copy**:
All of a chapter's on-screen body wording — headings, prose, hints, feedback sentences — in each language the chapter offers. A chapter's own language follows its textbook (English for Factors and Multiples, Malay for Transformasi Isometri); its translations follow that, so on any disagreement the chapter's own language's term wins (e.g. HCF over FSTB). It excludes the chapter's structure and the Section titles, which belong to the chapter registry and are not duplicated in the copy.
_Avoid_: strings, translations (as the name of the wording), translation file.

**Division ladder**:
The textbook's method of repeated division, drawn as rows: each rung divides the current row by a prime and writes the result below. It serves three uses that differ only in what a divisor must do — prime factorisation of one number, **HCF** (the divisor must divide every number), and **LCM** (the divisor need divide only one number; the rest are brought down unchanged). The student's progress is the list of divisors chosen; the rows and the answer follow from it.
_Avoid_: ladder method, staircase, division table.

**Factor pair**:
Two whole numbers whose product is a given number, written `a × b` with a ≤ b (24 → 1 × 24, 2 × 12, 3 × 8, 4 × 6; a perfect square's 4 × 4 is one pair). Factor pairs are how the chapter shows factors: the "What are factors?" tiles reveal one each time the rows come out complete (a pair is found by either of its numbers), and Prime Hunt shows one to explain why a number is not prime. **Factor pairs** (the HCF comparison, `FactorPairs.svelte`) lists every number's factor pairs side by side and highlights each factor that every number has — the **common factors** — with the biggest, the **HCF**, ringed. It is the HCF's picture in 2.1 and 2.3, in place of the old "cut into equal pieces" lanes. The pair row itself is `FactorPair.svelte`, shared by the tiles and the comparison so a pair looks the same everywhere.
_Avoid_: factor chart, factor table, pieces (the retired HCF picture).

**Starting numbers**:
The row a **Division ladder** begins with: either one of the chapter's preset sets, or numbers the student types under "Your own". Changing the starting numbers restarts the ladder.
_Avoid_: input, seed, initial values.

**Watch**:
The scripted run of a **Division ladder** (or the side-by-side HCF and LCM ladders), which takes one rung at a time on its own, narrating each. It takes the same step the "Hint" would suggest — the smallest prime the ladder accepts.
_Avoid_: autoplay, animation, demo.

## Relationships

- A **Transformation** maps one **Object** to one **Image**.
- An **Isometric transformation** produces an **Image** that is **congruent** to its **Object**.
- A **Translation** is an **Isometric transformation** described by exactly one **Translation vector**; it preserves shape, size, and **Orientation**.
- A **Section** mirrors one textbook subsection and contains at most one primary **Explorable** and one **Latihan**.
- A chapter may list **Mini-games** on a **Mini-games hub**, apart from its **Sections**. A **Mini-game** is not graded by a **Latihan** and does not use the Latihan deck-walker.
- **Prime Hunt** is played one **Board** at a time within a **Prime tier**; its **Known primes** decide when the next tier unlocks.
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
