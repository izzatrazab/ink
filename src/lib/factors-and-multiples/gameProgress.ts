// What the Mini-games hub says about each game: how far the reader has got, read
// from the progress each game keeps in the browser. Pure over a `read` function
// (localStorage in the page, a map in tests), so a blocked or empty store just
// means "not played yet". Framework-free.

import type { Copy } from './copy';
import * as breaker from './primeBreaker';
import * as hunt from './primeHunt';
import * as multiples from './multiplesHunt';
import * as meet from './meetAgain';
import { PROGRESS_KEY as BREAKER_KEY } from './primeBreakerStore.svelte';
import { PROGRESS_KEY as HUNT_KEY } from './primeHuntStore.svelte';
import { PROGRESS_KEY as MULTIPLES_KEY } from './multiplesHuntStore.svelte';
import { PROGRESS_KEY as MEET_KEY } from './meetAgainStore.svelte';

export interface GameProgress {
	done: number;
	total: number;
	label: string;
}

type HubCopy = Copy['games']['hub'];

function safeRead(read: (key: string) => string | null, key: string): string | null {
	try {
		return read(key);
	} catch {
		return null;
	}
}

/** Progress for each Mini-game, keyed by its registry slug. */
export function gameProgress(
	read: (key: string) => string | null,
	t: HubCopy
): Record<string, GameProgress> {
	const levels = <K extends string>(
		kinds: readonly K[],
		parsed: Partial<Record<K, number>>,
		isMastered: (p: Partial<Record<K, number>>, k: K) => boolean
	): GameProgress => {
		const done = kinds.filter((k) => isMastered(parsed, k)).length;
		const started = kinds.some((k) => (parsed[k] ?? 0) > 0);
		return {
			done,
			total: kinds.length,
			label: started ? t.levelsMastered(done, kinds.length) : t.notPlayed
		};
	};

	const primes = hunt.tierPrimes(hunt.TIERS[hunt.TIERS.length - 1]);
	const progress = hunt.parseProgress(safeRead(read, HUNT_KEY));
	const known = primes.filter((p) => hunt.isKnown(progress, p)).length;
	const touched = primes.some((p) => (progress[p] ?? 0) > 0);

	return {
		'prime-hunt': {
			done: known,
			total: primes.length,
			label: touched ? t.primesKnown(known, primes.length) : t.notPlayed
		},
		'prime-breaker': levels(
			breaker.KINDS,
			breaker.parseProgress(safeRead(read, BREAKER_KEY)),
			breaker.isMastered
		),
		'multiples-hunt': levels(
			multiples.KINDS,
			multiples.parseProgress(safeRead(read, MULTIPLES_KEY)),
			multiples.isMastered
		),
		'meet-again': levels(meet.KINDS, meet.parseProgress(safeRead(read, MEET_KEY)), meet.isMastered)
	};
}
