<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { KINDS, MASTERED_BOARDS, miss } from './multiplesHunt';
	import { startMultiplesHunt } from './multiplesHuntStore.svelte';
	import { lcm } from './numbers';
	import { webAudioSounds } from './sound';
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import Confetti from './Confetti.svelte';
	import ShareResult from './ShareResult.svelte';
	import NumberBoard from './NumberBoard.svelte';

	// Multiples Hunt: the Mini-game's screen. The rules live in multiplesHunt.ts, the
	// live game (Board, taps, progress, sound) in multiplesHuntStore.svelte.ts; this
	// only draws them. Every tap is judged at once and a wrong one says why, in the
	// numbers: "8 is a multiple of 4, but not of 6: 8 ÷ 6 leaves 2".
	const game = startMultiplesHunt({ sounds: webAudioSounds() });
	const copy = useCopy();
	const t = $derived(copy.t.games.multiplesHunt);
	const c = $derived(copy.t.games.common);

	// No Board exists until mounted (a random Board would differ between server and browser).
	let ready = $state(false);
	onMount(() => {
		game.start();
		ready = true;
	});

	const list = $derived(copy.t.s22.and(game.set));

	function explain(n: number): string {
		const m = miss(game.set, n);
		if (!m) return '';
		return m.of !== null && game.set.length > 1
			? t.explainTrap(n, m.of, m.s, m.rest)
			: t.explainMiss(n, m.s, m.rest);
	}

	let headline = $state<HTMLElement>();
	$effect(() => {
		if (game.result) tick().then(() => headline?.focus());
	});

	const kindName = (kind: (typeof KINDS)[number]) => t.kind(kind);
	const firstLocked = $derived(KINDS.find((k) => !game.unlocked.includes(k)));
	const lockedBefore = $derived(
		firstLocked === undefined ? undefined : KINDS[KINDS.indexOf(firstLocked) - 1]
	);
</script>

<div class="space-y-6">
	<p class="leading-relaxed"><Rich text={t.intro} /></p>

	<!-- What to hunt -->
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
					value={Math.min(game.clean, MASTERED_BOARDS)}
					max={MASTERED_BOARDS}
					aria-label={t.clean(game.clean, MASTERED_BOARDS)}
				></progress>
				<span class="ink-muted text-sm">{t.clean(game.clean, MASTERED_BOARDS)}</span>
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

	<!-- The board -->
	{#if !ready}
		<p class="ink-muted min-h-64 text-center" role="status">{t.loading}</p>
	{:else}
		<div class="ink-card space-y-5 p-5 sm:p-8">
			<div class="space-y-1 text-center">
				<p class="text-lg font-semibold"><Rich text={t.task(game.kind, list)} /></p>
				<p class="ink-muted text-sm">
					{#if game.kind === 'one'}
						{t.hintOne(game.set[0])}
					{:else}
						<Rich text={t.hintCommon} />
					{/if}
				</p>
				<p class="text-primary font-display text-lg font-bold" aria-live="polite">
					{#if !game.result}{t.left(game.left)}{/if}
					{#if game.combo >= 2 && !game.result}
						<span class="badge badge-secondary cell-pop ml-2" aria-label={c.comboAria(game.combo)}
							>{c.combo(game.combo)}</span
						>
					{/if}
				</p>
				{#if game.retrying && !game.result}<p class="ink-muted text-sm">{c.practice}</p>{/if}
			</div>

			<NumberBoard
				numbers={game.board}
				stateOf={(n) =>
					game.found.includes(n) ? 'found' : game.wrong.includes(n) ? 'wrong' : 'open'}
				label={t.cell}
				ontap={(n) => game.tap(n)}
				ariaLabel={t.boardAria}
			/>

			<!-- The moment a wrong number is tapped, say so and say why. -->
			<div role="alert" class="min-h-14">
				{#if game.lastWrong !== null}
					<p class="alert alert-error alert-soft justify-center text-center font-semibold">
						<span aria-hidden="true">✗</span>
						{explain(game.lastWrong)}
					</p>
				{/if}
			</div>

			{#if game.result}
				<!-- A perfect Board: every multiple found, not one wrong tap. Mounting it plays it once. -->
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
						{#if game.kind !== 'one'}
							<p class="mt-2"><Rich text={t.lcmNote(lcm(game.set), list)} /></p>
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
						game="multiples-hunt"
						stars={game.result.stars}
						slips={game.wrong.length}
						detail={game.set.join(' · ')}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>
