import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startStepper, STEP_MS } from './stepper.svelte';

// Time is faked; the timer logic needs no component around it.

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('startStepper', () => {
	it('does not tick until played, and not before one interval has passed', () => {
		const tick = vi.fn(() => true);
		const stepper = startStepper(tick);
		vi.advanceTimersByTime(STEP_MS * 3);
		expect(tick).not.toHaveBeenCalled();

		stepper.play();
		vi.advanceTimersByTime(STEP_MS - 1);
		expect(tick).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(tick).toHaveBeenCalledTimes(1);
		expect(stepper.playing).toBe(true);
	});

	it('ticks once per interval while there is more to do', () => {
		const tick = vi.fn(() => true);
		const stepper = startStepper(tick);
		stepper.play();
		vi.advanceTimersByTime(STEP_MS * 3);
		expect(tick).toHaveBeenCalledTimes(3);
	});

	it('stops itself when tick reports it is done', () => {
		let left = 2;
		const tick = vi.fn(() => --left > 0);
		const stepper = startStepper(tick);
		stepper.play();
		vi.advanceTimersByTime(STEP_MS * 5);
		expect(tick).toHaveBeenCalledTimes(2);
		expect(stepper.playing).toBe(false);
	});

	it('stop() halts the timer', () => {
		const tick = vi.fn(() => true);
		const stepper = startStepper(tick);
		stepper.play();
		vi.advanceTimersByTime(STEP_MS);
		stepper.stop();
		vi.advanceTimersByTime(STEP_MS * 3);
		expect(tick).toHaveBeenCalledTimes(1);
		expect(stepper.playing).toBe(false);
	});

	it('playing twice does not double the pace', () => {
		const tick = vi.fn(() => true);
		const stepper = startStepper(tick);
		stepper.play();
		stepper.play();
		vi.advanceTimersByTime(STEP_MS * 2);
		expect(tick).toHaveBeenCalledTimes(2);
	});

	it('can be played again after finishing', () => {
		let left = 1;
		const tick = vi.fn(() => --left > 0);
		const stepper = startStepper(tick);
		stepper.play();
		vi.advanceTimersByTime(STEP_MS);
		expect(stepper.playing).toBe(false);
		left = 1;
		stepper.play();
		vi.advanceTimersByTime(STEP_MS);
		expect(tick).toHaveBeenCalledTimes(2);
	});
});
