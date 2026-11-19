// The words the Latihan shell shows itself — counter, verdict, advance, finished
// line. A chapter supplies its own (Chapter 2 through its Chapter copy); the shell
// falls back to Malay, the wording Transformasi Isometri's Sections have always used.

export interface LatihanWording {
	questionOf: (index: number, total: number) => string;
	correct: string;
	incorrect: string;
	nextQuestion: string;
	allDone: string;
}

export const malayWording: LatihanWording = {
	questionOf: (index, total) => `Pasangan ${index + 1} daripada ${total}`,
	correct: 'Betul!',
	incorrect: 'Belum tepat.',
	nextQuestion: 'Pasangan seterusnya',
	allDone: 'Tahniah — anda telah menyelesaikan semua pasangan.'
};
