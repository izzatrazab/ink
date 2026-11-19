import { describe, expect, it } from 'vitest';
import { copy, parseRich } from './copy';

describe('parseRich', () => {
	it('splits bold runs from plain ones', () => {
		expect(parseRich('A **factor** is')).toEqual([
			{ text: 'A ', bold: false },
			{ text: 'factor', bold: true },
			{ text: ' is', bold: false }
		]);
	});
	it('passes plain text through and drops empty runs', () => {
		expect(parseRich('plain')).toEqual([{ text: 'plain', bold: false }]);
		expect(parseRich('**all bold**')).toEqual([{ text: 'all bold', bold: true }]);
	});
});

describe('copy', () => {
	it('keeps bold markers balanced in every string, in both languages', () => {
		// Templates take numbers, a flag or a list of numbers; try each shape.
		const shapes = [
			[3, 4, 6, true],
			[[2, 3, 6], 4],
			['6, 8', 4, 6]
		];
		const strings = (value: unknown): string[] => {
			if (typeof value === 'string') return [value];
			if (typeof value === 'function') {
				const outs: string[] = [];
				for (const args of shapes) {
					try {
						const out = (value as (...a: unknown[]) => unknown)(...args.slice(0, value.length));
						if (typeof out === 'string') outs.push(out);
					} catch {
						// this shape does not fit the template
					}
				}
				return outs;
			}
			return value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
		};
		for (const lang of ['en', 'ms'] as const) {
			for (const text of strings(copy[lang])) {
				expect(text.split('**').length % 2, `${lang}: ${text}`).toBe(1);
			}
		}
	});
	it('joins number lists with the language’s own "and"', () => {
		expect(copy.en.s22.and([6, 8, 12])).toBe('6, 8 and 12');
		expect(copy.ms.s22.and([6, 8, 12])).toBe('6, 8 dan 12');
		expect(copy.ms.s22.and([6, 8])).toBe('6 dan 8');
	});
	it('has the same shape in English and Malay', () => {
		const shape = (v: unknown): unknown =>
			v && typeof v === 'object'
				? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)]))
				: typeof v;
		expect(shape(copy.ms)).toEqual(shape(copy.en));
	});
});
