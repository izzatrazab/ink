// Every word Chapter 2 shows on screen, in both languages. Components and pure
// narration (ladder.ts) read from here, so nothing is hard-coded in markup and
// the `Copy` type makes the compiler insist that English and Malay stay in step.
//
// Strings may contain **bold**, rendered by <Rich>. Terms follow KSSM Matematik
// Tingkatan 1: faktor, faktor perdana, faktor sepunya terbesar (FSTB), gandaan,
// gandaan sepunya, gandaan sepunya terkecil (GSTK).

import type { Language } from '$lib/chapters';
import type { LatihanWording } from '$lib/transformasi/latihanWording';

export interface Copy {
	nav: { next21: string; prev22: string; next22: string };
	/** Page <meta name="description"> per Section (titles live in the chapter registry). */
	meta: { desc21: string; desc22: string };
	practice: string;
	yes: string;
	no: string;
	/** Wording the Latihan shell uses for this chapter (see LatihanShell `wording`). */
	quiz: LatihanWording;

	s21: {
		factorsHeading: string;
		factorsIntro: string;
		oneIsFactor: string;
		primeHeading: string;
		primeIntro: string;
		primeMethod: string;
		hcfHeading: string;
		hcfIntro: string;
		isFactorQ: (size: number, total: number) => string;
		factorYes: (total: number, size: number, rows: number) => string;
		leftOver: (rest: number) => string;
	};
	s22: {
		multiplesHeading: string;
		multiplesIntro: string;
		multiplesPrompt: string;
		lcmHeading: string;
		lcmIntro: string;
		lcmMethod: string;
		isCommonQ: (n: number, list: string) => string;
		commonYes: (n: number) => string;
		commonNo: (miss: number, n: number) => string;
		/** Joins numbers: "6, 8 and 12". */
		and: (numbers: number[]) => string;
	};

	tiles: {
		fewer: string;
		more: string;
		count: (n: number) => string;
		inEachRow: string;
		tap: string;
		complete: (total: number, perRow: number, rows: number) => string;
		leftOver: (rest: number, perRow: number) => string;
		found: (total: number, found: number, all: number) => string;
		allFound: (total: number, factors: number[]) => string;
		primeNote: (total: number) => string;
	};
	chart: {
		smaller: string;
		bigger: string;
		multiplesOf: (n: number) => string;
		both: string;
		numbersFrom: (limit: number) => string;
		cell: { both: string; a: string; b: string; none: string };
		same: string;
		many: (common: number[], first: number) => string;
		one: (first: number) => string;
	};
	lanes: { label: (d: number) => string };
	ladder: {
		number: string;
		aria: (row: string) => string;
		divisor: (d: number) => string;
		finished: string;
		divideBy: string;
		pickEvery: string;
		pickOne: string;
		pickPrime: (row: string) => string;
		hint: string;
		hideHint: string;
		watch: string;
		watchNote: string;
		undo: string;
		reset: string;
		hcf: string;
		lcm: string;
		notPrime1: string;
		notPrime: (d: number, a: number, b: number) => string;
		remainder: (n: number, d: number, r: number, every: boolean) => string;
		none: (d: number) => string;
		broughtDown: (kept: number[]) => string;
		doneSingle: (before: string, d: number, next: string) => string;
		doneHcf: (before: string, d: number, next: string) => string;
		doneLcm: (before: string, d: number, next: string, down: string) => string;
		keepGoing: (before: string, d: number, next: string) => string;
		step: (before: string, d: number, next: string, down: string) => string;
	};
}

