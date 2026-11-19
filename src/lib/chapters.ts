// The chapter registry: the one place that knows which textbook chapters the
// app teaches. The home page, each chapter landing, and <LessonShell>'s header
// and back-link all read from here, so adding a chapter is one entry plus a
// route folder at `/<slug>` (ADR-0011). Section pages stay hand-written.

export type Language = 'en' | 'ms';

export interface SectionMeta {
	/** Section number as printed in the textbook, e.g. "11.2". */
	number: string;
	/** Route segment under the chapter, e.g. "11-2". */
	slug: string;
	title: string;
	/** One-line summary shown on the chapter landing. */
	description: string;
	/** Headings the section will cover, in textbook order (the landing's outline). */
	outline?: string[];
	/** False while the section is only outlined and has no page yet. Defaults to true. */
	ready?: boolean;
}

/** A chapter's text in another language: same shape, sections matched by `slug`. */
export interface ChapterTranslation {
	title: string;
	description: string;
	sections: Record<string, Pick<SectionMeta, 'title' | 'description' | 'outline'>>;
}

export interface Chapter {
	/** Route segment, e.g. "transformasi-isometri" — the chapter lives at `/<slug>`. */
	slug: string;
	/** Form (Tingkatan), 1–5. */
	form: number;
	/** Chapter (Bab) number within that form. */
	number: number;
	/** Language the chapter's own text is written in; follows its textbook. */
	lang: Language;
	title: string;
	description: string;
	/** Sections in textbook order. Empty while a chapter is only scaffolded. */
	sections: SectionMeta[];
	/** Other languages the reader can switch to, keyed by language. A chapter with
	 *  translations shows a language toggle; the others stay in their own language. */
	translations?: Partial<Record<Language, ChapterTranslation>>;
}

export const chapters: Chapter[] = [
	{
		slug: 'factors-and-multiples',
		form: 1,
		number: 2,
		lang: 'en',
		title: 'Factors and Multiples',
		description: 'Factors, multiples, and what numbers have in common.',
		sections: [
			{
				number: '2.1',
				slug: '2-1',
				title: 'Factors, Prime Factors and Highest Common Factor (HCF)',
				description: 'What divides a number — and what numbers share.',
				outline: [
					'Factors',
					'Prime factors',
					'Common factors',
					'Highest common factor (HCF)',
					'Solving problems with HCF'
				]
			},
			{
				number: '2.2',
				slug: '2-2',
				title: 'Multiples, Common Multiples and Lowest Common Multiple (LCM)',
				description: 'Counting in steps — and where two counts meet.',
				outline: ['Common multiples', 'Lowest common multiple (LCM)', 'Solving problems with LCM']
			}
		],
		translations: {
			ms: {
				title: 'Faktor dan Gandaan',
				description: 'Faktor, gandaan, dan apa yang dikongsi oleh nombor.',
				sections: {
					'2-1': {
						title: 'Faktor, Faktor Perdana dan Faktor Sepunya Terbesar (FSTB)',
						description: 'Apa yang membahagi sesuatu nombor — dan apa yang dikongsi oleh nombor.',
						outline: [
							'Faktor',
							'Faktor perdana',
							'Faktor sepunya',
							'Faktor sepunya terbesar (FSTB)',
							'Penyelesaian masalah dengan FSTB'
						]
					},
					'2-2': {
						title: 'Gandaan, Gandaan Sepunya dan Gandaan Sepunya Terkecil (GSTK)',
						description: 'Mengira dengan langkah tetap — dan di mana dua pengiraan bertemu.',
						outline: [
							'Gandaan sepunya',
							'Gandaan sepunya terkecil (GSTK)',
							'Penyelesaian masalah dengan GSTK'
						]
					}
				}
			}
		}
	},
	{
		slug: 'transformasi-isometri',
		form: 2,
		number: 11,
		lang: 'ms',
		title: 'Transformasi Isometri',
		description:
			'Belajar bagaimana sesuatu objek berubah kedudukan, orientasi, atau saiz — dan apa yang kekal sama apabila ia berubah.',
		sections: [
			{
				number: '11.1',
				slug: '11-1',
				title: 'Transformasi dan Kekongruenan',
				description: 'Apa itu transformasi, objek dan imej, serta maksud kekongruenan.'
			},
			{
				number: '11.2',
				slug: '11-2',
				title: 'Translasi',
				description:
					'Bagaimana setiap titik beralih anjakan (a, b) yang sama, mengekalkan bentuk, saiz, dan orientasi.'
			}
		]
	}
];

/** Languages a reader can read this chapter in: its own, plus any translations. */
export function languagesOf(chapter: Chapter): Language[] {
	return [chapter.lang, ...(Object.keys(chapter.translations ?? {}) as Language[])];
}

/** The chapter's text in `lang`, falling back to its own language when it has no
 *  such translation. The result's `lang` is the language actually used, so
 *  `chapterText` and `chapterLabel` follow along. */
export function localize(chapter: Chapter, lang: Language): Chapter {
	const tr = lang === chapter.lang ? undefined : chapter.translations?.[lang];
	if (!tr) return chapter;
	return {
		...chapter,
		lang,
		title: tr.title,
		description: tr.description,
		sections: chapter.sections.map((s) => ({ ...s, ...tr.sections[s.slug] }))
	};
}

export function getChapter(slug: string): Chapter {
	const chapter = chapters.find((c) => c.slug === slug);
	if (!chapter) throw new Error(`Unknown chapter: ${slug}`);
	return chapter;
}

export function chapterHref(chapter: Chapter): string {
	return `/${chapter.slug}`;
}

export function sectionHref(chapter: Chapter, section: SectionMeta): string {
	return `/${chapter.slug}/${section.slug}`;
}

/** Fixed UI wording for a chapter's pages, in the chapter's own language. */
const ui = {
	en: {
		form: 'Form',
		chapter: 'Chapter',
		allSections: '← All sections',
		sectionList: 'Section list',
		comingSoon: 'Coming soon',
		noSections: 'Sections for this chapter are coming soon.',
		sectionNav: 'Section navigation',
		interactive: 'interactive lessons'
	},
	ms: {
		form: 'Tingkatan',
		chapter: 'Bab',
		allSections: '← Semua bahagian',
		sectionList: 'Senarai bahagian',
		comingSoon: 'Akan datang',
		noSections: 'Bahagian untuk bab ini akan datang.',
		sectionNav: 'Navigasi bahagian',
		interactive: 'pelajaran interaktif'
	}
} as const;

/** The fixed UI wording for a language. */
export function uiText(lang: Language) {
	return ui[lang];
}

export function chapterText(chapter: Chapter) {
	return uiText(chapter.lang);
}

/** Eyebrow text shown above titles, e.g. "Form 1 · Chapter 2". */
export function chapterLabel(chapter: Chapter): string {
	const t = chapterText(chapter);
	return `${t.form} ${chapter.form} · ${t.chapter} ${chapter.number}`;
}

/** Chapters grouped by form, forms and chapters in ascending order. */
export function chaptersByForm(): { form: number; chapters: Chapter[] }[] {
	const forms = [...new Set(chapters.map((c) => c.form))].sort((a, b) => a - b);
	return forms.map((form) => ({
		form,
		chapters: chapters.filter((c) => c.form === form).sort((a, b) => a.number - b.number)
	}));
}
