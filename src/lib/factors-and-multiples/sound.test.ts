import { describe, expect, it } from 'vitest';
import { silent, successFrequency, webAudioSounds } from './sound';

describe('successFrequency', () => {
	it('climbs a pentatonic scale, so each prime found sounds a step higher', () => {
		const notes = [0, 1, 2, 3, 4, 5].map(successFrequency);
		expect(notes).toEqual([...notes].sort((a, b) => a - b));
		expect(new Set(notes).size).toBe(notes.length);
	});
	it('starts at C5 and reaches the octave on the sixth note', () => {
		expect(successFrequency(0)).toBeCloseTo(523.25, 1);
		expect(successFrequency(5)).toBeCloseTo(1046.5, 1);
	});
	it('stops climbing rather than turning shrill', () => {
		expect(successFrequency(40)).toBe(successFrequency(10));
	});
});

describe('sounds without audio', () => {
	// Node has no AudioContext: playing must be a quiet no-op, never a throw.
	it('web audio sounds do nothing when the browser has no audio', () => {
		const s = webAudioSounds();
		expect(() => {
			s.success(0);
			s.wrong();
			s.done();
		}).not.toThrow();
	});
	it('silent does nothing', () => {
		expect(() => {
			silent.success(0);
			silent.wrong();
			silent.done();
		}).not.toThrow();
	});
});
