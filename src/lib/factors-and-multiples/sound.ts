// The sounds of Prime Hunt, made on the spot with the Web Audio API so there are
// no audio files to ship. A found prime plays a chime that climbs a step with each
// prime found on the Board; a wrong tap plays a short low buzz; a finished Board
// plays a little run up the scale. Playing must never break the game: a browser
// without audio, or one that refuses to start it, simply stays quiet.

/** What the game asks to hear. The store decides when (and whether, if muted). */
export interface Sounds {
	/** A prime was found; `index` counts the primes found on this Board so far, from 0. */
	success(index: number): void;
	/** A non-prime was tapped. */
	wrong(): void;
	/** The Board is complete. */
	done(): void;
	/** A beat passed, for the games that keep time. Optional: most games have none. */
	tick?(): void;
}

export const silent: Sounds = { success() {}, wrong() {}, done() {} };

const C5 = 523.25;
/** Semitones above C5 of a major pentatonic scale: every note sounds good after the last. */
const PENTATONIC = [0, 2, 4, 7, 9];
/** The highest octave reached, so a long run never turns shrill. */
const MAX_OCTAVE = 1;

/** The pitch for the `index`-th prime found: up the pentatonic scale, an octave every five. */
export function successFrequency(index: number): number {
	const octave = Math.min(Math.floor(index / PENTATONIC.length), MAX_OCTAVE);
	const step = index >= PENTATONIC.length * (MAX_OCTAVE + 1) ? 0 : PENTATONIC[index % 5];
	return C5 * 2 ** ((step + 12 * octave) / 12);
}

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

/** The real thing. The audio context is made on first use, which is always inside a tap. */
export function webAudioSounds(): Sounds {
	let ctx: AudioContext | null = null;

	function context(): AudioContext | null {
		try {
			if (typeof window === 'undefined') return null;
			const Ctor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
			if (!Ctor) return null;
			ctx ??= new Ctor();
			if (ctx.state === 'suspended') void ctx.resume();
			return ctx;
		} catch {
			return null;
		}
	}

	/** One note: a soft attack, then a fade. `to` slides the pitch over the note. */
	function tone(
		c: AudioContext,
		freq: number,
		after: number,
		length: number,
		type: OscillatorType,
		volume: number,
		to?: number
	) {
		const t = c.currentTime + after;
		const osc = c.createOscillator();
		const gain = c.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		if (to) osc.frequency.exponentialRampToValueAtTime(to, t + length);
		gain.gain.setValueAtTime(0.0001, t);
		gain.gain.linearRampToValueAtTime(volume, t + 0.012);
		gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
		osc.connect(gain).connect(c.destination);
		osc.start(t);
		osc.stop(t + length + 0.03);
	}

	function play(make: (c: AudioContext) => void) {
		try {
			const c = context();
			if (c) make(c);
		} catch {
			// no sound is better than a broken game
		}
	}

	return {
		success: (index) =>
			play((c) => {
				const f = successFrequency(index);
				tone(c, f, 0, 0.2, 'triangle', 0.16);
				tone(c, f * 1.5, 0.05, 0.22, 'sine', 0.08);
			}),
		wrong: () =>
			play((c) => {
				tone(c, 170, 0, 0.28, 'sawtooth', 0.09, 105);
			}),
		done: () =>
			play((c) => {
				[C5, C5 * 1.26, C5 * 1.5, C5 * 2].forEach((f, i) =>
					tone(c, f, 0.25 + i * 0.1, 0.26, 'triangle', 0.14)
				);
			}),
		// A soft, short click, the same on every beat so it never gives a meeting away.
		tick: () =>
			play((c) => {
				tone(c, 330, 0, 0.05, 'sine', 0.05);
			})
	};
}
