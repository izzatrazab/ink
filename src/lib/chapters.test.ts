import { describe, expect, it } from 'vitest';
import { chapters, chapterLabel, chaptersByForm, getChapter, sectionHref } from './chapters';

describe('chapter registry', () => {
	it('has unique slugs', () => {
		const slugs = chapters.map((c) => c.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('keeps existing section URLs stable', () => {
		const t = getChapter('transformasi-isometri');
		expect(sectionHref(t, t.sections[1])).toBe('/transformasi-isometri/11-2');
	});

	it('labels a chapter with form and number', () => {
		expect(chapterLabel(getChapter('factors-and-multiples'))).toBe('Form 1 · Chapter 2');
		expect(chapterLabel(getChapter('transformasi-isometri'))).toBe('Tingkatan 2 · Bab 11');
	});

	it('groups chapters by ascending form', () => {
		expect(chaptersByForm().map((g) => g.form)).toEqual([1, 2]);
	});

	it('throws on an unknown chapter', () => {
		expect(() => getChapter('nope')).toThrow();
	});
});
