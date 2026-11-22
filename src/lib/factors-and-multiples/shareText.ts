// The text a student copies to share a result: the game, its stars, the slips, one
// line of detail and the page to play it on. Language-neutral on purpose (stars and
// numbers), so it reads the same in a class chat whichever language the game was in.
// Pure and framework-free.

export interface ShareInput {
	title: string;
	stars: number;
	/** Wrong taps or slips; omitted from the text when 0. */
	slips?: number;
	/** One line about the round, e.g. "180 = 2 × 2 × 3 × 3 × 5". */
	detail?: string;
	url?: string;
}

export function shareText({ title, stars, slips = 0, detail, url }: ShareInput): string {
	const mark = '★'.repeat(stars) + '☆'.repeat(Math.max(0, 3 - stars));
	return [`${title} ${mark}${slips > 0 ? ` ✗${slips}` : ''}`, detail, url]
		.filter((line): line is string => Boolean(line))
		.join('\n');
}
