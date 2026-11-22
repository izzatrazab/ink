// The rules of Prime Blitz, Prime Hunt's optional challenge: the same Boards and
// the same judging, against the clock. 60 seconds, new Boards dealt one after
// another, a find scores a point and a wrong tap takes one away (never below 0).
// It is a side mode: it earns a personal best per Prime tier, and does not touch
// the student's Known primes or unlocks. Pure and framework-free.

import { TIERS, type Tier } from './primeHunt';

export const BLITZ_SECONDS = 60;

/** Per tier: the best score the student has reached. Absent means none yet. */
export type Best = Partial<Record<Tier, number>>;

/** The score after a tap: a find is a point, a wrong tap costs one, never below 0. */
export function nextScore(score: number, outcome: 'found' | 'wrong'): number {
	return outcome === 'found' ? score + 1 : Math.max(0, score - 1);
}

/** The bests after a run, and whether this run set a new one (a first score above 0 counts). */
export function withBest(best: Best, tier: Tier, score: number): { best: Best; isBest: boolean } {
	const previous = best[tier] ?? 0;
	return score > previous
		? { best: { ...best, [tier]: score }, isBest: true }
		: { best, isBest: false };
}

/** Reads saved bests, dropping anything that is not a known tier with a whole, non-negative score. */
export function parseBest(raw: string | null): Best {
	if (!raw) return {};
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		return {};
	}
	if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
	const best: Best = {};
	for (const tier of TIERS) {
		const value = (data as Record<string, unknown>)[tier];
		if (Number.isInteger(value) && (value as number) >= 0) best[tier] = value as number;
	}
	return best;
}
