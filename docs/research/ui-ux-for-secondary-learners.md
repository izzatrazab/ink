# UI/UX research for an interactive maths app for secondary learners

Scope: what the evidence says about colour, shape, type, diagram size, sound, motion, feedback and motivation for learners aged 12–17 (Form 1–5, KSSM). Applied to this app (SvelteKit, Tailwind 4, daisyUI 5, SVG manipulatives; chapters on Factors and Multiples and Transformasi Isometri, English and Malay).

Date: 2026-11-21. Method: web searches, then three rounds of re-checking the claims against each other and against the learner's situation.

## How to read this

Each finding has a confidence label.

- **Strong**: backed by a standard (WCAG) or by many consistent studies.
- **Moderate**: consistent but small, or mostly from one research group.
- **Weak**: practitioner opinion or a single small study. Treat it as a hypothesis and test it with your own learners.

I did not open most primary papers. Search results were summaries, so effect sizes below are quoted from secondary sources and could be off. Where I could not verify something, I say so.

---

## 1. The ten decisions, in order of importance

1. **Learning design beats visual style.** The biggest wins come from interaction design: short segments, instant feedback, predict-then-reveal, and removing clutter. Colour and fonts matter much less. (Strong)
2. **Remove everything that does not teach.** Mayer's coherence principle (extraneous material hurts) is the most consistently supported multimedia principle. One review lists an effect size of about 0.86. (Strong)
3. **Put labels inside the diagram, not beside it.** Split attention raises cognitive load. (Strong)
4. **Contrast first, hue second.** Research does not support any "best learning colour". Readability and contrast do matter. (Strong for contrast, weak for hue)
5. **Never use colour alone for meaning.** Add shape, icon or text. This is also WCAG 1.4.1. (Strong)
6. **Rounded, warm shapes are fine and probably help a little.** One 2025 experiment found curvature raised perceived warmth and ease of use. Keep the effect modest and do not rely on it. (Weak to moderate)
7. **Sound is opt-in, short, and never carries information on its own.** Sound improves enjoyment more reliably than learning. (Moderate)
8. **Feedback should explain, not just mark.** Elaborated feedback beats right/wrong. Tone matters for anxious learners. (Strong)
9. **Be careful with competitive or loss-based gamification.** Small average gains, mixed results, and streak anxiety is a real complaint. (Moderate)
10. **Design for a phone first.** Almost all Malaysian secondary students and teachers own smartphones. (Moderate)

---

## 2. Colour

### What the evidence says

- No fixed colour is best for memory or attention. Red can help detail-focused tasks, blue can help creative ones (Mehta and Zhu), and other studies find the opposite. The effect depends on the task, and instructional-design advice says readability matters more than hue. (Mixed)
- Red and yellow objects are remembered better than blue and green, but only the memory of the colour itself, not whether the object appeared. That is not useful for a maths app. (Frontiers in Psychology 2015)
- WCAG sets the measurable rules:
  - Text contrast at least 4.5:1 (SC 1.4.3, AA). Large text at least 3:1.
  - Meaningful graphics and UI component edges at least 3:1 against neighbours (SC 1.4.11, AA).
  - Colour must not be the only way to convey meaning (SC 1.4.1, A).
- Red/green pairs are risky for colour-blind learners. Fixing it means adding a shape, icon or label, and giving the two colours different lightness.

### Recommendations for this app

- **Keep the violet primary with teal, amber and sky accents.** It is a distinct, friendly palette and there is no evidence to replace it. Keep one calm neutral background so the diagram is the loudest thing on the page.
- **Give colour a fixed meaning per concept and keep it across chapters.** For example, Object = one colour, Image = another, axis = a third. Do not recycle those colours for decoration. This is the signaling principle: cues that mark what matters help learning (about d = 0.70 in one review).
- **Correct/incorrect:** use green and red only together with an icon (tick or cross) and a text label such as "Not quite". Never colour alone.
- **Check contrast on the amber accent.** Amber on white often fails 4.5:1 for text. Use it for fills and highlights and use dark text on top of it. Run a contrast check on every token pair in both themes. This is the single most likely accessibility defect in the current palette. I have not measured it, so verify.
- **Use no more than about 4–5 colours inside any one diagram.** This is design judgement, not a measured threshold.
- **Dark mode:** keep it. Lower the saturation of large fills in dark mode and re-test contrast.

