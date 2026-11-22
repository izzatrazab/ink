<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Answer } from './fizzBuzz';
	import { startFizzBuzz } from './fizzBuzzStore.svelte';
	import { lcm } from './numbers';
	import type { Sounds } from './sound';
	import { useCopy } from './useCopy';
	import Confetti from './Confetti.svelte';
	import Rich from './Rich.svelte';
	import ShareResult from './ShareResult.svelte';

	// Fizz Buzz: Multiples Hunt's side game. The rules live in fizzBuzz.ts, the live
	// run in fizzBuzzStore.svelte.ts. Count up and say Fizz / Buzz / FizzBuzz / the
	// number: FizzBuzz is a common multiple, so the game is common multiples said
	// aloud. A wrong choice says why and lets the student try the same number again.
	// Free play: it never changes Multiples Hunt's progress.
	interface Props {
		sounds: Sounds;
		muted: boolean;
	}
	let { sounds, muted }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t.games.multiplesHunt.fizz);
	const c = $derived(copy.t.games.common);

	const game = startFizzBuzz({
		sounds: {
			success: (i) => sounds.success(i),
			wrong: () => sounds.wrong(),
			done: () => sounds.done()
		}
	});
	const list = $derived(copy.t.s22.and([game.round.a, game.round.b]));
	let ready = $state(false);
	onMount(() => {
		game.start();
		ready = true;
	});
	$effect(() => {
		game.muted = muted;
	});

	const choices: { answer: Answer; style: string }[] = [
		{ answer: 'fizz', style: 'btn-primary' },
		{ answer: 'buzz', style: 'btn-secondary' },
		{ answer: 'fizzbuzz', style: 'btn-accent' },
		{ answer: 'number', style: 'btn-outline' }
	];

	let headline = $state<HTMLElement>();
	$effect(() => {
		if (game.result) tick().then(() => headline?.focus());
	});
</script>

<div class="ink-card space-y-5 p-5 sm:p-8">
	{#if !ready}
		<p class="ink-muted min-h-48 text-center" role="status">…</p>
	{:else}
		<p class="ink-muted text-center text-sm">{t.intro}</p>
		<p class="text-center leading-relaxed"><Rich text={t.rule(game.round.a, game.round.b)} /></p>

		{#if !game.result}
			<div class="space-y-1 text-center">
				<p class="ink-muted text-sm">
					{t.progress(game.n, game.round.length)}
					{#if game.combo >= 2}
						<span class="badge badge-secondary ml-2" aria-label={c.comboAria(game.combo)}
							>{c.combo(game.combo)}</span
						>
					{/if}
				</p>
				<p class="font-display text-7xl font-bold" aria-live="polite">{game.n}</p>
			</div>

			<div class="grid grid-cols-2 gap-3" role="group" aria-label={t.choices}>
				{#each choices as { answer, style } (answer)}
					<button
						type="button"
						class="btn btn-lg {style}"
						class:shake={game.lastWrong?.chose === answer}
						onclick={() => game.say(answer)}>{t[answer]}</button
					>
				{/each}
			</div>

			<div role="alert" class="min-h-14">
				{#if game.lastWrong}
					<p class="alert alert-error alert-soft justify-center text-center font-semibold">
						<span aria-hidden="true">✗</span>
						{t.why(game.answer, game.n, game.round.a, game.round.b)}
					</p>
				{/if}
			</div>
		{:else}
			{#if game.result.stars === 3}<Confetti />{/if}
			<div class="space-y-4" role="status">
				<div class="text-center">
					<p
						bind:this={headline}
						tabindex="-1"
						class="font-display text-2xl font-bold outline-none"
					>
						{copy.t.games.multiplesHunt.headline(game.result.stars)}
					</p>
					<p
						class="text-primary text-2xl"
						role="img"
						aria-label={copy.t.games.multiplesHunt.stars(game.result.stars)}
					>
						{'★'.repeat(game.result.stars)}<span class="opacity-30"
							>{'★'.repeat(3 - game.result.stars)}</span
						>
					</p>
					<p class="mt-2">
						<Rich text={t.note(list, lcm([game.round.a, game.round.b]))} />
					</p>
					{#if game.bestCombo >= 3}
						<p class="ink-muted text-sm">{c.bestRun(game.bestCombo)}</p>
					{/if}
				</div>
				<div class="flex flex-wrap items-center justify-center gap-3">
					<button type="button" class="btn btn-primary" onclick={() => game.next()}
						>{t.nextPair}</button
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
					slips={game.mistakes}
					detail={`Fizz Buzz ${game.round.a} · ${game.round.b}`}
				/>
			</div>
		{/if}
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
</style>
