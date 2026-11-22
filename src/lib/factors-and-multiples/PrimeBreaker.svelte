<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { motionDuration } from '$lib/motion';
	import {
		DIVISORS,
		KINDS,
		MASTERED_ROUNDS,
		OWN_DIVISORS,
		isBoss,
		ownNumber
	} from './primeBreaker';
	import { startPrimeBreaker } from './primeBreakerStore.svelte';
	import { narrate, product, reachedOnes } from './ladder';
	import { webAudioSounds } from './sound';
	import { useCopy } from './useCopy';
	import LadderRows from './LadderRows.svelte';
	import Rich from './Rich.svelte';
	import Confetti from './Confetti.svelte';
	import ShareResult from './ShareResult.svelte';

	// Prime Breaker: the Mini-game's screen. The rules live in primeBreaker.ts and
	// ladder.ts, the live game (Round, taps, progress, sound) in
	// primeBreakerStore.svelte.ts; this only draws them. Every tap is judged at
	// once by the ladder's own rules: a prime that fits drops a new row with a
	// chime, one that does not shakes with a buzz and says why. Verdicts carry a
	// mark and a word, never colour alone, and the shake drops out for readers who
	// ask for reduced motion.
	const game = startPrimeBreaker({ sounds: webAudioSounds() });
	const copy = useCopy();
	const t = $derived(copy.t.games.primeBreaker);
	const c = $derived(copy.t.games.common);
	const lt = $derived(copy.t.ladder);

	// No Round exists until mounted (a random Round would differ between server and browser).
	let ready = $state(false);
	onMount(() => {
		game.start();
		ready = true;
	});

	const done = $derived(game.result !== null);
	const label = (row: number[]) => row.join(', ');
	const refusal = $derived(game.refusal);
	const message = $derived(
		refusal
			? narrate(
					refusal.before,
					refusal.d,
					{ ok: false, rejection: refusal.rejection },
					game.kind,
					lt
				)
			: ''
	);

	// What the finished ladder says: the factorisation, or the HCF / LCM with its working.
	const answer = $derived(
		game.kind === 'single'
			? `${game.startRow[0]} = ${game.divisors.join(' × ')}`
			: `${game.kind === 'hcf' ? lt.hcf : lt.lcm} = ${game.divisors.join(' × ')} = ${product(game.divisors)}`
	);

	let headline = $state<HTMLElement>();
	$effect(() => {
		if (game.result) tick().then(() => headline?.focus());
	});

	// The student's own number: checked before it is dealt, so a ladder is never unfinishable.
	let ownText = $state('');
	let ownBad = $state(false);
	function breakOwn(e: SubmitEvent) {
		e.preventDefault();
		const n = ownNumber(ownText);
		ownBad = n === null;
		if (n !== null) game.startOwn(n);
	}
	const buttons = $derived(game.own ? OWN_DIVISORS : DIVISORS);
	const boss = $derived(game.kind === 'single' && !game.own && isBoss(game.startRow));

	const kindName = (kind: (typeof KINDS)[number]) => t.kind(kind);
	const firstLocked = $derived(KINDS.find((k) => !game.unlocked.includes(k)));
	const lockedBefore = $derived(
		firstLocked === undefined ? undefined : KINDS[KINDS.indexOf(firstLocked) - 1]
	);
</script>