---

## 3. Shape, radius and surfaces

### What the evidence says

- Rounded shapes read as friendlier and angular ones as more threatening. A 2025 *Journal of User Experience* study (187 people, one app, one task) found curvature raised perceived aesthetics and warmth, which raised perceived ease of use and satisfaction. The authors note almost nothing has been tested for buttons, cards or dialogs specifically. (Weak to moderate)
- The aesthetic-usability effect says attractive interfaces are judged easier to use. That also means a pretty interface can hide real usability problems, so test with real tasks.
- NN/g found teenagers pay more attention to visual design than adults do. So polish is worth having, but teens still leave quickly when something is confusing. (Moderate)

### Recommendations

- **Current radii (1rem fields, 1.5rem cards) are fine.** They are on the friendly side without looking childish.
- **Teenagers can reject anything that feels like a primary-school app.** Keep the playfulness in the shapes and the diagrams, and keep the copy and layout plain and respectful. This is a judgement call from the NN/g teen work, not a measured result.
- **Make diagram geometry sharp.** The shapes the learner is reasoning about (triangles, polygons, axes) should have crisp corners and real dimensions. Rounded UI around them is fine. Rounded corners on the maths objects would blur what a vertex is.
- **Keep shadows soft and few.** One elevation level for cards, one for the focused or active manipulative.

---

## 4. Typography

### What the evidence says

- Special "dyslexia fonts" (OpenDyslexic, Dyslexie) do not reliably help. One study found OpenDyslexic reduced speed and accuracy and no child preferred it. Spacing and familiarity matter more. A 2026 meta-analysis exists but I only saw its abstract. (Moderate)
- WCAG 1.4.12 text spacing, which content must tolerate without breaking: line height 1.5, paragraph spacing 2× font size, letter spacing 0.12 em, word spacing 0.16 em.
- Dyslexia Scotland and the BDA recommend sans serif, generous spacing and left alignment, and say the choice is partly personal preference.
- I could not verify reading-research figures for line length (the usual 45–75 characters) or minimum body size from the sources I found. These are widely used conventions, so treat them as conventions.

### Recommendations

- **Keep Plus Jakarta Sans for body text.** Fredoka for headings is fine. Do not use Fredoka for paragraphs: heavy rounded display faces slow reading in long runs.
- **Body text at 16px minimum, 18px for explanatory paragraphs.** On a phone, never go below 14px for any text a learner must read, including captions and axis labels. Search found nothing that gives a verified minimum, so this is a conservative convention.
- **Line height 1.5–1.6 for body, 1.2–1.3 for headings.** Max line width about 65 characters.
- **Left-align. No justified text. No italics for long passages.**
- **Test with text-spacing overrides on.** Layout must survive WCAG 1.4.12 values without clipping.
- **Malay text runs longer than English.** Leave room for it in buttons and labels. Build buttons to wrap, not to a fixed width. (My judgement from experience with translation, not a sourced figure.)
- **Numbers and maths:** use tabular figures for coordinates and columns so digits line up. Use a clear minus sign (−), not a hyphen.
- **Offer a text-size control** (or rely on browser zoom and make sure 200% zoom works, WCAG 1.4.4).

---

## 5. Diagrams and manipulatives

### What the evidence says

- **Integrate labels with the picture.** Placing text next to a diagram forces learners to hold both in mind (split attention). Chandler and Sweller found integrating text into diagrams reduces load. (Strong)
- **Novices need more guidance; experts need less.** Worked examples help beginners, and the benefit reverses for stronger learners (expertise reversal). Redundant narration helped novices and became redundant for experts. (Strong, though many studies use subjective load ratings)
- **Segmenting:** letting learners control the pace through short parts beat continuous presentation. Effect size about 0.77 in one review. (Strong)
- **Virtual manipulatives and instant feedback** support persistence and engagement, but evidence is mostly small studies. One GeoGebra classroom study found students reported better engagement and understanding but lower confidence, and weaker students found it rushed and complicated. Teacher-led use worked best. (Moderate)
- **Transformation geometry misconceptions are well documented:** students use rules instead of visualisation, struggle to find the axis of reflection, and read a translation as "replacement". Prediction before exploration is recommended in the literature, but I found no study that directly tests a predict-then-reveal design. (Moderate for misconceptions, weak for the design)

