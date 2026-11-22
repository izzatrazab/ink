// The progress rules the three kind-based Mini-games share (Prime Breaker,
// Multiples Hunt, Meet Again): a game has an ordered list of kinds; each kind
// counts the rounds finished with no mistake (a clean round); a kind unlocks once
// the kind before it has `needed` clean rounds. Pure and framework-free; each game
// supplies its own kinds and threshold and keeps its own storage key.

export interface KindProgress<K extends string> {
	/** Progress after a finished round: only a mistake-free one counts. */
	apply(
		progress: Partial<Record<K, number>>,
		kind: K,
		mistakes: number
	): Partial<Record<K, number>>;
	isMastered(progress: Partial<Record<K, number>>, kind: K): boolean;
	/** The kinds the student may play: the first, and each one after a mastered kind. */
	unlocked(progress: Partial<Record<K, number>>): K[];
	/** Reads saved progress, dropping anything that is not a known kind with a whole, non-negative count. */
	parse(raw: string | null): Partial<Record<K, number>>;
}

export function kindProgress<K extends string>(
	kinds: readonly K[],
	needed: number
): KindProgress<K> {
	type P = Partial<Record<K, number>>;
	const isMastered = (progress: P, kind: K) => (progress[kind] ?? 0) >= needed;
	return {
		apply: (progress, kind, mistakes) =>
			mistakes === 0 ? { ...progress, [kind]: (progress[kind] ?? 0) + 1 } : progress,
		isMastered,
		unlocked(progress) {
			const open: K[] = [];
			for (const [i, kind] of kinds.entries()) {
				if (i === 0 || isMastered(progress, kinds[i - 1])) open.push(kind);
				else break;
			}
			return open;
		},
		parse(raw) {
			if (!raw) return {};
			let data: unknown;
			try {
				data = JSON.parse(raw);
			} catch {
				return {};
			}
			if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
			const progress: P = {};
			for (const kind of kinds) {
				const value = (data as Record<string, unknown>)[kind];
				if (Number.isInteger(value) && (value as number) >= 0) progress[kind] = value as number;
			}
			return progress;
		}
	};
}
