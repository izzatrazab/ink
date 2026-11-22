import { describe, expect, it } from 'vitest';
import { shareText } from './shareText';

describe('shareText', () => {
	it('shows the title, stars, detail and page', () => {
		expect(
			shareText({
				title: 'Prime Breaker',
				stars: 3,
				detail: '180 = 2 × 2 × 3 × 3 × 5',
				url: 'https://x.test/p'
			})
		).toBe('Prime Breaker ★★★\n180 = 2 × 2 × 3 × 3 × 5\nhttps://x.test/p');
	});
	it('pads the stars and shows slips only when there are some', () => {
		expect(shareText({ title: 'Prime Hunt', stars: 2, slips: 1 })).toBe('Prime Hunt ★★☆ ✗1');
		expect(shareText({ title: 'Prime Hunt', stars: 1, slips: 0 })).toBe('Prime Hunt ★☆☆');
	});
});