### Recommendations

- **Diagram should be the largest thing on the screen.** On a phone, give it the full content width. On desktop, give it at least about 55–60% of the width. Do not put a diagram in a small card beside long text. (Design judgement, supported by the split-attention evidence, not a measured ratio.)
- **Keep the grid minimum comfortable to touch.** Draggable handles should have a hit area of at least 44×44 CSS px even if the visible dot is smaller. Use an invisible larger circle in SVG.
- **Snap to the grid** during dragging so a slightly off touch still lands on a meaningful point.
- **Label directly on the diagram:** vertex names (A, A′), axis equation, vector arrow with its column vector. Do not use a separate legend when the label can sit on the object.
- **Show the invariant.** For a reflection, draw the dashed perpendicular from point to image and mark equal distances. For translation, draw the same arrow from every vertex. This is signaling in the strict sense.
- **Predict, then reveal.** Ask the learner to place or choose the image first, then show the true image over it. Use a "try again" or "show me" path so no one gets stuck. Make this an option for stronger learners (expertise reversal).
- **Fade guidance over a section.** Early in a section show hints and the worked example. Later hide them by default and offer them on request.
- **One new idea per screen** (segmenting). Next/Back should be reachable with a thumb.
- **Provide a keyboard path** for every drag interaction (arrow keys, or +/− steppers). Many classroom laptops have trackpads, and NN/g notes trackpads make drag-and-drop and small buttons hard for teens.
- **Respect the existing SVG approach.** SVG scales cleanly, stays sharp on any phone, and can carry text alternatives. Add `role="img"` and a short text description to each static diagram.

---

## 6. Sound

### What the evidence says

- Sound raises enjoyment and requests to use it, but comprehension gains are not reliably shown. In a classroom study of a sound-effects app, most students wanted it but comprehension did not significantly change. Older students were less affected than younger ones. (Moderate)
- Sound effects can act as "seductive details" that pull attention to the fun parts. (Moderate)
- Most studies are small and use younger children, so evidence for 12–17 is thin. (Gap)
- Many popular maths apps use audio correctness feedback without evidence on its effect on performance or preference. (Gap)
- WCAG 1.4.2: audio that plays automatically for more than 3 seconds must have a control to stop it, independent of system volume. WCAG2ICT extends this to software. Xbox and Game Accessibility Guidelines suggest separate volume or mute controls for effects, speech and music.

### Recommendations

- **Default: off, or a small opt-in.** Learners study in classrooms, buses and shared homes. Unexpected sound is embarrassing for a teenager. Show a clear speaker toggle and remember the choice.
- **No background music.** There is no evidence it helps and it conflicts with the coherence principle.
- **Only short UI sounds (under about 0.5 s)** for: correct, try again, section complete. Make "try again" soft and neutral, not a buzzer. Buzzers punish a learner for exploring.
- **Never put information only in sound.** Every sound has a visual twin.
- **No sound during drag.** Drag sounds are repeated hundreds of times and become noise.
- **Do not autoplay.** Play only after a user action. This also avoids browser autoplay blocks.
- **Match system settings.** Respect silent mode where the platform allows it.
- **Currently the app has no audio code**, so this is a clean decision rather than a retrofit. A reasonable plan is to ship without sound first and add it as an opt-in, small experiment.

---

## 7. Motion and animation

### What the evidence says

- WCAG 2.3.3 (AAA) says motion triggered by interaction should be switchable off. The standard technique is the `prefers-reduced-motion` media query, also checked in JavaScript for scripted animation. Motion longer than 5 seconds needs a pause control (WCAG 2.2.2).
- Animation that shows the *mechanism* (a shape sliding along its vector, a flip across an axis) is teaching. Decorative animation is extraneous.

### Recommendations

