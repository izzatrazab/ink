<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import FigureCard from '$lib/transformasi/FigureCard.svelte';
	import Stage from '$lib/transformasi/Stage.svelte';
	import { KINDS, MASTERED_ROUNDS, TEMPOS, dark, firstMeeting, meetingBeats } from './meetAgain';
	import { startMeetAgain } from './meetAgainStore.svelte';
	import { stageHeight } from './lanes';
	import MultipleLanes from './MultipleLanes.svelte';
	import { webAudioSounds } from './sound';
	import { useCopy } from './useCopy';
	import Rich from './Rich.svelte';
	import Confetti from './Confetti.svelte';
	import ShareResult from './ShareResult.svelte';

	// Meet Again: the Mini-game's screen. The rules live in meetAgain.ts, the live
	// game (beat clock, Round, progress, sound) in meetAgainStore.svelte.ts; this
	// only draws them. Lights blink on the beats that are multiples of their period;
	// "Together!" is judged against the beat now lit. A lit light says ON as well as
	// glowing, nothing flashes faster than the beat (at most 1.5 a second), the speed
	// is the student's choice with a step-by-step mode that has no clock at all, and
	// a timed Round holds itself when the tab is hidden.
	const game = startMeetAgain({ sounds: webAudioSounds() });
	const copy = useCopy();
	const t = $derived(copy.t.games.meetAgain);
	const c = $derived(copy.t.games.common);

	// No Round exists until mounted (a random Round would differ between server and browser).
	let ready = $state(false);
	const hold = () => {
		if (document.hidden) game.pause();
	};
	onMount(() => {
		game.start();
		ready = true;
		document.addEventListener('visibilitychange', hold);
	});
	onDestroy(() => {
		game.stop();
		if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', hold);
	});

	const list = $derived(copy.t.s22.and(game.round.periods));

	function explain(m: { beat: number; kind: 'early' | 'missed' }): string {
		if (m.kind === 'missed') return t.missed(m.beat, list);
		const off = dark(game.round.periods, m.beat);
		return off ? t.early(m.beat, off.period, off.rest) : '';
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
	const meets = $derived(meetingBeats(game.round).join(', '));
	const h = $derived(stageHeight(game.round.periods.length));
</script>

<div class="space-y-6">
	<p class="leading-relaxed"><Rich text={t.intro} /></p>

	<!-- What to play -->
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

		<!-- Speed: the student's choice, held while a Round is in play. -->
		<div class="flex flex-wrap items-center justify-between gap-2">
			<div class="flex flex-wrap items-center gap-2" role="group" aria-label={t.tempoGroup}>
				<span class="text-sm font-semibold tracking-wide uppercase ink-muted">{t.tempoGroup}</span>
				{#each TEMPOS as tempo (tempo)}
					<button
						type="button"
						class="btn btn-sm {game.tempo === tempo ? 'btn-primary' : 'btn-outline'}"
						aria-pressed={game.tempo === tempo}
						disabled={game.inPlay}
						onclick={() => game.setTempo(tempo)}>{t.tempo(tempo)}</button
					>
				{/each}
			</div>
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
			<p class="ink-muted text-sm">{t.tempoHeld}</p>
		{/if}
	</div>

	<!-- The Round -->
	{#if !ready}
		<p class="ink-muted min-h-64 text-center" role="status">{t.loading}</p>
	{:else}
		<div class="ink-card space-y-5 p-5 sm:p-8">
			<div class="space-y-1 text-center">
				<p class="text-lg font-semibold">{t.task}</p>
				<p class="text-primary font-display text-lg font-bold" aria-live="polite">
					{t.caught(game.met.length, game.round.meetings)}
				</p>
				{#if game.retrying && !game.result}<p class="ink-muted text-sm">{c.practice}</p>{/if}
			</div>

			<!-- The lights: lit means ON, said in words as well as glowing. -->
			<div
				class="flex flex-wrap items-center justify-center gap-4"
				role="group"
				aria-label={t.lightsAria}
			>
				{#each game.round.periods as period, i (period)}
					{@const lit = game.lit[i]}
					<div class="flex flex-col items-center gap-2">
						<div
							class="flex size-24 items-center justify-center rounded-full border-4 text-lg font-bold sm:size-28 {lit
								? 'border-warning bg-warning text-warning-content'
								: 'border-base-content/30 bg-base-200 ink-muted'}"
							role="img"
							aria-label="{t.light(period)}: {lit ? t.on : t.off}"
						>
							{lit ? t.on : t.off}
						</div>
						<span class="font-mono font-semibold">{t.light(period)}</span>
					</div>
				{/each}
			</div>

			<p class="text-center font-display text-3xl font-bold" aria-live="off">
				{t.beat(game.beat)}
			</p>

			<!-- Controls -->
			<div class="flex flex-wrap items-center justify-center gap-3">
				{#if !game.started}
					<button type="button" class="btn btn-primary btn-lg" onclick={() => game.begin()}
						>{t.start}</button
					>
				{:else if !game.result}
					<button
						type="button"
						class="btn btn-secondary btn-lg min-w-48"
						disabled={game.paused}
						onclick={() => game.tapTogether()}>{t.together}</button
					>
					{#if !game.timed}
						<button type="button" class="btn btn-outline btn-lg" onclick={() => game.step()}
							>{t.nextBeat}</button
						>
					{:else if game.paused}
						<button type="button" class="btn btn-outline" onclick={() => game.resume()}
							>{t.resume}</button
						>
					{:else}
						<button type="button" class="btn btn-ghost btn-sm" onclick={() => game.pause()}
							>{t.pause}</button
						>
					{/if}
				{/if}
			</div>
			{#if !game.started}
				<p class="ink-muted text-center text-sm">{t.ready}</p>
			{:else if game.paused}
				<p class="ink-muted text-center text-sm" role="status">{t.paused}</p>
			{/if}

			<!-- The moment a slip happens, say so and say why. -->
			<div role="alert" class="min-h-14">
				{#if game.lastMistake && !game.result}
					<p class="alert alert-error alert-soft justify-center text-center font-semibold">
						<span aria-hidden="true">✗</span>
						{explain(game.lastMistake)}
					</p>
				{/if}
			</div>

			{#if game.result}
				<!-- A perfect Round: every meeting caught, no slip. Mounting it plays it once. -->
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
						<p class="mt-2"><Rich text={t.meetNote(meets, firstMeeting(game.round.periods))} /></p>
						{#if game.streak > 1}
							<p class="ink-muted text-sm">{t.streak(game.streak)}</p>
						{/if}
						{#if game.justUnlocked}
							<p class="text-success font-semibold">{t.unlocked(kindName(game.justUnlocked))}</p>
						{/if}
					</div>

					<!-- The same lights as lanes: each dot a beat it is lit, all landing on the LCM. -->
					<FigureCard aspect="200/{h}" class="max-w-md text-secondary!">
						<Stage viewBox="0 0 200 {h}" class="h-full w-full">
							<MultipleLanes
								n={firstMeeting(game.round.periods)}
								of={game.round.periods}
								playing={true}
							/>
						</Stage>
					</FigureCard>

					{#if game.play.mistakes.length > 0}
						<div class="space-y-2">
							<h3 class="font-display font-bold">{t.reviewHeading}</h3>
							<ul class="space-y-1">
								{#each game.play.mistakes as m (m.beat)}
									<li class="flex gap-2">
										<span class="badge badge-error badge-sm mt-1 shrink-0">{t.wrong}</span>
										<span>{explain(m)}</span>
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
						game="meet-again"
						stars={game.result.stars}
						slips={game.mistakes}
						detail={game.round.periods.join(' · ')}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>
