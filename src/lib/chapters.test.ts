import { describe, expect, it } from 'vitest';
import {
	chapters,
	chapterLabel,
	chaptersByForm,
	getChapter,
	languagesOf,
	localize,
	sectionHref
} from './chapters';

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

describe('localize', () => {
	it('offers Malay for Chapter 2 and nothing extra for Transformasi', () => {
		expect(languagesOf(getChapter('factors-and-multiples'))).toEqual(['en', 'ms']);
		expect(languagesOf(getChapter('transformasi-isometri'))).toEqual(['ms']);
	});
	it('translates title, sections and the label', () => {
		const ms = localize(getChapter('factors-and-multiples'), 'ms');
		expect(ms.title).toBe('Faktor dan Gandaan');
		expect(ms.sections[0].title).toContain('FSTB');
		expect(ms.sections[1].slug).toBe('2-2');
		expect(chapterLabel(ms)).toBe('Tingkatan 1 · Bab 2');
	});
	it('falls back to the chapter’s own language when there is no translation', () => {
		const t = getChapter('transformasi-isometri');
		expect(localize(t, 'en')).toBe(t);
		const fm = getChapter('factors-and-multiples');
		expect(localize(fm, 'en')).toBe(fm);
	});
});
