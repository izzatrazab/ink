// The reader's language preference, shared by every page. A chapter written in
// one language but translated into another (chapters.ts `translations`) shows a
// toggle; this store remembers the choice across pages and visits. Until the
// reader chooses, each chapter shows its own language, so server and first
// client render agree — the saved choice is applied after mount via `load()`.

import { languagesOf, localize, type Chapter, type Language } from './chapters';

const KEY = 'language';

function isLanguage(v: unknown): v is Language {
	return v === 'en' || v === 'ms';
}

class ReaderLanguage {
	/** The reader's explicit choice, or null if they have not chosen. */
	choice = $state<Language | null>(null);

	/** Reads the saved choice (browser only; call from onMount). */
	load() {
		try {
			const saved = localStorage.getItem(KEY);
			if (isLanguage(saved)) this.choice = saved;
		} catch {
			// storage blocked — the choice just will not persist
		}
	}

	set(lang: Language) {
		this.choice = lang;
		try {
			localStorage.setItem(KEY, lang);
		} catch {
			// ignore
		}
	}

	/** The language this chapter is shown in: the reader's choice if the chapter
	 *  offers it, otherwise the chapter's own language. */
	for(chapter: Chapter): Language {
		return this.choice && languagesOf(chapter).includes(this.choice) ? this.choice : chapter.lang;
	}

	/** The chapter with its text in the reader's language. */
	view(chapter: Chapter): Chapter {
		return localize(chapter, this.for(chapter));
	}
}

export const reader = new ReaderLanguage();
