import { describe, expect, it } from 'vitest';
import { gameProgress } from './gameProgress';
import { copy } from './copy';
import { PROGRESS_KEY as BREAKER } from './primeBreakerStore.svelte';
import { PROGRESS_KEY as HUNT } from './primeHuntStore.svelte';
import { tierPrimes } from './primeHunt';

const t = copy.en.games.hub;
const reader = (data: Record<string, string>) => (key: string) => data[key] ?? null;

describe('gameProgress', () => {
	it('says "not played yet" for every game when nothing is saved', () => {
		const p = gameProgress(reader({}), t);
		expect(Object.keys(p).sort()).toEqual([
			'meet-again',
			'multiples-hunt',
			'prime-breaker',
			'prime-hunt'
		]);
		for (const game of Object.values(p)) {
			expect(game.done).toBe(0);
			expect(game.label).toBe(t.notPlayed);
		}
	});
	it('counts the primes known in Prime Hunt', () => {
		const known = Object.fromEntries(tierPrimes(20).map((q) => [q, 2]));
		const p = gameProgress(reader({ [HUNT]: JSON.stringify(known) }), t);
		expect(p['prime-hunt'].done).toBe(8);
		expect(p['prime-hunt'].total).toBe(25);
		expect(p['prime-hunt'].label).toBe('8 of 25 primes known');
	});
	it('counts the levels mastered in a kind-based game, and shows a game just begun', () => {
		const begun = gameProgress(reader({ [BREAKER]: '{"single":1}' }), t);
		expect(begun['prime-breaker']).toMatchObject({
			done: 0,
			total: 3,
			label: '0 of 3 levels mastered'
		});
		const some = gameProgress(reader({ [BREAKER]: '{"single":3,"hcf":4}' }), t);
		expect(some['prime-breaker']).toMatchObject({ done: 2, label: '2 of 3 levels mastered' });
	});
	it('treats blocked storage and junk as not played', () => {
		const blocked = () => {
			throw new Error('blocked');
		};
		expect(gameProgress(blocked, t)['prime-hunt'].label).toBe(t.notPlayed);
		expect(gameProgress(reader({ [BREAKER]: 'nope' }), t)['prime-breaker'].label).toBe(t.notPlayed);
	});
});
