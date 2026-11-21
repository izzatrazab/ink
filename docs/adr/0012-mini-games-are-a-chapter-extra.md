# 0012 — Mini-games are a chapter extra, not a numbered Section

Factors and Multiples gains replayable games (the first is Prime Hunt, for memorising primes). The app's structure mirrors the textbook's numbering 1:1 (a **Section** is one textbook subsection), and games are not in the textbook.

**Decision**

- A **Mini-game** is not a Section. It has no number, `LessonShell` is not used for it, and the Sections list (`2.1`–`2.3`) is unchanged. Calling it "Section 2.4" would invent a textbook subsection.
- The registry gains an optional `miniGames` list on `Chapter` (slug, title, description, with translations matched by slug like sections). A chapter with none has no hub.
- Routes: the unnumbered **Mini-games hub** at `/<chapter>/mini-games`, each game at `/<chapter>/mini-games/<slug>`. The chapter landing links to the hub from a separate "Play" card after the Sections.
- Games render inside `GameShell`, the sibling of `LessonShell` (same container, header and language toggle; back links to hub and chapter).
- A game does not use the Latihan deck-walker, which assumes a fixed deck of authored pairs and one final answer per pair. Prime Hunt has its own pure rules module (`primeHunt.ts`, random function injected), rune adapter (`primeHuntStore.svelte.ts`, the only code touching `localStorage`) and component.
- Player progress (which primes are known) lives in the reader's browser only; no accounts or backend.

**Alternatives rejected:** a numbered Section 2.4 (breaks the 1:1 mirror); extra Beats inside existing Sections (games are replayable on their own, not part of one lesson's reading order).
