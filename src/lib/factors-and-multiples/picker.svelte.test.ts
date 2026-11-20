import { describe, it, expect, vi } from 'vitest';
import { startPicker } from './picker.svelte';

// Tested through the reactive interface only, the way a ladder drives it.

const presets = [[60], [72]];
const make = (over: { custom?: boolean; count?: 'one' | 'several' } = {}, onChange = () => {}) =>
	startPicker(
		() => ({ presets, custom: over.custom ?? true, count: over.count ?? 'one' }),
		onChange
	);

describe('startPicker', () => {
	it('starts on the first preset and is ready', () => {
		const s = make();
		expect(s.start).toEqual([60]);
		expect(s.ready).toBe(true);
		expect(s.isCustom).toBe(false);
	});

	it('picking a preset changes the start and notifies once', () => {
		const onChange = vi.fn();
		const s = make({}, onChange);
		s.pick(1);
		expect(s.start).toEqual([72]);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('"Your own" is not ready until valid numbers are applied', () => {
		const s = make();
		s.pick(presets.length);
		expect(s.isCustom).toBe(true);
		expect(s.ready).toBe(false);
		expect(s.start).toEqual([1]);
	});

	it('applies valid typed numbers, notifies, and clears the error', () => {
		const onChange = vi.fn();
		const s = make({ custom: true, count: 'several' }, onChange);
		s.pick(presets.length);
		onChange.mockClear();
		s.text = '48, 90';
		s.apply();
		expect(s.start).toEqual([48, 90]);
		expect(s.ready).toBe(true);
		expect(s.error).toBe(false);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('rejects invalid text: sets the error, keeps the old numbers, does not notify', () => {
		const onChange = vi.fn();
		const s = make({}, onChange);
		s.pick(presets.length);
		onChange.mockClear();
		s.text = 'abc';
		s.apply();
		expect(s.error).toBe(true);
		expect(s.ready).toBe(false);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('count decides how many numbers are allowed', () => {
		const one = make({ count: 'one' });
		one.pick(presets.length);
		one.text = '12 18';
		one.apply();
		expect(one.error).toBe(true);

		const several = make({ count: 'several' });
		several.pick(presets.length);
		several.text = '12';
		several.apply();
		expect(several.error).toBe(true);
	});

	it('without custom, the index never reaches "Your own"', () => {
		const s = make({ custom: false });
		s.pick(presets.length);
		expect(s.isCustom).toBe(false);
	});
});
