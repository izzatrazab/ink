import { describe, it, expect, beforeEach } from 'vitest';
import { chapterCopy } from './chapterCopy.svelte';
import { reader } from './language.svelte';

// Tested through its interface only, the way a component reads it: name a chapter
// and its copy table, get back the wording in the Reader language.

const table = { en: { hello: 'Hello' }, ms: { hello: 'Helo' } };

beforeEach(() => {
	reader.choice = null;
});

describe('chapterCopy', () => {
	it("shows the chapter's own language until the reader chooses", () => {
		// Factors and Multiples is written in English and offers Malay.
		expect(chapterCopy('factors-and-multiples', table).t.hello).toBe('Hello');
	});

	it("follows the reader's choice, live", () => {
		const copy = chapterCopy('factors-and-multiples', table);
		reader.set('ms');
		expect(copy.t.hello).toBe('Helo');
		reader.set('en');
		expect(copy.t.hello).toBe('Hello');
	});

	it("ignores a choice the chapter doesn't offer", () => {
		// Transformasi Isometri is Malay-only.
		reader.set('en');
		expect(chapterCopy('transformasi-isometri', table).t.hello).toBe('Helo');
	});

	it("falls back to the chapter's own language when its table lacks the choice", () => {
		reader.set('ms');
		const partial = { en: { hello: 'Hello' } } as unknown as typeof table;
		expect(chapterCopy('factors-and-multiples', partial).t.hello).toBe('Hello');
	});
});
