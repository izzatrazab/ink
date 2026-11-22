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

/** A Mini-game a chapter offers beside its Sections: no textbook number (ADR-0012). */
export interface MiniGameMeta {
	/** Route segment under the chapter's mini-games hub, e.g. "prime-hunt". */
	slug: string;
	title: string;
	/** One-line summary shown on the hub. */
	description: string;
}

/** A chapter's text in another language: same shape, sections and games matched by `slug`. */
export interface ChapterTranslation {
	title: string;
	description: string;
	sections: Record<string, Pick<SectionMeta, 'title' | 'description' | 'outline'>>;
	miniGames?: Record<string, Pick<MiniGameMeta, 'title' | 'description'>>;
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
	/** Mini-games, listed on the chapter's hub at `/<slug>/mini-games`. A chapter without any has no hub. */
	miniGames?: MiniGameMeta[];
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
			},
			{
				number: '2.3',
				slug: '2-3',
				title: 'HCF and LCM Compared',
				description: 'Splitting or waiting? Two repeated divisions, two questions.',
				outline: [
					'What each one asks',
					'The two repeated divisions side by side',
					'Which one do I need?'
				]
			}
		],
		miniGames: [
			{
				slug: 'prime-hunt',
				title: 'Prime Hunt',
				description: 'Tap every prime on the board — and learn the primes by heart.'
			},
			{
				slug: 'prime-breaker',
				title: 'Prime Breaker',
				description:
					'Break numbers down with primes — prime factors, HCF and LCM by repeated division.'
			},
			{
				slug: 'multiples-hunt',
				title: 'Multiples Hunt',
				description: 'Tap every multiple — then every common multiple of two or three numbers.'
			},
			{
				slug: 'meet-again',
				title: 'Meet Again',
				description: 'Lights blink at different rhythms — tap when they all light up together.'
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
					},
					'2-3': {
						title: 'FSTB dan GSTK Dibandingkan',
						description: 'Membahagi atau menunggu? Dua pembahagian berulang, dua soalan.',
						outline: [
							'Apa yang ditanya oleh setiap satu',
							'Dua pembahagian berulang bersebelahan',
							'Yang mana satu perlu saya guna?'
						]
					}
				},
				miniGames: {
					'prime-hunt': {
						title: 'Buru Nombor Perdana',
						description: 'Ketik setiap nombor perdana pada papan — dan hafal nombor perdana.'
					},
					'prime-breaker': {
						title: 'Pemecah Perdana',
						description:
							'Pecahkan nombor dengan nombor perdana — faktor perdana, FSTB dan GSTK melalui pembahagian berulang.'
					},
					'multiples-hunt': {
						title: 'Buru Gandaan',
						description:
							'Ketik setiap gandaan — kemudian setiap gandaan sepunya bagi dua atau tiga nombor.'
					},
					'meet-again': {
						title: 'Bertemu Lagi',
						description:
							'Lampu berkelip dengan rentak berbeza — ketik apabila semuanya menyala serentak.'
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
		sections: chapter.sections.map((s) => ({ ...s, ...tr.sections[s.slug] })),
		miniGames: chapter.miniGames?.map((g) => ({ ...g, ...tr.miniGames?.[g.slug] }))
	};
}

export function getChapter(slug: string): Chapter {
	const chapter = chapters.find((c) => c.slug === slug);
	if (!chapter) throw new Error(`Unknown chapter: ${slug}`);
	return chapter;
}

/** The title of the Section numbered `number` (e.g. "2.1") in this chapter's language. */
export function sectionTitle(chapter: Chapter, number: string): string {
	const section = chapter.sections.find((s) => s.number === number);
	if (!section) throw new Error(`Unknown section ${number} in chapter ${chapter.slug}`);
	return section.title;
}

/** The title of the Mini-game `slug` in this chapter's language. */
export function miniGameTitle(chapter: Chapter, slug: string): string {
	const game = chapter.miniGames?.find((g) => g.slug === slug);
	if (!game) throw new Error(`Unknown mini-game ${slug} in chapter ${chapter.slug}`);
	return game.title;
}

export function chapterHref(chapter: Chapter): string {
	return `/${chapter.slug}`;
}

export function sectionHref(chapter: Chapter, section: SectionMeta): string {
	return `/${chapter.slug}/${section.slug}`;
}

export function miniGamesHref(chapter: Chapter): string {
	return `/${chapter.slug}/mini-games`;
}

export function miniGameHref(chapter: Chapter, game: MiniGameMeta): string {
	return `${miniGamesHref(chapter)}/${game.slug}`;
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
		interactive: 'interactive lessons',
		miniGames: 'Mini-games',
		miniGamesBlurb: 'Short games to practise until it sticks.',
		play: 'Play',
		allMiniGames: '← All mini-games',
		backToChapter: '← Chapter home',
		miniGameNav: 'Mini-game navigation'
	},
	ms: {
		form: 'Tingkatan',
		chapter: 'Bab',
		allSections: '← Semua bahagian',
		sectionList: 'Senarai bahagian',
		comingSoon: 'Akan datang',
		noSections: 'Bahagian untuk bab ini akan datang.',
		sectionNav: 'Navigasi bahagian',
		interactive: 'pelajaran interaktif',
		miniGames: 'Mini-permainan',
		miniGamesBlurb: 'Permainan pendek untuk berlatih sehingga lekat di kepala.',
		play: 'Main',
		allMiniGames: '← Semua mini-permainan',
		backToChapter: '← Laman bab',
		miniGameNav: 'Navigasi mini-permainan'
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
