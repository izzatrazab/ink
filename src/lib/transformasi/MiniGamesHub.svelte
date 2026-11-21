<script lang="ts">
	import {
		chapterHref,
		chapterLabel,
		chapterText,
		miniGameHref,
		type Chapter
	} from '$lib/chapters';
	import { reader } from '$lib/language.svelte';
	import LanguageToggle from './LanguageToggle.svelte';

	// The Mini-games hub: the unnumbered page listing a chapter's Mini-games, one
	// card each, linked from the chapter landing (ADR-0012). Titles and summaries
	// come from the registry, so the hub and the game pages cannot disagree.
	let { chapter: base, description }: { chapter: Chapter; description: string } = $props();
	const chapter = $derived(reader.view(base));
	const t = $derived(chapterText(chapter));

	$effect(() => {
		document.documentElement.lang = chapter.lang;
	});
</script>

<svelte:head>
	<title>{t.miniGames} · {chapter.title}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="container mx-auto max-w-2xl space-y-10 px-8 py-16">
	<div class="flex items-start justify-between gap-4">
		<div class="space-y-3">
			<a href={chapterHref(chapter)} class="btn btn-ghost btn-sm -ml-3">{t.backToChapter}</a>
			<hgroup class="space-y-2">
				<p class="ink-eyebrow">{chapterLabel(chapter)} · {chapter.title}</p>
				<h1 class="ink-linear-gradient text-5xl font-bold">{t.miniGames}</h1>
				<p class="opacity-80">{t.miniGamesBlurb}</p>
			</hgroup>
		</div>
		<LanguageToggle chapter={base} />
	</div>

	<ul class="space-y-3">
		{#each chapter.miniGames ?? [] as game (game.slug)}
			<li>
				<a href={miniGameHref(chapter, game)} class="ink-card block space-y-1 p-6">
					<span
						class="bg-secondary/10 text-secondary rounded-full px-3 py-0.5 text-sm font-semibold"
						>{t.play}</span
					>
					<span class="font-display block text-xl font-bold">{game.title}</span>
					<span class="block opacity-70">{game.description}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>