<div class="space-y-6">
	<p class="leading-relaxed"><Rich text={t.intro} /></p>

	<!-- What to break -->
	<div class="space-y-3">
		<div class="flex flex-wrap items-center gap-2" role="group" aria-label={t.kindGroup}>
			{#each KINDS as kind (kind)}
				{@const open = game.unlocked.includes(kind)}
				<button
					type="button"
					class="btn btn-sm {game.kind === kind ? 'btn-primary' : 'btn-outline'}"
					aria-pressed={game.kind === kind}
					aria-label={open
						? kindName(kind)
						: t.lockedKind(kindName(kind), kindName(KINDS[KINDS.indexOf(kind) - 1]))}
					disabled={!open}
					onclick={() => game.selectKind(kind)}
				>
					{open ? '' : '🔒 '}{kindName(kind)}
				</button>
			{/each}
		</div>
		{#if firstLocked !== undefined && lockedBefore !== undefined}
			<p class="ink-muted text-sm">{t.lockedKind(kindName(firstLocked), kindName(lockedBefore))}</p>
		{/if}
		{#if ready}
			<div class="flex items-center gap-3">
				<progress
					class="progress progress-primary max-w-xs"
					value={Math.min(game.clean, MASTERED_ROUNDS)}
					max={MASTERED_ROUNDS}
					aria-label={t.clean(game.clean, MASTERED_ROUNDS)}
				></progress>
				<span class="ink-muted text-sm">{t.clean(game.clean, MASTERED_ROUNDS)}</span>
			</div>
		{/if}
		<div class="flex justify-end">
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
	</div>

	<!-- The Round -->
	{#if !ready}
		<p class="ink-muted min-h-64 text-center" role="status">{t.loading}</p>
	{:else}
		<div class="ink-card space-y-5 p-5 sm:p-8">
			{#if boss}
				<p class="text-center"><span class="badge badge-warning font-bold">{t.boss}</span></p>
			{/if}
			<p class="text-center text-lg font-semibold">
				<Rich text={t.task(game.kind, game.startRow.join(', '))} />
				{#if game.combo >= 2 && !game.result}
					<span class="badge badge-secondary ml-2" aria-label={c.comboAria(game.combo)}
						>{c.combo(game.combo)}</span
					>
				{/if}
			</p>
			{#if (game.retrying || game.own) && !game.result}
				<p class="ink-muted text-center text-sm">{c.practice}</p>
			{/if}

			<div class="space-y-2 text-center">
				<p class="text-sm font-semibold tracking-wide uppercase ink-muted">
					{done ? lt.finished : t.primesGroup}
				</p>
				<div class="flex flex-wrap justify-center gap-2" role="group" aria-label={t.primesGroup}>
					{#each buttons as d (d)}
						<button
							type="button"
							class="btn btn-square size-11! min-h-0 {refusal?.d === d
								? 'btn-error'
								: 'btn-outline'}"
							class:shake={refusal?.d === d}
							disabled={done}
							onclick={() => game.tap(d)}>{d}</button
						>
					{/each}
				</div>
			</div>

			<!-- The moment a prime is refused, say so and say why. -->
			<div role="alert" class="min-h-14 text-center leading-relaxed">
				{#if message}
					<p class="alert alert-error alert-soft justify-center font-semibold">
						<span aria-hidden="true">✗</span>
						{message}
					</p>
				{:else if !done}
					<p class="ink-muted">
						{#if game.kind === 'hcf' && game.current.length > 1}
							<Rich text={lt.pickEvery} />
						{:else if game.kind === 'lcm' && game.current.length > 1}
							<Rich text={lt.pickOne} />
						{:else}
							<Rich text={lt.pickPrime(label(game.current))} />
						{/if}
					</p>
				{/if}
			</div>

			<LadderRows
				rows={game.rows}
				divisors={game.divisors}
				{done}
				label={lt.aria(label(game.startRow))}
			/>

			{#if game.result}
				<!-- A perfect Round: not one slip. Mounting it plays it once. -->
				{#if game.result.stars === 3}<Confetti />{/if}
				<div class="space-y-4" role="status" in:fade={{ duration: motionDuration(400) }}>
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
						<p class="alert alert-success alert-soft mt-2 justify-center font-mono font-bold">
							{answer}
						</p>
						{#if game.kind === 'hcf' && !reachedOnes(game.rows)}
							<p class="ink-muted mt-2 text-sm">{copy.t.compare.stopHcf}</p>
						{/if}
						{#if game.mistakes > 0}
							<p class="ink-muted text-sm">{t.mistakes(game.mistakes)}</p>
						{/if}
						{#if game.streak > 1}
							<p class="ink-muted text-sm">{t.streak(game.streak)}</p>
						{/if}
						{#if game.bestCombo >= 3}
							<p class="ink-muted text-sm">{c.bestRun(game.bestCombo)}</p>
						{/if}
						{#if game.justUnlocked}
							<p class="text-success font-semibold">{t.unlocked(kindName(game.justUnlocked))}</p>
						{/if}
					</div>
					<div class="flex flex-wrap items-center justify-center gap-3">
						<button type="button" class="btn btn-primary" onclick={() => game.next()}
							>{t.next}</button
						>
						{#if game.result.stars < 3}
							<button type="button" class="btn btn-outline" onclick={() => game.retry()}
								>{c.again}</button
							>
						{/if}
					</div>
					<ShareResult
						game="prime-breaker"
						stars={game.result.stars}
						slips={game.mistakes}
						detail={answer}
					/>
				</div>
			{:else}
				<div class="text-center">
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => game.skip()}
						>{t.skip}</button
					>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Break your own number: free play, never counted toward unlocking. -->
	{#if ready}
		<form class="ink-card space-y-3 p-5" onsubmit={breakOwn}>
			<h3 class="font-display text-lg font-bold">{t.ownHeading}</h3>
			<div class="flex flex-wrap items-center gap-2">
				<input
					type="text"
					inputmode="numeric"
					maxlength="4"
					class="input input-bordered w-36 font-mono"
					placeholder={t.ownPlaceholder}
					aria-label={t.ownLabel}
					aria-invalid={ownBad}
					bind:value={ownText}
					oninput={() => (ownBad = false)}
				/>
				<button type="submit" class="btn btn-outline">{t.ownGo}</button>
			</div>
			{#if ownBad}
				<p class="text-error text-sm" role="alert">{t.ownInvalid}</p>
			{/if}
		</form>
	{/if}
</div>

<style>
	.shake {
		animation: shake 0.35s;
	}
	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.shake {
			animation: none;
		}
	}
</style>
