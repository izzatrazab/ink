// Every word Chapter 2 shows on screen, in both languages. Components and pure
// narration (ladder.ts) read from here, so nothing is hard-coded in markup and
// the `Copy` type makes the compiler insist that English and Malay stay in step.
//
// Strings may contain **bold**, rendered by <Rich>. Terms follow KSSM Matematik
// Tingkatan 1: faktor, faktor perdana, faktor sepunya terbesar (FSTB), gandaan,
// gandaan sepunya, gandaan sepunya terkecil (GSTK).

import type { Language } from '$lib/chapters';
import type { LatihanWording } from '$lib/transformasi/latihanWording';
import type { Kind, ProblemKey } from './hcfLcmQuiz';

export interface Copy {
	nav: { next21: string; prev22: string; next22: string; prev23: string; next23: string };
	/** Page <meta name="description"> per Section (titles live in the chapter registry). */
	meta: { desc21: string; desc22: string; desc23: string };
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
		primeWhy: string;
		primeIntro: string;
		primeMethod: string;
		hcfHeading: string;
		hcfIntro: string;
		hcfLanesIntro: string;
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
		lcmLanesIntro: string;
		isCommonQ: (n: number, list: string) => string;
		commonYes: (n: number) => string;
		commonNo: (miss: number, n: number) => string;
		/** Joins numbers: "6, 8 and 12". */
		and: (numbers: number[]) => string;
	};

	s23: {
		introHeading: string;
		intro: string;
		tableHeading: string;
		aspectHead: string;
		rows: { aspect: string; hcf: string; lcm: string }[];
		lanesHeading: string;
		lanesIntro: string;
		ladderHeading: string;
		ladderIntro: string;
		cluesHeading: string;
		cluesIntro: string;
		hcfClue: { title: string; problem: string; answer: string; why: string };
		lcmClue: { title: string; problem: string; answer: string; why: string };
		quiz: {
			question: string;
			problems: Record<ProblemKey, string>;
			feedback: (kind: Kind, list: string, result: number) => string;
			tryLadder: string;
		};
	};
	compare: {
		hcfRule: string;
		lcmRule: string;
		step: string;
		stepsTaken: (n: number) => string;
		stopHcf: string;
		broughtDown: string;
		summary: (hcf: number, lcm: number) => string;
		aria: (row: string) => string;
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
	lanes: {
		label: (d: number) => string;
		hcfTitle: string;
		lcmTitle: string;
		lcmCaption: (list: string, lcm: number) => string;
		factorsOf: (n: number) => string;
		commonLegend: string;
		commonCaption: (list: string, hcf: number) => string;
		replay: string;
		addLane: string;
		removeLane: (n: number) => string;
		laneLabel: (n: number) => string;
		addSecond: string;
		ownInvalid: string;
		tooLong: (lcm: number) => string;
	};
	ladder: {
		number: string;
		own: string;
		ownPlaceholder: string;
		ownGo: string;
		ownEmpty: string;
		ownInvalid: (single: boolean) => string;
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
	games: {
		/** <meta name="description"> for the mini-games hub. */
		hubDesc: string;
		/** What each game card on the hub says about the reader's progress. */
		hub: {
			notPlayed: string;
			primesKnown: (n: number, total: number) => string;
			levelsMastered: (n: number, total: number) => string;
		};
		/** The "play a game" box at the end of a lesson beat. */
		practise: { heading: string; play: string };
		primeHunt: {
			/** <meta name="description"> for the game page. */
			desc: string;
			intro: string;
			loading: string;
			tierGroup: string;
			tier: (max: number) => string;
			lockedTier: (max: number, before: number) => string;
			known: (known: number, total: number) => string;
			studyOpen: string;
			studyClose: string;
			studyHeading: (max: number) => string;
			studyNote: string;
			studyLocked: string;
			instruction: string;
			left: (n: number) => string;
			soundOn: string;
			soundOff: string;
			next: string;
			boardAria: string;
			cell: (n: number, state: 'open' | 'found' | 'wrong') => string;
			headline: (stars: 1 | 2 | 3) => string;
			stars: (stars: number) => string;
			streak: (n: number) => string;
			reviewHeading: string;
			explainOne: string;
			explainPrime: (n: number) => string;
			explainPair: (n: number, a: number, b: number) => string;
			wrong: string;
			unlocked: (max: number) => string;
		};
		primeBreaker: {
			desc: string;
			intro: string;
			loading: string;
			kindGroup: string;
			kind: (kind: 'single' | 'hcf' | 'lcm') => string;
			lockedKind: (kind: string, before: string) => string;
			clean: (n: number, of: number) => string;
			task: (kind: 'single' | 'hcf' | 'lcm', row: string) => string;
			primesGroup: string;
			soundOn: string;
			soundOff: string;
			skip: string;
			next: string;
			headline: (stars: 1 | 2 | 3) => string;
			stars: (stars: number) => string;
			streak: (n: number) => string;
			mistakes: (n: number) => string;
			unlocked: (kind: string) => string;
		};
		multiplesHunt: {
			desc: string;
			intro: string;
			loading: string;
			kindGroup: string;
			kind: (kind: 'one' | 'two' | 'three') => string;
			lockedKind: (kind: string, before: string) => string;
			clean: (n: number, of: number) => string;
			task: (kind: 'one' | 'two' | 'three', list: string) => string;
			hintOne: (n: number) => string;
			hintCommon: string;
			left: (n: number) => string;
			soundOn: string;
			soundOff: string;
			next: string;
			boardAria: string;
			cell: (n: number, state: 'open' | 'found' | 'wrong') => string;
			headline: (stars: 1 | 2 | 3) => string;
			stars: (stars: number) => string;
			streak: (n: number) => string;
			reviewHeading: string;
			wrong: string;
			explainMiss: (n: number, s: number, rest: number) => string;
			explainTrap: (n: number, of: number, s: number, rest: number) => string;
			lcmNote: (lcm: number, list: string) => string;
			unlocked: (kind: string) => string;
		};
		meetAgain: {
			desc: string;
			intro: string;
			loading: string;
			kindGroup: string;
			kind: (kind: 'two' | 'wide' | 'three') => string;
			lockedKind: (kind: string, before: string) => string;
			clean: (n: number, of: number) => string;
			tempoGroup: string;
			tempo: (tempo: 'step' | 'slow' | 'normal') => string;
			tempoHeld: string;
			task: string;
			lightsAria: string;
			light: (period: number) => string;
			on: string;
			off: string;
			beat: (n: number) => string;
			ready: string;
			start: string;
			together: string;
			pause: string;
			resume: string;
			paused: string;
			nextBeat: string;
			caught: (n: number, of: number) => string;
			early: (beat: number, period: number, rest: number) => string;
			missed: (beat: number, list: string) => string;
			headline: (stars: 1 | 2 | 3) => string;
			stars: (stars: number) => string;
			streak: (n: number) => string;
			reviewHeading: string;
			wrong: string;
			meetNote: (beats: string, lcm: number) => string;
			soundOn: string;
			soundOff: string;
			next: string;
			unlocked: (kind: string) => string;
		};
	};
}

const en: Copy = {
	nav: {
		next21: '2.1 Factors and HCF →',
		prev22: '← 2.1 Factors and HCF',
		next22: '2.2 Multiples and LCM →',
		prev23: '← 2.2 Multiples and LCM',
		next23: '2.3 HCF vs LCM →'
	},
	meta: {
		desc21:
			'Section 2.1: factors, prime factors and the highest common factor — explored with tiles and a step-by-step repeated division.',
		desc22:
			'Section 2.2: multiples, common multiples and the lowest common multiple — explored with a number chart and repeated division.',
		desc23:
			'Section 2.3: HCF and LCM compared — what each one asks, how their repeated divisions differ, and which to use.'
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
		primeWhy:
			'Listing every factor pair works for small numbers. For a number like 126 the list gets long, and it is easy to miss a pair. Prime numbers are the building blocks of every number, so if we break a number all the way down into primes, nothing is missed. **Repeated division** is a quick way to do that.',
		primeIntro:
			'A factor that is a prime number is a **prime factor**. The factors of 18 are 1, **2**, **3**, 6, 9, 18 — so 18 = 2 × 3 × 3. This is called **prime factorisation**.',
		primeMethod:
			'Find it by **repeated division**: keep dividing by primes until you reach **1**. The primes on the left are the prime factors.',
		hcfHeading: 'Highest common factor (HCF)',
		hcfIntro:
			'A number that divides them all is a **common factor**. The biggest is the **highest common factor (HCF)**. Find it by repeated division — the prime must go into **every** number. Multiply the left column.',
		hcfLanesIntro:
			'Another way to see the HCF: write each number as a product in every possible way. The factors that appear for every number are the common factors, and the biggest one is the HCF.',
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
			'Use repeated division again, with one change: the prime needs to go into **at least one** number. The others come down unchanged. Stop at all 1s, then multiply the left column.',
		lcmLanesIntro:
			'See it first: each number hops along its own lane in equal jumps. The first place where every lane lands together is the LCM.',
		isCommonQ: (n, list) => `Is **${n}** a common multiple of **${list}**?`,
		commonYes: (n) => `Counting in each one lands on ${n}.`,
		commonNo: (miss, n) => `Counting in ${miss}s skips over ${n}.`,
		and: (nums) => nums.join(', ').replace(/, (\d+)$/, ' and $1')
	},

	s23: {
		introHeading: 'Same numbers, two different questions',
		intro:
			'Take 12 and 18. The **HCF** asks: what is the biggest number that goes **into** both? The **LCM** asks: what is the smallest number that **both go into**? One looks down, the other looks up.',
		tableHeading: 'HCF and LCM at a glance',
		aspectHead: '',
		rows: [
			{
				aspect: 'The question',
				hcf: 'Biggest number that divides **all** of them',
				lcm: 'Smallest number that **all** of them divide'
			},
			{
				aspect: 'The prime must go into',
				hcf: '**every** number',
				lcm: '**at least one** number'
			},
			{
				aspect: 'A number it does not divide',
				hcf: 'The prime is refused',
				lcm: 'The number comes down unchanged'
			},
			{
				aspect: 'You stop when',
				hcf: 'No prime goes into every number',
				lcm: 'Every number is 1'
			},
			{
				aspect: 'Size of the answer',
				hcf: 'At most the smallest number',
				lcm: 'At least the biggest number'
			},
			{
				aspect: 'Clues in a problem',
				hcf: 'share equally, split into groups, greatest size',
				lcm: 'at the same time, meet again, repeats every, smallest amount'
			}
		],
		lanesHeading: 'The same numbers on lanes',
		lanesIntro:
			'HCF: write each number as factor pairs and spot the factors every number shares, the biggest is the HCF. LCM: hop along each lane until they all land together, the first meeting point.',
		ladderHeading: 'The two repeated divisions side by side',
		ladderIntro:
			'Both start from the same numbers. Press **Step** and watch them part ways: the HCF method may only use a prime that goes into every number, while the LCM method takes any prime that goes into one — and brings the rest down.',
		cluesHeading: 'Which one do I need?',
		cluesIntro: 'Look for the clue in the problem: are you splitting, or waiting?',
		hcfClue: {
			title: 'Splitting → HCF',
			problem:
				'A florist has 24 roses and 36 tulips. She makes identical bouquets using every flower. What is the greatest number of bouquets?',
			answer: 'HCF of 24 and 36 = **12** bouquets.',
			why: 'Cut the flowers into equal groups: 12 is the biggest group count that divides both 24 and 36.'
		},
		lcmClue: {
			title: 'Waiting → LCM',
			problem:
				'One bus leaves every 12 minutes and another every 18 minutes. They leave together now. When do they next leave together?',
			answer: 'LCM of 12 and 18 = **36** minutes.',
			why: 'Wait for the buses to meet: 36 is the first time both 12 and 18 land together.'
		},
		quiz: {
			question: 'Is this an HCF problem or an LCM problem?',
			problems: {
				tiles:
					'A floor 48 cm by 72 cm is covered with identical square tiles, with no cutting. What is the largest possible side of a tile?',
				lights:
					'Two lights flash together now. One flashes every 15 seconds and the other every 20 seconds. After how many seconds will they next flash together?',
				groups:
					'A teacher splits 36 boys and 45 girls into identical groups, using every student. What is the greatest number of groups?',
				packs:
					'Pens come in packs of 6 and pencils in packs of 8. What is the smallest number of pens that matches an equal number of pencils?',
				ribbons:
					'Ribbons of 40 cm, 56 cm and 72 cm are cut into equal pieces with nothing left over. What is the longest possible piece?',
				buses:
					'Three buses leave a terminal together. They then leave every 10, 12 and 15 minutes. After how many minutes do all three leave together again?'
			},
			feedback: (kind, list, result) =>
				kind === 'hcf'
					? `Splitting into equal parts needs a number that goes into all of them: HCF of ${list} = ${result}.`
					: `Waiting for things to line up needs a number they all go into: LCM of ${list} = ${result}.`,
			tryLadder: 'Check it with repeated division: press Step and see which one gives the answer.'
		}
	},
	compare: {
		hcfRule: 'The prime must go into **every** number.',
		lcmRule: 'The prime must go into **at least one** number.',
		step: 'Step',
		stepsTaken: (n) => `Step ${n}`,
		stopHcf: 'Stop: no prime goes into all of them.',
		broughtDown: 'Brought down unchanged',
		summary: (hcf, lcm) =>
			`**HCF = ${hcf}**: small, it goes into every number. **LCM = ${lcm}**: big, every number goes into it.`,
		aria: (row) => `HCF and LCM repeated division for ${row}`
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
		found: (total, found, all) => `Factor pairs of ${total} found: ${found} of ${all}`,
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
	lanes: {
		label: (d) => `${d}s`,
		hcfTitle: 'HCF: list the factor pairs',
		lcmTitle: 'LCM: wait until they line up',
		lcmCaption: (list, lcm) =>
			`Jumping in ${list}, the lanes first land together on **${lcm}**: **LCM = ${lcm}**.`,
		factorsOf: (n) => `Factors of ${n}`,
		commonLegend: 'Highlighted = a factor of every number (common factor)',
		commonCaption: (list, hcf) =>
			`Only some factors of ${list} appear for every number. These are the **common factors**. The biggest of them is the **HCF = ${hcf}**.`,
		replay: 'Replay',
		addLane: 'Add lane',
		removeLane: (n) => `Remove lane ${n}`,
		laneLabel: (n) => `Lane ${n}`,
		addSecond: 'Type a number on the lane, then add a second lane to compare.',
		ownInvalid: 'Use whole numbers from 2 to 999, each different.',
		tooLong: (lcm) => `The LCM is ${lcm}, too long to draw. Try smaller numbers.`
	},
	ladder: {
		number: 'Number',
		own: 'Your own',
		ownPlaceholder: 'e.g. 48, 90',
		ownGo: 'Start',
		ownEmpty: 'Type your own numbers above, then press Start.',
		ownInvalid: (single) =>
			single
				? 'Enter one whole number from 2 to 999.'
				: 'Enter 2 to 4 whole numbers from 2 to 999, separated by commas.',
		aria: (row) => `Repeated division for ${row}`,
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
	},
	games: {
		hubDesc: 'Short games for Factors and Multiples: practise until the facts stick.',
		hub: {
			notPlayed: 'Not played yet',
			primesKnown: (n, total) => `${n} of ${total} primes known`,
			levelsMastered: (n, total) => `${n} of ${total} levels mastered`
		},
		practise: { heading: 'Practise this in a game', play: 'Play' },
		primeHunt: {
			desc: 'Prime Hunt: tap every prime number on the board, and learn the primes up to 100 by heart.',
			intro:
				'Sixteen numbers, some of them prime. Tap **every prime** you can spot: each tap is judged straight away. A prime has exactly two factors: 1 and itself.',
			loading: 'Dealing a board…',
			tierGroup: 'Primes to learn',
			tier: (max) => `2–${max}`,
			lockedTier: (max, before) => `2–${max}, unlocks when you know every prime up to ${before}`,
			known: (known, total) => `${known} of ${total} primes known`,
			studyOpen: 'Study the primes',
			studyClose: 'Hide the primes',
			studyHeading: (max) => `The primes up to ${max}`,
			studyNote: 'Each of these has only two factors: 1 and itself.',
			studyLocked: 'Studying is closed while a board is in play. Finish it first.',
			instruction: 'Tap the numbers you think are prime.',
			left: (n) => (n === 1 ? '1 prime left' : `${n} primes left`),
			soundOn: 'Sound on',
			soundOff: 'Sound off',
			next: 'Next board',
			boardAria: 'Numbers on the board',
			cell: (n, state) =>
				({
					open: `${n}`,
					found: `${n}: prime, found`,
					wrong: `${n}: not prime`
				})[state],
			headline: (stars) =>
				stars === 3 ? 'Perfect board!' : stars === 2 ? 'So close: one slip.' : 'Keep hunting!',
			stars: (stars) => `${stars} of 3 stars`,
			streak: (n) => `${n} perfect ${n === 1 ? 'board' : 'boards'} in a row`,
			reviewHeading: 'Look again at these',
			explainOne: '1 has only one factor, so it is not prime.',
			explainPrime: (n) => `${n} is prime: its only factors are 1 and ${n}.`,
			explainPair: (n, a, b) => `${n} is not prime: ${n} = ${a} × ${b}.`,
			wrong: 'Not prime',
			unlocked: (max) => `Well done! Primes 2–${max} unlocked.`
		},
		primeBreaker: {
			desc: 'Prime Breaker: break numbers down by dividing with primes, one rung at a time, for prime factors, HCF and LCM.',
			intro:
				'Break the number down by **repeated division**. Tap a prime to divide by it: a prime that fits drops a new row, and one that does not fit is refused at once, with the reason. Finish the ladder with as few slips as you can.',
			loading: 'Dealing a round…',
			kindGroup: 'What to break',
			kind: (k) => ({ single: 'Prime factors', hcf: 'HCF', lcm: 'LCM' })[k],
			lockedKind: (kind, before) => `${kind}, unlocks after 3 perfect rounds of ${before}`,
			clean: (n, of) => `${Math.min(n, of)} of ${of} perfect rounds`,
			task: (kind, row) =>
				({
					single: `Break **${row}** into prime factors.`,
					hcf: `Find the **HCF** of **${row}**.`,
					lcm: `Find the **LCM** of **${row}**.`
				})[kind],
			primesGroup: 'Primes to divide by',
			soundOn: 'Sound on',
			soundOff: 'Sound off',
			skip: 'Skip this round',
			next: 'Next round',
			headline: (stars) =>
				stars === 3 ? 'Perfect round!' : stars === 2 ? 'So close: one slip.' : 'Keep breaking!',
			stars: (stars) => `${stars} of 3 stars`,
			streak: (n) => `${n} perfect ${n === 1 ? 'round' : 'rounds'} in a row`,
			mistakes: (n) => (n === 1 ? '1 slip' : `${n} slips`),
			unlocked: (kind) => `Well done! ${kind} unlocked.`
		},
		multiplesHunt: {
			desc: 'Multiples Hunt: tap every multiple of a number, then every common multiple of two or three numbers.',
			intro:
				'Sixteen numbers, some of them the multiples you want. Tap **every one** you can spot: each tap is judged straight away. A multiple of a number is in its times table: you reach it by counting in steps of that number.',
			loading: 'Dealing a board…',
			kindGroup: 'What to hunt',
			kind: (k) =>
				({ one: 'Multiples', two: 'Common multiples of two', three: 'Common multiples of three' })[
					k
				],
			lockedKind: (kind, before) => `${kind}, unlocks after 3 perfect boards of ${before}`,
			clean: (n, of) => `${Math.min(n, of)} of ${of} perfect boards`,
			task: (kind, list) =>
				kind === 'one'
					? `Tap every **multiple** of **${list}**.`
					: `Tap every **common multiple** of **${list}**.`,
			hintOne: (n) => `Count in steps of ${n}: ${n}, ${2 * n}, ${3 * n}, …`,
			hintCommon: 'A common multiple is a multiple of **every** one of the numbers.',
			left: (n) => (n === 1 ? '1 multiple left' : `${n} multiples left`),
			soundOn: 'Sound on',
			soundOff: 'Sound off',
			next: 'Next board',
			boardAria: 'Numbers on the board',
			cell: (n, state) =>
				({
					open: `${n}`,
					found: `${n}: multiple, found`,
					wrong: `${n}: not a multiple`
				})[state],
			headline: (stars) =>
				stars === 3 ? 'Perfect board!' : stars === 2 ? 'So close: one slip.' : 'Keep hunting!',
			stars: (stars) => `${stars} of 3 stars`,
			streak: (n) => `${n} perfect ${n === 1 ? 'board' : 'boards'} in a row`,
			reviewHeading: 'Look again at these',
			wrong: 'Not a multiple',
			explainMiss: (n, s, rest) => `${n} is not a multiple of ${s}: ${n} ÷ ${s} leaves ${rest}.`,
			explainTrap: (n, of, s, rest) =>
				`${n} is a multiple of ${of}, but not of ${s}: ${n} ÷ ${s} leaves ${rest}.`,
			lcmNote: (lcm, list) =>
				`Every common multiple of ${list} is a multiple of their LCM, **${lcm}**.`,
			unlocked: (kind) => `Well done! ${kind} unlocked.`
		},
		meetAgain: {
			desc: 'Meet Again: lights blink at different rhythms, and you tap when they all light up together. Find the LCM by feel.',
			intro:
				'Each light blinks **every so many beats**. Sometimes they are all lit at once. Tap **Together!** on those beats, and only those. The first time they meet is their LCM.',
			loading: 'Setting the lights…',
			kindGroup: 'How many lights',
			kind: (k) =>
				({ two: 'Two lights', wide: 'Two lights, longer waits', three: 'Three lights' })[k],
			lockedKind: (kind, before) => `${kind}, unlocks after 3 perfect rounds of ${before}`,
			clean: (n, of) => `${Math.min(n, of)} of ${of} perfect rounds`,
			tempoGroup: 'Speed',
			tempo: (t) => ({ step: 'Step by step', slow: 'Slow', normal: 'Normal' })[t],
			tempoHeld: 'Change the speed between rounds.',
			task: 'Tap Together! on the beats when every light is lit.',
			lightsAria: 'The blinking lights',
			light: (p) => `every ${p}`,
			on: 'ON',
			off: 'off',
			beat: (n) => (n === 0 ? 'Ready' : `Beat ${n}`),
			ready: 'Press Start: the first beat lights at once.',
			start: 'Start',
			together: 'Together!',
			pause: 'Pause',
			resume: 'Resume',
			paused: 'Paused. Press Resume to carry on.',
			nextBeat: 'Next beat',
			caught: (n, of) => `Meetings caught: ${n} of ${of}`,
			early: (beat, p, rest) =>
				`Not yet: on beat ${beat} the every-${p} light is off (${beat} ÷ ${p} leaves ${rest}).`,
			missed: (beat, list) =>
				`Beat ${beat}: every light was lit, because ${beat} is a multiple of ${list}. Tap Together! on beats like this.`,
			headline: (stars) =>
				stars === 3 ? 'Perfect round!' : stars === 2 ? 'So close: one slip.' : 'Keep watching!',
			stars: (stars) => `${stars} of 3 stars`,
			streak: (n) => `${n} perfect ${n === 1 ? 'round' : 'rounds'} in a row`,
			reviewHeading: 'Look again at these',
			wrong: 'Slip',
			meetNote: (beats, lcm) =>
				`They met on beats ${beats}: the multiples of their LCM, **${lcm}**.`,
			soundOn: 'Sound on',
			soundOff: 'Sound off',
			next: 'Next round',
			unlocked: (kind) => `Well done! ${kind} unlocked.`
		}
	}
};

const ms: Copy = {
	nav: {
		next21: '2.1 Faktor dan FSTB →',
		prev22: '← 2.1 Faktor dan FSTB',
		next22: '2.2 Gandaan dan GSTK →',
		prev23: '← 2.2 Gandaan dan GSTK',
		next23: '2.3 FSTB lawan GSTK →'
	},
	meta: {
		desc21:
			'Bahagian 2.1: faktor, faktor perdana dan faktor sepunya terbesar — diterokai dengan jubin dan pembahagian berulang langkah demi langkah.',
		desc22:
			'Bahagian 2.2: gandaan, gandaan sepunya dan gandaan sepunya terkecil — diterokai dengan carta nombor dan pembahagian berulang.',
		desc23:
			'Bahagian 2.3: FSTB dan GSTK dibandingkan — apa yang ditanya, bagaimana pembahagian berulang berbeza, dan bila menggunakan yang mana satu.'
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
		primeWhy:
			'Menyenaraikan setiap pasangan faktor sesuai untuk nombor kecil. Bagi nombor seperti 126, senarainya panjang dan mudah terlepas satu pasangan. Nombor perdana ialah blok binaan bagi setiap nombor, jadi jika kita memecahkan nombor sehingga menjadi nombor perdana, tiada yang terlepas. **Pembahagian berulang** ialah cara pantas untuk melakukannya.',
		primeIntro:
			'Faktor yang merupakan nombor perdana ialah **faktor perdana**. Faktor bagi 18 ialah 1, **2**, **3**, 6, 9, 18 — jadi 18 = 2 × 3 × 3. Ini dipanggil **pemfaktoran perdana**.',
		primeMethod:
			'Cari dengan **pembahagian berulang**: terus bahagi dengan nombor perdana sehingga mencapai **1**. Nombor perdana di sebelah kiri ialah faktor perdana.',
		hcfHeading: 'Faktor sepunya terbesar (FSTB)',
		hcfIntro:
			'Nombor yang membahagikan kesemuanya ialah **faktor sepunya**. Yang terbesar ialah **faktor sepunya terbesar (FSTB)**. Cari dengan pembahagian berulang — nombor perdana mesti membahagi **setiap** nombor. Darabkan lajur kiri.',
		hcfLanesIntro:
			'Cara lain untuk melihat FSTB: tulis setiap nombor sebagai hasil darab dengan semua cara yang mungkin. Faktor yang muncul pada setiap nombor ialah faktor sepunya, dan yang terbesar ialah FSTB.',
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
			'Guna pembahagian berulang semula, dengan satu perubahan: nombor perdana perlu membahagi **sekurang-kurangnya satu** nombor. Yang lain diturunkan tanpa berubah. Berhenti apabila semuanya 1, kemudian darabkan lajur kiri.',
		lcmLanesIntro:
			'Lihat dahulu: setiap nombor melompat di lorongnya sendiri dengan lompatan yang sama. Tempat pertama semua lorong mendarat serentak ialah GSTK.',
		isCommonQ: (n, list) => `Adakah **${n}** gandaan sepunya bagi **${list}**?`,
		commonYes: (n) => `Mengira dalam setiap satu akan sampai ke ${n}.`,
		commonNo: (miss, n) => `Mengira dalam ${miss} melangkaui ${n}.`,
		and: (nums) => nums.join(', ').replace(/, (\d+)$/, ' dan $1')
	},

	s23: {
		introHeading: 'Nombor yang sama, dua soalan berbeza',
		intro:
			'Ambil 12 dan 18. **FSTB** bertanya: apakah nombor terbesar yang **membahagi** kedua-duanya? **GSTK** bertanya: apakah nombor terkecil yang **boleh dibahagi oleh** kedua-duanya? Satu melihat ke bawah, satu lagi melihat ke atas.',
		tableHeading: 'FSTB dan GSTK sepintas lalu',
		aspectHead: '',
		rows: [
			{
				aspect: 'Soalannya',
				hcf: 'Nombor terbesar yang membahagi **semua** nombor itu',
				lcm: 'Nombor terkecil yang boleh dibahagi oleh **semua** nombor itu'
			},
			{
				aspect: 'Nombor perdana mesti membahagi',
				hcf: '**setiap** nombor',
				lcm: '**sekurang-kurangnya satu** nombor'
			},
			{
				aspect: 'Nombor yang tidak dapat dibahagi',
				hcf: 'Nombor perdana itu ditolak',
				lcm: 'Nombor itu diturunkan tanpa berubah'
			},
			{
				aspect: 'Anda berhenti apabila',
				hcf: 'Tiada nombor perdana yang membahagi setiap nombor',
				lcm: 'Setiap nombor ialah 1'
			},
			{
				aspect: 'Saiz jawapan',
				hcf: 'Paling besar sama dengan nombor terkecil',
				lcm: 'Paling kecil sama dengan nombor terbesar'
			},
			{
				aspect: 'Petunjuk dalam masalah',
				hcf: 'bahagi sama banyak, kumpulan, saiz terbesar',
				lcm: 'pada masa yang sama, bertemu semula, berulang setiap, jumlah terkecil'
			}
		],
		lanesHeading: 'Nombor yang sama pada lorong',
		lanesIntro:
			'FSTB: tulis setiap nombor sebagai pasangan faktor dan cari faktor yang dikongsi oleh semua nombor, yang terbesar ialah FSTB. GSTK: melompat di setiap lorong sehingga semuanya mendarat serentak, titik pertemuan pertama.',
		ladderHeading: 'Dua pembahagian berulang bersebelahan',
		ladderIntro:
			'Kedua-duanya bermula dengan nombor yang sama. Tekan **Langkah** dan lihat cara kedua-duanya berbeza: kaedah FSTB hanya boleh menggunakan nombor perdana yang membahagi setiap nombor, manakala kaedah GSTK menerima mana-mana nombor perdana yang membahagi satu nombor — dan menurunkan yang lain.',
		cluesHeading: 'Yang mana satu perlu saya guna?',
		cluesIntro: 'Cari petunjuk dalam masalah: adakah anda membahagi, atau menunggu?',
		hcfClue: {
			title: 'Membahagi → FSTB',
			problem:
				'Seorang penjual bunga mempunyai 24 kuntum ros dan 36 kuntum tulip. Dia membuat jambangan yang serupa dengan menggunakan semua bunga. Apakah bilangan jambangan yang paling banyak?',
			answer: 'FSTB bagi 24 dan 36 = **12** jambangan.',
			why: 'Bahagikan bunga kepada kumpulan yang sama: 12 ialah bilangan kumpulan terbesar yang membahagi 24 dan 36.'
		},
		lcmClue: {
			title: 'Menunggu → GSTK',
			problem:
				'Sebuah bas bertolak setiap 12 minit dan sebuah lagi setiap 18 minit. Kedua-duanya bertolak bersama sekarang. Bilakah kedua-duanya bertolak bersama lagi?',
			answer: 'GSTK bagi 12 dan 18 = **36** minit.',
			why: 'Tunggu bas bertemu: 36 ialah kali pertama 12 dan 18 tiba serentak.'
		},
		quiz: {
			question: 'Adakah ini masalah FSTB atau masalah GSTK?',
			problems: {
				tiles:
					'Sebuah lantai 48 cm kali 72 cm ditutup dengan jubin segi empat sama yang serupa, tanpa dipotong. Apakah sisi jubin yang terbesar?',
				lights:
					'Dua lampu berkelip bersama sekarang. Satu berkelip setiap 15 saat dan satu lagi setiap 20 saat. Selepas berapa saat kedua-duanya berkelip bersama lagi?',
				groups:
					'Seorang guru membahagikan 36 murid lelaki dan 45 murid perempuan kepada kumpulan yang serupa, dengan semua murid digunakan. Apakah bilangan kumpulan yang paling banyak?',
				packs:
					'Pen dijual dalam bungkusan 6 dan pensel dalam bungkusan 8. Apakah bilangan pen yang paling sedikit untuk sepadan dengan bilangan pensel yang sama?',
				ribbons:
					'Reben 40 cm, 56 cm dan 72 cm dipotong kepada bahagian yang sama panjang tanpa baki. Apakah panjang bahagian yang paling panjang?',
				buses:
					'Tiga buah bas bertolak dari terminal bersama-sama. Kemudian, bas-bas itu bertolak setiap 10, 12 dan 15 minit. Selepas berapa minit ketiga-tiganya bertolak bersama lagi?'
			},
			feedback: (kind, list, result) =>
				kind === 'hcf'
					? `Membahagi sama banyak memerlukan nombor yang membahagi kesemuanya: FSTB bagi ${list} = ${result}.`
					: `Menunggu sehingga serentak memerlukan nombor yang boleh dibahagi oleh kesemuanya: GSTK bagi ${list} = ${result}.`,
			tryLadder:
				'Semak dengan pembahagian berulang: tekan Langkah dan lihat yang mana satu memberi jawapan.'
		}
	},
	compare: {
		hcfRule: 'Nombor perdana mesti membahagi **setiap** nombor.',
		lcmRule: 'Nombor perdana mesti membahagi **sekurang-kurangnya satu** nombor.',
		step: 'Langkah',
		stepsTaken: (n) => `Langkah ${n}`,
		stopHcf: 'Berhenti: tiada nombor perdana yang membahagi semuanya.',
		broughtDown: 'Diturunkan tanpa berubah',
		summary: (hcf, lcm) =>
			`**FSTB = ${hcf}**: kecil, ia membahagi setiap nombor. **GSTK = ${lcm}**: besar, setiap nombor membahagi ia.`,
		aria: (row) => `Pembahagian berulang FSTB dan GSTK untuk ${row}`
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
		found: (total, found, all) => `Pasangan faktor bagi ${total} ditemui: ${found} daripada ${all}`,
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
	lanes: {
		label: (d) => `+${d}`,
		hcfTitle: 'FSTB: senaraikan pasangan faktor',
		lcmTitle: 'GSTK: tunggu sehingga serentak',
		lcmCaption: (list, lcm) =>
			`Melompat dengan ${list}, semua lorong mula-mula mendarat serentak pada **${lcm}**: **GSTK = ${lcm}**.`,
		factorsOf: (n) => `Faktor bagi ${n}`,
		commonLegend: 'Diserlahkan = faktor bagi setiap nombor (faktor sepunya)',
		commonCaption: (list, hcf) =>
			`Hanya sebahagian faktor bagi ${list} muncul pada setiap nombor. Itulah **faktor sepunya**. Yang terbesar ialah **FSTB = ${hcf}**.`,
		replay: 'Main semula',
		addLane: 'Tambah lorong',
		removeLane: (n) => `Buang lorong ${n}`,
		laneLabel: (n) => `Lorong ${n}`,
		addSecond: 'Taip nombor pada lorong, kemudian tambah lorong kedua untuk membandingkan.',
		ownInvalid: 'Guna nombor bulat dari 2 hingga 999, setiap satu berbeza.',
		tooLong: (lcm) =>
			`GSTK ialah ${lcm}, terlalu panjang untuk dilukis. Cuba nombor yang lebih kecil.`
	},
	ladder: {
		number: 'Nombor',
		own: 'Nombor sendiri',
		ownPlaceholder: 'cth. 48, 90',
		ownGo: 'Mula',
		ownEmpty: 'Taip nombor anda sendiri di atas, kemudian tekan Mula.',
		ownInvalid: (single) =>
			single
				? 'Masukkan satu nombor bulat antara 2 dengan 999.'
				: 'Masukkan 2 hingga 4 nombor bulat antara 2 dengan 999, dipisahkan dengan koma.',
		aria: (row) => `Pembahagian berulang untuk ${row}`,
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
	},
	games: {
		hubDesc: 'Permainan pendek untuk Faktor dan Gandaan: berlatih sehingga fakta itu melekat.',
		hub: {
			notPlayed: 'Belum dimainkan',
			primesKnown: (n, total) => `${n} daripada ${total} nombor perdana diketahui`,
			levelsMastered: (n, total) => `${n} daripada ${total} tahap dikuasai`
		},
		practise: { heading: 'Berlatih ini dalam permainan', play: 'Main' },
		primeHunt: {
			desc: 'Buru Nombor Perdana: ketik setiap nombor perdana pada papan, dan hafal nombor perdana sehingga 100.',
			intro:
				'Enam belas nombor, sebahagiannya perdana. Ketik **setiap nombor perdana** yang anda nampak: setiap ketikan dinilai serta-merta. Nombor perdana mempunyai tepat dua faktor: 1 dan dirinya sendiri.',
			loading: 'Mengedar papan…',
			tierGroup: 'Nombor perdana untuk dipelajari',
			tier: (max) => `2–${max}`,
			lockedTier: (max, before) =>
				`2–${max}, dibuka apabila anda tahu semua nombor perdana sehingga ${before}`,
			known: (known, total) => `${known} daripada ${total} nombor perdana diketahui`,
			studyOpen: 'Pelajari nombor perdana',
			studyClose: 'Sembunyikan nombor perdana',
			studyHeading: (max) => `Nombor perdana sehingga ${max}`,
			studyNote: 'Setiap satu mempunyai dua faktor sahaja: 1 dan dirinya sendiri.',
			studyLocked: 'Pembelajaran ditutup semasa papan dimainkan. Habiskan papan dahulu.',
			instruction: 'Ketik nombor yang anda fikir perdana.',
			left: (n) => `${n} nombor perdana lagi`,
			soundOn: 'Bunyi hidup',
			soundOff: 'Bunyi mati',
			next: 'Papan seterusnya',
			boardAria: 'Nombor pada papan',
			cell: (n, state) =>
				({
					open: `${n}`,
					found: `${n}: perdana, dijumpai`,
					wrong: `${n}: bukan perdana`
				})[state],
			headline: (stars) =>
				stars === 3
					? 'Papan sempurna!'
					: stars === 2
						? 'Hampir: satu kesilapan.'
						: 'Teruskan memburu!',
			stars: (stars) => `${stars} daripada 3 bintang`,
			streak: (n) => `${n} papan sempurna berturut-turut`,
			reviewHeading: 'Lihat semula yang ini',
			explainOne: '1 hanya mempunyai satu faktor, jadi ia bukan nombor perdana.',
			explainPrime: (n) => `${n} ialah nombor perdana: faktornya hanya 1 dan ${n}.`,
			explainPair: (n, a, b) => `${n} bukan nombor perdana: ${n} = ${a} × ${b}.`,
			wrong: 'Bukan perdana',
			unlocked: (max) => `Hebat! Nombor perdana 2–${max} dibuka.`
		},
		primeBreaker: {
			desc: 'Pemecah Perdana: pecahkan nombor dengan membahagi menggunakan nombor perdana, satu anak tangga demi satu anak tangga, untuk faktor perdana, FSTB dan GSTK.',
			intro:
				'Pecahkan nombor itu dengan **pembahagian berulang**. Ketik nombor perdana untuk membahagi dengannya: nombor perdana yang sesuai menurunkan satu baris baharu, dan yang tidak sesuai ditolak serta-merta, dengan sebabnya. Siapkan tangga dengan sesedikit mungkin kesilapan.',
			loading: 'Mengedar pusingan…',
			kindGroup: 'Apa yang hendak dipecahkan',
			kind: (k) => ({ single: 'Faktor perdana', hcf: 'FSTB', lcm: 'GSTK' })[k],
			lockedKind: (kind, before) => `${kind}, dibuka selepas 3 pusingan sempurna ${before}`,
			clean: (n, of) => `${Math.min(n, of)} daripada ${of} pusingan sempurna`,
			task: (kind, row) =>
				({
					single: `Pecahkan **${row}** kepada faktor perdana.`,
					hcf: `Cari **FSTB** bagi **${row}**.`,
					lcm: `Cari **GSTK** bagi **${row}**.`
				})[kind],
			primesGroup: 'Nombor perdana untuk membahagi',
			soundOn: 'Bunyi hidup',
			soundOff: 'Bunyi mati',
			skip: 'Langkau pusingan ini',
			next: 'Pusingan seterusnya',
			headline: (stars) =>
				stars === 3
					? 'Pusingan sempurna!'
					: stars === 2
						? 'Hampir: satu kesilapan.'
						: 'Teruskan memecah!',
			stars: (stars) => `${stars} daripada 3 bintang`,
			streak: (n) => `${n} pusingan sempurna berturut-turut`,
			mistakes: (n) => `${n} kesilapan`,
			unlocked: (kind) => `Hebat! ${kind} dibuka.`
		},
		multiplesHunt: {
			desc: 'Buru Gandaan: ketik setiap gandaan bagi satu nombor, kemudian setiap gandaan sepunya bagi dua atau tiga nombor.',
			intro:
				'Enam belas nombor, sebahagiannya gandaan yang anda cari. Ketik **setiap satu** yang anda nampak: setiap ketikan dinilai serta-merta. Gandaan sesuatu nombor berada dalam sifir nombor itu: anda mencapainya dengan mengira langkah demi langkah sebanyak nombor itu.',
			loading: 'Mengedar papan…',
			kindGroup: 'Apa yang hendak diburu',
			kind: (k) =>
				({ one: 'Gandaan', two: 'Gandaan sepunya bagi dua', three: 'Gandaan sepunya bagi tiga' })[
					k
				],
			lockedKind: (kind, before) => `${kind}, dibuka selepas 3 papan sempurna ${before}`,
			clean: (n, of) => `${Math.min(n, of)} daripada ${of} papan sempurna`,
			task: (kind, list) =>
				kind === 'one'
					? `Ketik setiap **gandaan** bagi **${list}**.`
					: `Ketik setiap **gandaan sepunya** bagi **${list}**.`,
			hintOne: (n) => `Kira langkah ${n}: ${n}, ${2 * n}, ${3 * n}, …`,
			hintCommon: 'Gandaan sepunya ialah gandaan bagi **setiap** satu nombor itu.',
			left: (n) => `${n} gandaan lagi`,
			soundOn: 'Bunyi hidup',
			soundOff: 'Bunyi mati',
			next: 'Papan seterusnya',
			boardAria: 'Nombor pada papan',
			cell: (n, state) =>
				({
					open: `${n}`,
					found: `${n}: gandaan, dijumpai`,
					wrong: `${n}: bukan gandaan`
				})[state],
			headline: (stars) =>
				stars === 3
					? 'Papan sempurna!'
					: stars === 2
						? 'Hampir: satu kesilapan.'
						: 'Teruskan memburu!',
			stars: (stars) => `${stars} daripada 3 bintang`,
			streak: (n) => `${n} papan sempurna berturut-turut`,
			reviewHeading: 'Lihat semula yang ini',
			wrong: 'Bukan gandaan',
			explainMiss: (n, s, rest) => `${n} bukan gandaan ${s}: ${n} ÷ ${s} berbaki ${rest}.`,
			explainTrap: (n, of, s, rest) =>
				`${n} ialah gandaan ${of}, tetapi bukan gandaan ${s}: ${n} ÷ ${s} berbaki ${rest}.`,
			lcmNote: (lcm, list) =>
				`Setiap gandaan sepunya bagi ${list} ialah gandaan bagi GSTK mereka, **${lcm}**.`,
			unlocked: (kind) => `Hebat! ${kind} dibuka.`
		},
		meetAgain: {
			desc: 'Bertemu Lagi: lampu berkelip dengan rentak berbeza, dan anda mengetik apabila semuanya menyala serentak. Cari GSTK dengan rasa.',
			intro:
				'Setiap lampu berkelip **setiap beberapa rentak**. Kadangkala semuanya menyala serentak. Ketik **Serentak!** pada rentak itu sahaja. Kali pertama mereka bertemu ialah GSTK mereka.',
			loading: 'Menyediakan lampu…',
			kindGroup: 'Bilangan lampu',
			kind: (k) =>
				({ two: 'Dua lampu', wide: 'Dua lampu, tunggu lebih lama', three: 'Tiga lampu' })[k],
			lockedKind: (kind, before) => `${kind}, dibuka selepas 3 pusingan sempurna ${before}`,
			clean: (n, of) => `${Math.min(n, of)} daripada ${of} pusingan sempurna`,
			tempoGroup: 'Kelajuan',
			tempo: (t) => ({ step: 'Langkah demi langkah', slow: 'Perlahan', normal: 'Biasa' })[t],
			tempoHeld: 'Tukar kelajuan antara pusingan.',
			task: 'Ketik Serentak! pada rentak apabila setiap lampu menyala.',
			lightsAria: 'Lampu yang berkelip',
			light: (p) => `setiap ${p}`,
			on: 'HIDUP',
			off: 'mati',
			beat: (n) => (n === 0 ? 'Sedia' : `Rentak ${n}`),
			ready: 'Tekan Mula: rentak pertama menyala serta-merta.',
			start: 'Mula',
			together: 'Serentak!',
			pause: 'Jeda',
			resume: 'Sambung',
			paused: 'Dijeda. Tekan Sambung untuk meneruskan.',
			nextBeat: 'Rentak seterusnya',
			caught: (n, of) => `Pertemuan ditangkap: ${n} daripada ${of}`,
			early: (beat, p, rest) =>
				`Belum lagi: pada rentak ${beat} lampu setiap-${p} mati (${beat} ÷ ${p} berbaki ${rest}).`,
			missed: (beat, list) =>
				`Rentak ${beat}: setiap lampu menyala, kerana ${beat} ialah gandaan ${list}. Ketik Serentak! pada rentak seperti ini.`,
			headline: (stars) =>
				stars === 3
					? 'Pusingan sempurna!'
					: stars === 2
						? 'Hampir: satu kesilapan.'
						: 'Teruskan memerhati!',
			stars: (stars) => `${stars} daripada 3 bintang`,
			streak: (n) => `${n} pusingan sempurna berturut-turut`,
			reviewHeading: 'Lihat semula yang ini',
			wrong: 'Silap',
			meetNote: (beats, lcm) =>
				`Mereka bertemu pada rentak ${beats}: gandaan GSTK mereka, **${lcm}**.`,
			soundOn: 'Bunyi hidup',
			soundOff: 'Bunyi mati',
			next: 'Pusingan seterusnya',
			unlocked: (kind) => `Hebat! ${kind} dibuka.`
		}
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