const en: Copy = {
	nav: {
		next21: '2.1 Factors and HCF →',
		prev22: '← 2.1 Factors and HCF',
		next22: '2.2 Multiples and LCM →'
	},
	meta: {
		desc21:
			'Section 2.1: factors, prime factors and the highest common factor — explored with tiles and a step-by-step division ladder.',
		desc22:
			'Section 2.2: multiples, common multiples and the lowest common multiple — explored with a number chart and a division ladder.'
	},
	practice: 'Practice',
	yes: 'Yes',
	no: 'No',
	quiz: {
		questionOf: (i, n) => `Question ${i + 1} of ${n}`,
		correct: 'Correct!',
		incorrect: 'Not quite.',
		nextQuestion: 'Next question',
		allDone: 'Well done — you have finished every question.'
	},

	s21: {
		factorsHeading: 'What are factors?',
		factorsIntro:
			'A **factor** of a number divides it completely, with nothing left over. Can you split the tiles into equal rows?',
		oneIsFactor: '1 is a factor of every number.',
		primeHeading: 'Prime factors',
		primeIntro:
			'A factor that is a prime number is a **prime factor**. The factors of 18 are 1, **2**, **3**, 6, 9, 18 — so 18 = 2 × 3 × 3. This is called **prime factorisation**.',
		primeMethod:
			'Find it by **repeated division**: keep dividing by primes until you reach **1**. The primes on the left are the prime factors.',
		hcfHeading: 'Highest common factor (HCF)',
		hcfIntro:
			'A number that divides them all is a **common factor**. The biggest is the **highest common factor (HCF)**. Find it with the ladder — the prime must go into **every** number. Multiply the left column.',
		isFactorQ: (size, total) => `Is **${size}** a factor of **${total}**?`,
		factorYes: (total, size, rows) => `${total} = ${size} × ${rows}. Nothing left over.`,
		leftOver: (rest) => `${rest} ${rest === 1 ? 'tile is' : 'tiles are'} left over.`
	},
	s22: {
		multiplesHeading: 'Common multiples',
		multiplesIntro:
			'Count in 9s: 9, 18, 27, … These are the **multiples** of 9. A number that is a multiple of two numbers is a **common multiple** of them.',
		multiplesPrompt: 'Pick two numbers. Green means common. What pattern do you see?',
		lcmHeading: 'Lowest common multiple (LCM)',
		lcmIntro:
			'The smallest common multiple of 6 and 8 is 24 — the **lowest common multiple (LCM)**.',
		lcmMethod:
			'Use the ladder again, with one change: the prime needs to go into **at least one** number. The others come down unchanged. Stop at all 1s, then multiply the left column.',
		isCommonQ: (n, list) => `Is **${n}** a common multiple of **${list}**?`,
		commonYes: (n) => `Counting in each one lands on ${n}.`,
		commonNo: (miss, n) => `Counting in ${miss}s skips over ${n}.`,
		and: (nums) => nums.join(', ').replace(/, (\d+)$/, ' and $1')
	},

	tiles: {
		fewer: 'Fewer tiles',
		more: 'More tiles',
		count: (n) => `${n} tiles`,
		inEachRow: 'Tiles in each row',
		tap: 'Tap a number: how many tiles in each row?',
		complete: (total, perRow, rows) =>
			`**${rows}** ${rows === 1 ? 'row' : 'rows'} of **${perRow}**, none left over. So **${perRow}** and **${rows}** are factors!`,
		leftOver: (rest, perRow) => `**${rest}** left over. ${perRow} is not a factor.`,
		found: (total, found, all) => `Factors of ${total} found: ${found} of ${all}`,
		allFound: (total, factors) => `All found! Factors of ${total}: ${factors.join(', ')}.`,
		primeNote: (total) => `Only one rectangle (1 × ${total}) — that makes it a **prime number**.`
	},
	chart: {
		smaller: 'Smaller number',
		bigger: 'Bigger number',
		multiplesOf: (n) => `Multiples of ${n}`,
		both: 'multiples of both',
		numbersFrom: (limit) => `Numbers from 1 to ${limit}`,
		cell: {
			both: 'multiple of both',
			a: 'multiple of the first number',
			b: 'multiple of the second number',
			none: 'not a multiple'
		},
		same: 'Same number — every multiple is common.',
		many: (common, first) =>
			`Common multiples: **${common.join(', ')}**. All are multiples of ${first}.`,
		one: (first) => `Common multiple: **${first}**. Next: ${first * 2}, ${first * 3}, …`
	},
	lanes: { label: (d) => `${d}s` },
	ladder: {
		number: 'Number',
		aria: (row) => `Division ladder for ${row}`,
		divisor: (d) => `divisor ${d}`,
		finished: 'Finished',
		divideBy: 'Divide by…',
		pickEvery: 'Pick a prime that goes into **every** number.',
		pickOne: 'Pick a prime that goes into **at least one**.',
		pickPrime: (row) => `Pick a prime that goes into **${row}**.`,
		hint: 'Hint',
		hideHint: 'Hide hint',
		watch: 'Watch it',
		watchNote: 'Watch: always the smallest prime that fits.',
		undo: 'Undo',
		reset: 'Start over',
		hcf: 'HCF',
		lcm: 'LCM',
		notPrime1: '1 changes nothing. Pick a prime.',
		notPrime: (d, a, b) => `${d} is not prime (${a} × ${b}). Try a prime, like ${a}.`,
		remainder: (n, d, r, every) =>
			`${n} ÷ ${d} leaves ${r}, so ${d} does not go in.${every ? ' It must go into every number.' : ''}`,
		none: (d) => `${d} goes into none of them. Pick a prime that fits at least one.`,
		broughtDown: (kept) =>
			` ${kept.join(' and ')} come${kept.length === 1 ? 's' : ''} down unchanged.`,
		doneSingle: (b, d, n) => `${b} ÷ ${d} = ${n}. We reached 1! Multiply the left column.`,
		doneHcf: (b, d, n) =>
			`${b} ÷ ${d} = ${n}. No prime fits all of them, so stop. Multiply the left column: that is the HCF.`,
		doneLcm: (b, d, n, down) =>
			`${b} ÷ ${d} = ${n}.${down} All 1s, so stop. Multiply the left column: that is the LCM.`,
		keepGoing: (b, d, n) => `${b} ÷ ${d} = ${n}. Keep going.`,
		step: (b, d, n, down) => `Divide by ${d}: ${b} → ${n}.${down}`
	}
};

