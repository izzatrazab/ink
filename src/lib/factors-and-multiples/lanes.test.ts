import { describe, expect, it } from 'vitest';
import { hcfDrawable, laneY, lcmDrawable, rowIssue, rowValues } from './lanes';

describe('rowValues', () => {
	it('reads whole numbers from 2 to 999, lane by lane', () => {
		expect(rowValues(['12', ' 18 '])).toEqual([12, 18]);
	});
	it('gives null for empty, unusable and repeated lanes without shifting the others', () => {
		expect(rowValues(['12', '', 'x', '1', '1000', '12', '9'])).toEqual([
			12,
			null,
			null,
			null,
			null,
			null,
			9
		]);
	});
	it('tells an empty lane from a wrong one', () => {
		const inputs = ['', '1'];
		const values = rowValues(inputs);
		expect(rowIssue(inputs, values, 0)).toBe('blank');
		expect(rowIssue(inputs, values, 1)).toBe('invalid');
		expect(rowIssue(['6'], rowValues(['6']), 0)).toBeNull();
	});
});

describe('laneY', () => {
	it('spaces lanes evenly and never past the stage', () => {
		expect(laneY(0, 1)).toBe(24);
		expect(laneY(3, 4)).toBeLessThan(120);
	});
});

describe('drawable limits', () => {
	it('stops an LCM that would crowd the stage', () => {
		expect(lcmDrawable([10, 12, 15])).toBe(true);
		expect(lcmDrawable([89, 97])).toBe(false);
	});
	it('stops an HCF that would cut into slivers', () => {
		expect(hcfDrawable([24, 36])).toBe(true);
		expect(hcfDrawable([89, 97])).toBe(false);
	});
});
