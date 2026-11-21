<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { TIERS, isKnown, tierPrimes, witness } from './primeHunt';
	import { startPrimeHunt } from './primeHuntStore.svelte';
	import { webAudioSounds } from './sound';
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import Confetti from './Confetti.svelte';

	// Prime Hunt: the Mini-game's screen. The rules live in primeHunt.ts, the live
	// game (board, taps, progress, sound) in primeHuntStore.svelte.ts; this only
	// draws them. Every tap is judged at once: a prime turns green with a pop and a
	// chime, a non-prime turns red with a shake and a buzz, and says why. Verdicts
	// carry a mark and a word, never colour alone, and the animations drop out for
	// readers who ask for reduced motion (app.css).
	const game = startPrimeHunt({ sounds: webAudioSounds() });
	const copy = useCopy();
	const t = $derived(copy.t.games.primeHunt);

	// No board exists until mounted (a random board would differ between server and browser).
	let ready = $state(false);
	onMount(() => {
		game.start();
		ready = true;
	});

	// The Study panel is closed for good once the student starts tapping: studying
	// is for between boards, so the board stays a recall test.
	let studyOpen = $state(false);
	$effect(() => {
		if (game.inPlay) studyOpen = false;
	});

	function explain(n: number): string {
		const w = witness(n);
		if (w.kind === 'one') return t.explainOne;
		if (w.kind === 'prime') return t.explainPrime(n);
		return t.explainPair(n, w.a, w.b);
	}

	let headline = $state<HTMLElement>();
	$effect(() => {
		if (game.result) tick().then(() => headline?.focus());
	});

	const firstLocked = $derived(TIERS.find((max) => !game.unlocked.includes(max)));
	const lockedBefore = $derived(
		firstLocked === undefined ? 0 : TIERS[TIERS.indexOf(firstLocked) - 1]
	);
</script>

