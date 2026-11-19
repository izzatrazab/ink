# 0011 — Multiple chapters via a registry, one route folder per chapter

The app began as a single chapter (Bab 11, Transformasi Isometri) and its front door, `LessonShell` header, and back-link all assumed it. Adding Form 1 Chapter 2 (Factors and Multiples) needed a chapter-level seam.

**Decision**

- `src/lib/chapters.ts` is the chapter registry: slug, form, number, title, description, and section metadata. The home page, chapter landings, and `LessonShell` read from it.
- Each chapter is a static route folder at `/<slug>` (`/transformasi-isometri`, `/factors-and-multiples`), keeping existing URLs stable. Section pages remain hand-written at `/<slug>/<n-n>`; there is no dynamic `[chapter]` route and no lesson engine.
- `/` is now a chapter index grouped by Tingkatan; it no longer redirects to Transformasi Isometri (supersedes that part of ADR-0008).
- A chapter has a `lang` (`en`/`ms`) following its textbook; fixed UI wording (eyebrow, back link, "coming soon") comes from `chapterText`. Sections may be listed with `ready: false` and an `outline` before their pages exist.
- `LessonShell` takes a required `chapter` slug instead of a hard-coded Bab 11 eyebrow/back-link.
- `src/lib/transformasi/` still holds the isometry-specific code; the shared `SectionCard`/`LessonShell`/`ChapterLanding` live there for now and move only if a second chapter wants more shared parts.

**Adding a chapter:** add an entry to `chapters`, add `src/routes/<slug>/+page.svelte` rendering `<ChapterLanding>`, then add section entries and pages as they are written.

**Amendment — words and languages**

- A chapter's words have two homes with distinct jobs: the registry (`chapters.ts`) owns the chapter and Section titles, descriptions and outlines in every language the chapter offers; the chapter copy owns the body wording. Titles and descriptions are not duplicated into the copy, so a Section page reads them from the registry.
- Body wording is resolved through one module (`chapterCopy`) from the **Reader language**; a chapter whose copy lacks the reader's choice falls back to its own language.
