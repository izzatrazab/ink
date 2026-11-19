// Chapter copy: a chapter's on-screen body wording, resolved in the Reader
// language. A caller names the chapter and its copy table once and reads `t`;
// the getter tracks the reader's choice, so components re-render on toggle.
// Which language applies (the reader's choice if the chapter offers it, else the
// chapter's own) is decided by the reader store — not repeated by callers.

import { getChapter, type Language } from './chapters';
import { reader } from './language.svelte';

export interface ChapterCopy<C> {
	/** The chapter's wording in the Reader language. */
	readonly t: C;
}

export function chapterCopy<C>(slug: string, table: Record<Language, C>): ChapterCopy<C> {
	const chapter = getChapter(slug);
	return {
		get t() {
			// A table lacking the resolved language falls back to the chapter's own.
			return table[reader.for(chapter)] ?? table[chapter.lang];
		}
	};
}