<div class="space-y-6">
	<p class="leading-relaxed"><Rich text={t.intro} /></p>

	<!-- Which primes to learn -->
	<div class="space-y-3">
		<div class="flex flex-wrap items-center gap-2" role="group" aria-label={t.tierGroup}>
			{#each TIERS as max (max)}
				{@const open = game.unlocked.includes(max)}
				<button
					type="button"
					class="btn btn-sm {game.tier === max ? 'btn-primary' : 'btn-outline'}"
					aria-pressed={game.tier === max}
					aria-label={open ? t.tier(max) : t.lockedTier(max, TIERS[TIERS.indexOf(max) - 1])}
					disabled={!open}
					onclick={() => game.selectTier(max)}
				>
					{open ? '' : '🔒 '}{t.tier(max)}
				</button>
			{/each}
		</div>
		{#if firstLocked !== undefined}
			<p class="ink-muted text-sm">{t.lockedTier(firstLocked, lockedBefore)}</p>
		{/if}
		{#if ready}
			<div class="flex items-center gap-3">
				<progress
					class="progress progress-primary max-w-xs"
					value={game.knownCount}
					max={game.tierTotal}
					aria-label={t.known(game.knownCount, game.tierTotal)}
				></progress>
				<span class="ink-muted text-sm">{t.known(game.knownCount, game.tierTotal)}</span>
			</div>
		{/if}
	</div>

	<!-- Study panel and sound -->
	<div class="space-y-3">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<button
				type="button"
				class="btn btn-ghost btn-sm"
				aria-expanded={studyOpen}
				aria-controls="study-panel"
				disabled={game.inPlay}
				onclick={() => (studyOpen = !studyOpen)}
			>
				{studyOpen ? t.studyClose : t.studyOpen}
			</button>
			<button
				type="button"
				class="btn btn-ghost btn-sm"
				aria-pressed={!game.muted}
				onclick={() => game.toggleMute()}
			>
				<span aria-hidden="true">{game.muted ? '🔇' : '🔊'}</span>
				{game.muted ? t.soundOff : t.soundOn}
			</button>
		</div>
		{#if game.inPlay}
			<p class="ink-muted text-sm">{t.studyLocked}</p>
		{/if}
		{#if studyOpen}
			<div id="study-panel" class="ink-card space-y-3 p-5">
				<h3 class="font-display text-lg font-bold">{t.studyHeading(game.tier)}</h3>
				<ul class="flex flex-wrap gap-2">
					{#each tierPrimes(game.tier) as p (p)}
						<li
							class="badge badge-lg {isKnown(game.progress, p) ? 'badge-success' : 'badge-outline'}"
						>
							{p}{isKnown(game.progress, p) ? ' ✓' : ''}
						</li>
					{/each}
				</ul>
				<p class="ink-muted text-sm">{t.studyNote}</p>
			</div>
		{/if}
	</div>

	<!-- The board -->
	{#if !ready}
		<p class="ink-muted min-h-64 text-center" role="status">{t.loading}</p>
	{:else}
		<div class="ink-card space-y-5 p-5 sm:p-8">
			<div class="space-y-1 text-center">
				<p class="font-semibold">{t.instruction}</p>
				<p class="text-primary font-display text-lg font-bold" aria-live="polite">
					{#if !game.result}{t.left(game.left)}{/if}
				</p>
			</div>

			<div
				class="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-3"
				role="group"
				aria-label={t.boardAria}
			>
				{#each game.board as n (n)}
					{@const state = game.found.includes(n)
						? 'found'
						: game.wrong.includes(n)
							? 'wrong'
							: 'open'}
					<button
						type="button"
						class="btn font-display relative h-16 text-2xl sm:h-20 {state === 'found'
							? 'btn-success cell-pop'
							: state === 'wrong'
								? 'btn-error cell-shake'
								: 'btn-outline'}"
						aria-label={t.cell(n, state)}
						aria-disabled={state === 'open' ? undefined : true}
						onclick={() => game.tap(n)}
					>
						{n}
						{#if state !== 'open'}
							<span class="absolute top-1 right-2 text-xs font-bold" aria-hidden="true"
								>{state === 'found' ? '✓' : '✗'}</span
							>
						{/if}
					</button>
				{/each}
			</div>

			<!-- The moment a wrong number is tapped, say so and say why. -->
			<div role="alert" class="min-h-12">
				{#if game.lastWrong !== null}
					<p class="alert alert-error alert-soft justify-center text-center font-semibold">
						<span aria-hidden="true">✗</span>
						{explain(game.lastWrong)}
					</p>
				{/if}
			</div>

			{#if game.result}
				<!-- A perfect board: every prime found, not one wrong tap. Mounting it plays it once. -->
				{#if game.result.stars === 3}<Confetti />{/if}
				<div class="space-y-4" role="status">
					<div class="text-center">
						<p
							bind:this={headline}
							tabindex="-1"
							class="font-display text-2xl font-bold outline-none"
						>
							{t.headline(game.result.stars)}
						</p>
						<p class="text-primary text-2xl" role="img" aria-label={t.stars(game.result.stars)}>
							{'★'.repeat(game.result.stars)}<span class="opacity-30"
								>{'★'.repeat(3 - game.result.stars)}</span
							>
						</p>
						{#if game.streak > 1}
							<p class="ink-muted text-sm">{t.streak(game.streak)}</p>
						{/if}
						{#if game.justUnlocked}
							<p class="text-success font-semibold">{t.unlocked(game.justUnlocked)}</p>
						{/if}
					</div>

					{#if game.wrong.length > 0}
						<div class="space-y-2">
							<h3 class="font-display font-bold">{t.reviewHeading}</h3>
							<ul class="space-y-1">
								{#each game.wrong as n (n)}
									<li class="flex gap-2">
										<span class="badge badge-error badge-sm mt-1 shrink-0">{t.wrong}</span>
										<span>{explain(n)}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<div class="text-center">
						<button type="button" class="btn btn-primary" onclick={() => game.next()}
							>{t.next}</button
						>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Played once, when a cell first gets the class. Reduced motion zeroes these in app.css. */
	@keyframes cell-pop {
		0% {
			transform: scale(1);
		}
		40% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes cell-shake {
		0%,
		100% {
			translate: 0;
		}
		20% {
			translate: -7px;
		}
		40% {
			translate: 7px;
		}
		60% {
			translate: -4px;
		}
		80% {
			translate: 4px;
		}
	}
	:global(.cell-pop) {
		animation: cell-pop 0.35s ease-out;
	}
	:global(.cell-shake) {
		animation: cell-shake 0.4s ease-in-out;
	}
</style>