- **Animate only what teaches:** the transformation itself, 400–800 ms, with easing. A replay button lets a learner watch again. A scrub slider lets them control it (segmenting, learner control).
- **Do not animate decoration** such as bouncing mascots, confetti loops or parallax.
- **Keep the reduced-motion handling you have** (`app.css` already has it for cards, and 5 files reference it). Extend it to every transformation animation: with reduced motion, jump straight to the end state and keep the replay as a step-through.
- **Nothing flashes more than three times a second.**

---

## 8. Feedback and tone

### What the evidence says

- Shute's review: formative feedback should be specific, timely, supportive and non-evaluative. Elaborated feedback (the what, how and why) works better than verification only. Long, complicated feedback tires learners. (Strong)
- Timing depends on the learner. Immediate feedback for weaker or novice learners, possibly delayed for strong ones or for transfer. Let learners try first. (Moderate)
- Well-designed maths apps give progressive hints, not just right/wrong, and detect repeated wrong answers. (Moderate, from journalism and small studies)
- Mayer's personalization principle: conversational style helped (median d about 0.79 over 14 of 17 experiments), though it may not apply to high achievers or long lessons and works best when not overdone. Secondary-student evidence was not in what I found. (Moderate)
- Anxiety-reducing designs recommended in a 2025 conceptual model: low-stakes practice, safe error handling, adaptive feedback, non-competitive progress. It is a framework, not a tested intervention. Evidence on timed tasks is contested. (Weak)

### Recommendations

- **Three-level feedback ladder:** (1) a nudge ("Check the distance from the axis"), (2) a specific hint ("A is 3 units left of the axis, so A′ is 3 units right"), (3) the worked answer. Let the learner choose when to go down a level.
- **Say why, in one or two short sentences.** Link the explanation to the diagram element it is about, and highlight that element.
- **Name the error pattern when you can recognise it.** Example: "You moved the image along the axis instead of across it." This fits the documented misconceptions.
- **Tone:** plain, warm, respectful. "Not quite yet" beats "Wrong!". No sarcasm, no baby talk, no exclamation marks on every line. Use second person sparingly.
- **No timers on conceptual tasks.** If you add speed practice later, make it optional and private.
- **Do not show other learners' scores next to a learner's mistake.**

---

## 9. Motivation and gamification

### What the evidence says

