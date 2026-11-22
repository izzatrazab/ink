<script lang="ts">
	import { getChapter, miniGameTitle } from '$lib/chapters';
	import { reader } from '$lib/language.svelte';
	import { shareText } from './shareText';
	import { useCopy } from './useCopy';

	// "Copy result": puts a line a student can paste in a class chat — game, stars,
	// slips, one line of detail, the page — on the clipboard. If the browser refuses,
	// the text is shown to select by hand instead, so sharing never just fails.
	interface Props {
		/** The game's slug in the chapter registry, e.g. "prime-hunt". */
		game: string;
		stars: number;
		slips?: number;
		detail?: string;
	}

	let { game, stars, slips = 0, detail }: Props = $props();

	const copy = useCopy();
	const t = $derived(copy.t.games.common);
	const chapter = $derived(reader.view(getChapter('factors-and-multiples')));
	const text = $derived(
		shareText({
			title: miniGameTitle(chapter, game),
			stars,
			slips,
			detail,
			url: typeof window === 'undefined' ? undefined : window.location.href
		})
	);

	let status = $state<'idle' | 'copied' | 'failed'>('idle');
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function share() {
		clearTimeout(timer);
		try {
			await navigator.clipboard.writeText(text);
			status = 'copied';
			timer = setTimeout(() => (status = 'idle'), 2500);
		} catch {
			status = 'failed';
		}
	}
</script>

<div class="space-y-2 text-center">
	<button type="button" class="btn btn-outline" onclick={share}>
		<span aria-hidden="true">{status === 'copied' ? '✓' : '⧉'}</span>
		{status === 'copied' ? t.copied : t.share}
	</button>
	<div role="status" aria-live="polite">
		{#if status === 'failed'}
			<p class="ink-muted text-sm">{t.copyFailed}</p>
			<textarea
				class="textarea textarea-bordered w-full max-w-sm text-sm"
				rows="3"
				readonly
				value={text}
				onfocus={(e) => e.currentTarget.select()}></textarea>
		{/if}
	</div>
</div>