const ms: Copy = {
	nav: {
		next21: '2.1 Faktor dan FSTB →',
		prev22: '← 2.1 Faktor dan FSTB',
		next22: '2.2 Gandaan dan GSTK →'
	},
	meta: {
		desc21:
			'Bahagian 2.1: faktor, faktor perdana dan faktor sepunya terbesar — diterokai dengan jubin dan tangga pembahagian langkah demi langkah.',
		desc22:
			'Bahagian 2.2: gandaan, gandaan sepunya dan gandaan sepunya terkecil — diterokai dengan carta nombor dan tangga pembahagian.'
	},
	practice: 'Latihan',
	yes: 'Ya',
	no: 'Tidak',
	quiz: {
		questionOf: (i, n) => `Soalan ${i + 1} daripada ${n}`,
		correct: 'Betul!',
		incorrect: 'Belum tepat.',
		nextQuestion: 'Pasangan seterusnya',
		allDone: 'Tahniah — anda telah menyelesaikan semua soalan.'
	},

	s21: {
		factorsHeading: 'Apakah faktor?',
		factorsIntro:
			'**Faktor** bagi sesuatu nombor membahagikannya dengan tepat, tanpa baki. Bolehkah anda membahagikan jubin kepada baris yang sama banyak?',
		oneIsFactor: '1 ialah faktor bagi setiap nombor.',
		primeHeading: 'Faktor perdana',
		primeIntro:
			'Faktor yang merupakan nombor perdana ialah **faktor perdana**. Faktor bagi 18 ialah 1, **2**, **3**, 6, 9, 18 — jadi 18 = 2 × 3 × 3. Ini dipanggil **pemfaktoran perdana**.',
		primeMethod:
			'Cari dengan **pembahagian berulang**: terus bahagi dengan nombor perdana sehingga mencapai **1**. Nombor perdana di sebelah kiri ialah faktor perdana.',
		hcfHeading: 'Faktor sepunya terbesar (FSTB)',
		hcfIntro:
			'Nombor yang membahagikan kesemuanya ialah **faktor sepunya**. Yang terbesar ialah **faktor sepunya terbesar (FSTB)**. Cari dengan tangga — nombor perdana mesti membahagi **setiap** nombor. Darabkan lajur kiri.',
		isFactorQ: (size, total) => `Adakah **${size}** faktor bagi **${total}**?`,
		factorYes: (total, size, rows) => `${total} = ${size} × ${rows}. Tiada baki.`,
		leftOver: (rest) => `${rest} jubin berbaki.`
	},
	s22: {
		multiplesHeading: 'Gandaan sepunya',
		multiplesIntro:
			'Kira dalam 9: 9, 18, 27, … Ini ialah **gandaan** bagi 9. Nombor yang menjadi gandaan bagi dua nombor ialah **gandaan sepunya** bagi kedua-duanya.',
		multiplesPrompt: 'Pilih dua nombor. Hijau bermaksud sepunya. Apakah corak yang anda nampak?',
		lcmHeading: 'Gandaan sepunya terkecil (GSTK)',
		lcmIntro:
			'Gandaan sepunya yang paling kecil bagi 6 dan 8 ialah 24 — **gandaan sepunya terkecil (GSTK)**.',
		lcmMethod:
			'Guna tangga itu semula, dengan satu perubahan: nombor perdana perlu membahagi **sekurang-kurangnya satu** nombor. Yang lain diturunkan tanpa berubah. Berhenti apabila semuanya 1, kemudian darabkan lajur kiri.',
		isCommonQ: (n, list) => `Adakah **${n}** gandaan sepunya bagi **${list}**?`,
		commonYes: (n) => `Mengira dalam setiap satu akan sampai ke ${n}.`,
		commonNo: (miss, n) => `Mengira dalam ${miss} melangkaui ${n}.`,
		and: (nums) => nums.join(', ').replace(/, (\d+)$/, ' dan $1')
	},

	tiles: {
		fewer: 'Kurangkan jubin',
		more: 'Tambah jubin',
		count: (n) => `${n} jubin`,
		inEachRow: 'Jubin dalam setiap baris',
		tap: 'Ketik satu nombor: berapa jubin dalam setiap baris?',
		complete: (total, perRow, rows) =>
			`**${rows}** baris, setiap baris **${perRow}**, tiada baki. Jadi **${perRow}** dan **${rows}** ialah faktor!`,
		leftOver: (rest, perRow) => `Berbaki **${rest}**. ${perRow} bukan faktor.`,
		found: (total, found, all) => `Faktor bagi ${total} ditemui: ${found} daripada ${all}`,
		allFound: (total, factors) => `Semua ditemui! Faktor bagi ${total}: ${factors.join(', ')}.`,
		primeNote: (total) =>
			`Hanya satu segi empat tepat (1 × ${total}) — itu menjadikannya **nombor perdana**.`
	},
	chart: {
		smaller: 'Nombor lebih kecil',
		bigger: 'Nombor lebih besar',
		multiplesOf: (n) => `Gandaan ${n}`,
		both: 'gandaan kedua-duanya',
		numbersFrom: (limit) => `Nombor dari 1 hingga ${limit}`,
		cell: {
			both: 'gandaan kedua-duanya',
			a: 'gandaan nombor pertama',
			b: 'gandaan nombor kedua',
			none: 'bukan gandaan'
		},
		same: 'Nombor yang sama — setiap gandaan ialah gandaan sepunya.',
		many: (common, first) =>
			`Gandaan sepunya: **${common.join(', ')}**. Semuanya gandaan bagi ${first}.`,
		one: (first) => `Gandaan sepunya: **${first}**. Seterusnya: ${first * 2}, ${first * 3}, …`
	},
	lanes: { label: (d) => `+${d}` },
	ladder: {
		number: 'Nombor',
		aria: (row) => `Tangga pembahagian untuk ${row}`,
		divisor: (d) => `pembahagi ${d}`,
		finished: 'Selesai',
		divideBy: 'Bahagi dengan…',
		pickEvery: 'Pilih nombor perdana yang membahagi **setiap** nombor.',
		pickOne: 'Pilih nombor perdana yang membahagi **sekurang-kurangnya satu**.',
		pickPrime: (row) => `Pilih nombor perdana yang membahagi **${row}**.`,
		hint: 'Petunjuk',
		hideHint: 'Sembunyi petunjuk',
		watch: 'Tonton',
		watchNote: 'Tonton: sentiasa nombor perdana terkecil yang sesuai.',
		undo: 'Buat asal',
		reset: 'Mula semula',
		hcf: 'FSTB',
		lcm: 'GSTK',
		notPrime1: '1 tidak mengubah apa-apa. Pilih nombor perdana.',
		notPrime: (d, a, b) =>
			`${d} bukan nombor perdana (${a} × ${b}). Cuba nombor perdana, seperti ${a}.`,
		remainder: (n, d, r, every) =>
			`${n} ÷ ${d} berbaki ${r}, jadi ${d} tidak boleh membahagi.${every ? ' Ia mesti membahagi setiap nombor.' : ''}`,
		none: (d) =>
			`${d} tidak membahagi mana-mana nombor. Pilih nombor perdana yang membahagi sekurang-kurangnya satu.`,
		broughtDown: (kept) => ` ${kept.join(' dan ')} diturunkan tanpa berubah.`,
		doneSingle: (b, d, n) => `${b} ÷ ${d} = ${n}. Kita sampai 1! Darabkan lajur kiri.`,
		doneHcf: (b, d, n) =>
			`${b} ÷ ${d} = ${n}. Tiada nombor perdana yang membahagi kesemuanya, jadi berhenti. Darabkan lajur kiri: itulah FSTB.`,
		doneLcm: (b, d, n, down) =>
			`${b} ÷ ${d} = ${n}.${down} Semuanya 1, jadi berhenti. Darabkan lajur kiri: itulah GSTK.`,
		keepGoing: (b, d, n) => `${b} ÷ ${d} = ${n}. Teruskan.`,
		step: (b, d, n, down) => `Bahagi dengan ${d}: ${b} → ${n}.${down}`
	}
};

export const copy: Record<Language, Copy> = { en, ms };

/** Splits a string with **bold** markers into plain and bold runs, in order. */
export function parseRich(text: string): { text: string; bold: boolean }[] {
	return text
		.split('**')
		.map((part, i) => ({ text: part, bold: i % 2 === 1 }))
		.filter((run) => run.text !== '');
}