- A meta-analysis of 35 interventions found a small positive effect of gamified learning (Hedges' g about 0.26). Other reviews, including one on maths specifically, describe the evidence as mixed. (Moderate)
- Leaderboards: public ones may motivate those at the top. Anonymous ones related to better learning outcomes. Evidence on harm to those at the bottom is not in my results. (Weak)
- Streaks and hearts: criticism is mostly opinion and parent-guide material, not peer-reviewed. The claim is that loss-aversion mechanics create anxiety and favour engagement over learning. Duolingo itself moved from hearts to energy. I found no academic study on streaks and learning. (Weak)
- NN/g: teenagers are goal-oriented, impatient, and quick to leave. Gamification and onboarding are covered in their teen report, but I could not read it. (Moderate)

### Recommendations

- **Use progress, not pressure.** A visible "sections done" path and a "you got this one in two tries" note respect competence, autonomy and relatedness, which the meta-analysis used as its framework.
- **No streaks, no lives, no public leaderboards.** Nothing in the evidence justifies the anxiety risk for a school-maths audience, and the app has no commercial reason for them.
- **Celebrate understanding, not speed or volume.** "You spotted that the image is a mirror image" beats "+10 XP".
- **If you add badges, make them private and tied to concepts** (e.g. "Found an axis"), not to time spent.
- **Give learners control:** skip, replay, go back, choose language, choose sound. Autonomy matters to this age group.
- **Respect classroom use.** Teachers may project the app. Make sure it works at projector size with large type.

---

## 10. Layout, navigation and devices

### What the evidence says

- Nearly all Malaysian secondary students and teachers own a smartphone (a 130-person survey). Barriers cited include school policy, connectivity and the digital divide. I found no source on low-bandwidth design specifically for Malaysian schools. (Moderate on ownership, gap on bandwidth)
- Touch targets: WCAG 2.5.8 (AA) minimum 24×24 CSS px; WCAG 2.5.5 (AAA) 44×44; Apple suggests 44 pt, Material 48 dp. (Strong)

### Recommendations

- **Mobile-first.** Design the diagram for a 360 px wide screen, then widen.
- **Targets at least 44×44 px, with 8 px between them.** The 24 px WCAG minimum is a floor, not a goal.
- **Put primary actions within thumb reach** (bottom of the screen on phones). Keep Next/Back fixed there.
- **Page weight:** keep it small. Your SVG approach is good. Avoid large PNGs where SVG exists (the repo has both `.png` and `.svg` for each animal, so make sure only the SVG ships where possible). Cache lessons for offline use if you can. This is a reasoned suggestion, not something I found a source for.
- **Support both orientations;** do not lock to portrait.
- **Visible focus ring** for keyboard users. Do not remove outlines.
- **Language switch** should be one tap and should keep the learner's place in the lesson.
- **Progress is saved locally** so a closed tab or lost signal does not lose work.
- **Show where you are** ("2.3 · step 4 of 7"). Textbook numbering already helps; keep it.

---

## 11. Re-evaluation rounds

I re-checked the draft recommendations three times against the evidence and the learner.

**Round 1: is each claim backed, and how strongly?**
- Downgraded "rounded corners improve learning" to "probably a small aesthetic effect". Only one app and one task were tested.
- Downgraded colour-for-memory claims. The literature conflicts and I dropped any hue-specific advice.
- Removed any claim about a "best" font size backed by research. I found none, so 16/18 px is labelled as convention.
- Kept signaling, coherence, segmenting, split attention and feedback at the top, since those are repeated across independent sources.

**Round 2: does it fit 12–17-year-olds, not young children?**
- Much of the sound, emoji-feedback and gamification evidence comes from primary-age children. Older students were less affected by sound effects. So sound became opt-in and short, and gamification became low-pressure.
- Teens dislike anything childish and quit fast when confused (NN/g). So the playful visual language stays, but copy is plain and the flow is short.
- Added autonomy: skip, replay, language, sound.

**Round 3: does it fit this project and these constraints?**
- Phones and shared classrooms drove the sound default, the touch target rule and the mobile-first layout.
- Both English and Malay: added room for longer Malay strings.
- The existing design (violet palette, big radii, Fredoka plus Plus Jakarta Sans, reduced-motion on cards) already matches most findings, so the advice is to refine, not restyle.
- Struggling learners: checked that the hint ladder, snap-to-grid, keyboard alternatives and "show me" paths leave no dead ends.

**What remains uncertain**
- Whether a predict-then-reveal flow beats explore-first for this age group. Plausible, untested in my sources.
- Effects of UI sound on 12–17-year-olds. Thin evidence. Test.
- Whether the amber accent passes contrast. I did not measure it.
- Real figures for body-text size and line length. I relied on convention.

---

## 12. Prioritised checklist for this repo

**Do first (cheap, high value)**
1. Run a contrast audit on every colour token pair in both themes. Fix any text under 4.5:1 and any graphic under 3:1. Pay attention to amber and the warning colour.
2. Pair every correct/incorrect colour with an icon and text.
3. Ensure every draggable handle has a 44 px hit area and every drag has a keyboard route.
4. Make sure every transformation animation respects `prefers-reduced-motion`.
5. Set body text to at least 16 px (18 px for explanation paragraphs), line height about 1.5, max width about 65 characters. Test with WCAG text-spacing overrides.

**Do next**
6. Integrate labels into diagrams. Remove side legends.
7. Add the three-step hint ladder to every exercise.
8. Add predict-then-reveal to one section as an experiment.
9. Add progress indication ("step 4 of 7") and a persistent local save.
10. Audit page weight. Confirm only SVG animals are shipped where both formats exist.

**Later, as experiments**
11. Opt-in sound pack (three short sounds, a clear toggle, off by default).
12. Fading guidance for stronger learners.
13. Private concept badges.

**Do not build**
- Streaks, lives or hearts, public leaderboards, autoplay music, countdown timers on conceptual tasks, a "dyslexia font" as the answer to readability.

## 13. How to test

The most useful evidence is your own. With 5–8 learners per round:
- Give them a task and say nothing. Watch where they hesitate. NN/g notes studies with minors are as valuable as any, but they need careful recruiting and facilitation, so involve a teacher and get consent.
- Compare two versions of one section (predict-first vs explore-first) with a short pre/post question set.
- Test on the cheapest phone you can find, in sunlight, on a slow connection.
- Ask a few colour-blind learners to run a lesson. Roughly 1 in 12 boys are affected by red-green colour blindness (general knowledge, not confirmed in my searches).

---

## 14. Applied to the app (2026-11-21)

Changes made from the checklist in section 12, and what the check of each one found.

**Done**
- **Contrast audit (computed, both themes).** Light-theme secondary, info, success and error were 3.4–4.0:1 as text and as button fill; they are now darker and clear 4.5:1. Accent and warning (amber) stay fill-only, with dark text at 8:1 or better. The "misses" cross in the multiples lanes was 1.7:1 on white; it now uses `--ink-warning-ink`, a darker amber (dark theme unchanged). Form-field borders raised to about 3:1.
- **Muted text was a false alarm.** My first pass said 60–70% opacity text failed. That was a blending error (linear instead of sRGB). Recomputed: 60% is 4.6–4.7:1 and 70% is 6.4:1 in the light theme, and much higher in dark. I moved the small uppercase labels to a shared `.ink-muted` (72%) for a little more margin, and made the full-sentence notes that were `text-sm` normal size.
- **Targets of 44 px.** All buttons (including "small" ones), the (a, b) stepper buttons, divisor buttons, theme and GitHub icons.
- **Drag handle.** The visible knob grew from r=4 to r=6, and a transparent r=20 grab area was added (about 35–45 px on a phone). Added `pointercancel` so an interrupted touch cannot leave it stuck.
- **Correct/incorrect** now shows a tick or cross icon and the word, at normal size, in every Latihan (`LatihanShell`).
- **Reduced motion.** A global rule in `app.css` covers CSS animation and transitions (including the slide-to-overlay). New `src/lib/motion.ts` makes the ladder's Svelte `fly`/`fade` transitions instant.
- **Reading.** Body text is 16 px with line height 1.6. Lesson prose is capped at about 68 characters. Page padding is smaller on phones. Grid tick labels are slightly larger and darker. Focus ring is 3 px on every control, including SVG ones.
- **Labels.** Theme toggle and GitHub link now have accessible names.

**Checks run:** `svelte-check` 0 errors; 202 of 202 tests pass; Prettier clean on edited files; server-rendered pages contain the new markup. ESLint reports 4 errors in `FactorTiles`, `HcfLanes`, `LaneInputs` and `MultipleLanes`; they are existing issues, not from these edits.

**Not verified:** I could not open the pages in a browser (the Chrome extension was not connected), so nothing here has been checked visually or on a real phone. Please look at 11-2 and 2-1 through 2-3 at about 360 px wide, in both themes.

**Not done (needs a design decision or more work)**
- Three-step hint ladder in each Latihan; predict-then-reveal; fading guidance.
- Opt-in sound (deliberately none yet).
- Text descriptions for each `<svg role="img">`.
- Saving progress locally; a page-weight audit (both `.png` and `.svg` exist for the animals and stars).
- Global `.btn-sm` is now 44 px tall, so chip rows are taller than before. If that looks too heavy, shrink padding rather than the target.

## Sources

Multimedia and cognition
- [Mayer's research-based principles of multimedia instruction (UNH slides)](https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-research-based-principles-for-designing-multimedia-instruction-mayer.pdf)
- [Mayer's 12 principles (NUS)](https://medicine.nus.edu.sg/medixperience/scholarly-article/mayers-12-principles-of-multimedia-instruction/)
- [Mayer, personalization, voice and image principles (Cambridge)](https://www.cambridge.org/core/books/multimedia-learning/personalization-voice-and-image-principles/97F9B31362E6491806A4718FECCADE3D)
- [Expertise reversal effect](https://en.wikipedia.org/wiki/Expertise_reversal_effect) and [worked-example effect](https://en.wikipedia.org/wiki/Worked-example_effect) (secondary)
- [Kalyuga et al. on expertise reversal (Educational Psychology Review)](https://link.springer.com/article/10.1007%2Fs10648-007-9054-3)

Teen UX and motivation
- [NN/g: UX design for teenagers (13–17)](https://www.nngroup.com/reports/teenagers-on-the-web/)
- [NN/g: usability of websites for teenagers](https://nngroup.com/articles/usability-of-websites-for-teenagers)
- [Gamification meta-analysis, Educational Technology Research and Development](https://link.springer.com/article/10.1007/s11423-023-10337-7)
- [UX Collective on Duolingo's hearts and loss aversion](https://uxdesign.cc/duolingos-small-ui-switch-that-changes-everything-fae257203633) (opinion)
- [Duolingo streaks and anxiety (parent guide)](https://screenwiseapp.com/guides/duolingo-streaks-and-anxiety-in-kids) (opinion)

Accessibility
- [WCAG 2.2 Understanding: target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [WCAG 2.2 Understanding: non-text contrast](https://w3.org/WAI/WCAG22/Understanding/non-text-contrast)
- [WCAG 2.2 Understanding: use of colour](https://w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [WCAG 2.2 Understanding: contrast minimum](https://w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.1 Understanding: audio control](https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html)
- [WCAG 2.1 Understanding: animation from interactions](https://w3.org/WAI/WCAG21/Understanding/animation-from-interactions)
- [Xbox Accessibility Guideline 105: audio](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/105)

Typography
- [Edutopia: do dyslexia fonts work?](https://www.edutopia.org/article/do-dyslexia-fonts-actually-work/)
- [A special font for people with dyslexia: does it work? (PubMed)](https://pubmed.ncbi.nlm.nih.gov/27194598/)
- [Dyslexia Scotland: dyslexia-friendly typed formats](https://dyslexiascotland.org.uk/dyslexia-friendly-typed-formats)

Colour and shape
- [Frontiers in Psychology 2015: colour and memory](https://frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00231/full)
- [National Geographic on Mehta and Zhu (red and blue)](https://www.nationalgeographic.com/science/article/colouring-your-mind-red-improves-attention-to-detail-blue-boosts-creativity)
- [UXPA Journal 2025: corner curvature in an app](https://uxpajournal.org/wp-content/uploads/sites/7/pdf/UXPA_Zhuo_05012025.pdf)

Feedback, sound, manipulatives, anxiety
- [Shute 2008, Focus on formative feedback](https://andymatuschak.org/files/papers/Shute%20-%202008%20-%20Focus%20on%20Formative%20Feedback.pdf)
- [Bishop et al. on sound in instructional software](https://link.springer.com/doi/10.1007/s11423-006-9032-3)
- [Correctness feedback in a grade-2 maths app](https://asarif.com/pub/Arif_SMC2017_Correctness_Feedback.pdf)
- [Novel Effect sound-effects classroom study](https://labschools.fau.edu/research/teacher-research/articles/impacts-of-novel-effect-on-engagement-foster-pavek/)
- [GeoGebra constructions classroom study](https://labschools.fau.edu/research/teacher-research/articles/using-geogebra-thompson/)
- [EdWeek: digital maths games, what works](https://www.edweek.org/ew/articles/2020/12/02/digital-math-games-and-apps-what-works.html)
- [Predicting before exploring in dynamic geometry (Miragliotta and Baccaglini-Frank)](https://arpi.unipi.it/bitstream/11568/924245/1/RR2018_Miragliotta.pdf)
- [Conceptual model for anxiety-reducing digital maths games](https://research.hva.nl/en/publications/a-conceptual-model-for-designing-anxiety-reducing-digital-games-i/)
- [EdWeek: do timed tasks worsen maths anxiety?](https://www.edweek.org/teaching-learning/do-timed-tasks-really-worsen-math-anxiety/2024/08?view=register)

Malaysia and devices
- [Mobile learning in Malaysian secondary schools (Mohamad and Woollard)](https://eprints.soton.ac.uk/162555/1/mohamad_26woollard.pdf)
- [Smartphone use among Malaysian secondary students (UiTM)](https://ir.uitm.edu.my/id/eprint/89226)
- [Touch target size (Google Accessibility)](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB)
