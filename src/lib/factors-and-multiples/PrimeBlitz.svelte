<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { BLITZ_SECONDS } from './primeBlitz';
	import { startPrimeBlitz } from './primeBlitzStore.svelte';
	import type { Tier } from './primeHunt';
	import type { Sounds } from './sound';
	import { useCopy } from './useCopy';
	import Confetti from './Confetti.svelte';
	import NumberBoard from './NumberBoard.svelte';

	// Prime Blitz: Prime Hunt's optional challenge. The rules live in primeBlitz.ts,
	// the live run (clock, Boards, score, best) in primeBlitzStore.svelte.ts. It is
	// opt-in and says so: the calm game stays the way to learn, and a Blitz never
	// changes the primes the student knows. The countdown is text as well as a bar.
	interface Props {
		tier: Tier;
		sounds: Sounds;
		muted: boolean;
	}
	let { tier, sounds, muted }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t.games.primeHunt);
	const b = $derived(t.blitz);

	// The page's sounds, read when played (the prop never changes, but a closure says so).
	const game = startPrimeBlitz({
		sounds: {
			success: (i) => sounds.success(i),
			wrong: () => sounds.wrong(),
			done: () => sounds.done()
		}
	});
	onMount(() => game.load());
	onDestroy(game.stop);
	$effect(() => {
		game.muted = muted;
	});
</script>

<div class="ink-card space-y-5 p-5 sm:p-8">
	{#if !game.running && !game.over}
		<div class="space-y-4 text-center">
			<p class="leading-relaxed">{b.intro}</p>
			<p class="ink-muted text-sm">{b.best(game.best[tier] ?? 0)}</p>
			<button type="button" class="btn btn-primary btn-lg" onclick={() => game.begin(tier)}
				>{b.start}</button
			>
		</div>
	{:else}
		<div class="flex flex-wrap items-center justify-between gap-3">
			<progress
				class="progress progress-secondary max-w-xs flex-1"
				value={game.secondsLeft}
				max={BLITZ_SECONDS}
				aria-hidden="true"
			></progress>
			<span class="font-display font-bold">{b.timeLeft(game.secondsLeft)}</span>
			<span class="text-primary font-display text-lg font-bold" aria-live="polite">
				{b.score(game.score)}
			</span>
		</div>

		{#if game.running}
			<NumberBoard
				numbers={game.board}
				stateOf={(n) =>
					game.play.found.includes(n) ? 'found' : game.play.wrong.includes(n) ? 'wrong' : 'open'}
				label={t.cell}
				ontap={(n) => game.tap(n)}
				ariaLabel={t.boardAria}
			/>
		{:else}
			{#if game.isBest}<Confetti />{/if}
			<div class="space-y-3 text-center" role="status">
				<p class="font-display text-2xl font-bold">{b.over(game.score)}</p>
				{#if game.isBest}<p class="text-success font-semibold">{b.newBest}</p>{/if}
				<p class="ink-muted">{b.best(game.bestHere)} · {b.cleared(game.cleared)}</p>
				<button type="button" class="btn btn-primary" onclick={() => game.begin(tier)}
					>{b.again}</button
				>
			</div>
		{/if}
	{/if}
</div>
