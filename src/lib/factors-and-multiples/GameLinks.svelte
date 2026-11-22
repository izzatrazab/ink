<script lang="ts">
	import { getChapter, miniGameHref } from '$lib/chapters';
	import { reader } from '$lib/language.svelte';
	import { useCopy } from './useCopy';

	// The "play a game" box at the end of a lesson beat: a card per game that
	// practises what the beat just taught. Titles and summaries come from the
	// registry, so the lesson, the hub and the game page cannot disagree.
	let { games }: { games: string[] } = $props();

	const copy = useCopy();
	const t = $derived(copy.t.games.practise);
	const chapter = $derived(reader.view(getChapter('factors-and-multiples')));
	const cards = $derived(
		games.flatMap((slug) => chapter.miniGames?.filter((g) => g.slug === slug) ?? [])
	);
</script>

<aside class="space-y-3 pt-4" aria-label={t.heading}>
	<p class="text-sm font-semibold tracking-wide uppercase ink-muted">{t.heading}</p>
	<ul class="grid gap-3 sm:grid-cols-2">
		{#each cards as game (game.slug)}
			<li>
				<a href={miniGameHref(chapter, game)} class="ink-card block space-y-1 p-5">
					<span
						class="bg-secondary/10 text-secondary rounded-full px-3 py-0.5 text-sm font-semibold"
						>{t.play}</span
					>
					<span class="font-display block text-lg font-bold">{game.title}</span>
					<span class="block text-sm opacity-70">{game.description}</span>
				</a>
			</li>
		{/each}
	</ul>
</aside>
