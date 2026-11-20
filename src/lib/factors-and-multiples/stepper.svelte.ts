// The play timer behind "Watch" and "Play": every `STEP_MS` it calls the host's
// `tick`, until `tick` reports there is nothing left to do. <DivisionLadder> and
// <CompareLadders> each kept their own copy of this interval, and each had to
// remember to switch `playing` off at the right moment; here the stepper stops
// itself when `tick` returns false, so the host only decides what one step is.
//
// The stepper holds no lifecycle of its own (so it can be tested without a
// component): the host calls `stop()` when it is destroyed, e.g.
// `onDestroy(stepper.stop)`.

/** How long one step of a Watch/Play takes. */
export const STEP_MS = 1200;

export interface Stepper {
	/** Whether the timer is running. */
	readonly playing: boolean;
	/** Starts the timer; the first step happens after one interval. */
	play(): void;
	/** Stops the timer. Safe to call when it is not running. */
	stop(): void;
}

/** `tick` does one step and returns whether there are more to take. */
export function startStepper(tick: () => boolean, intervalMs: number = STEP_MS): Stepper {
	let playing = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;

	function stop() {
		clearInterval(timer);
		timer = undefined;
		playing = false;
	}

	function play() {
		clearInterval(timer);
		playing = true;
		timer = setInterval(() => {
			if (!tick()) stop();
		}, intervalMs);
	}

	return {
		get playing() {
			return playing;
		},
		play,
		stop
	};
}
