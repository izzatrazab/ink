<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		chapterHref,
		chapterLabel,
		chapterText,
		getChapter,
		miniGameTitle,
		miniGamesHref
	} from '$lib/chapters';
	import { reader } from '$lib/language.svelte';
	import LanguageToggle from './LanguageToggle.svelte';

	// The chrome around one Mini-game: the sibling of <LessonShell> for a page that
	// is not a numbered Section (ADR-0012). Same container, header and language
	// toggle; the title comes from the registry's mini-game entry, and the links
	// lead back to the mini-games hub and the chapter.
	interface Props {
		/** Slug of the chapter that offers the game (see `$lib/chapters`). */
		chapter: string;
		/** The game's slug in that chapter's `miniGames`, e.g. "prime-hunt". */
		game: string;
		/** <meta name="description"> for the page. */
		description: string;
		children: Snippet;
	}

	let { chapter, game, description, children }: Props = $props();

	const base = $derived(getChapter(chapter));
	const chapterMeta = $derived(reader.view(base));
	const t = $derived(chapterText(chapterMeta));
	const title = $derived(miniGameTitle(chapterMeta, game));

	$effect(() => {
		document.documentElement.lang = chapterMeta.lang;
	});
</script>

<svelte:head>
	<title>{title} · {t.miniGames}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="ink-lesson container mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-8 sm:py-16">
	<div class="flex items-start justify-between gap-4">
		<div class="space-y-3">
			<a href={miniGamesHref(chapterMeta)} class="btn btn-ghost btn-sm -ml-3">{t.allMiniGames}</a>
			<hgroup class="space-y-2">
				<p class="ink-eyebrow">{chapterLabel(chapterMeta)} · {chapterMeta.title}</p>
				<h1 class="text-3xl font-bold sm:text-4xl">{title}</h1>
			</hgroup>
		</div>
		<LanguageToggle chapter={base} />
	</div>

	{@render children()}

	<nav class="flex flex-wrap items-center justify-between gap-3" aria-label={t.miniGameNav}>
		<a href={miniGamesHref(chapterMeta)} class="btn btn-ghost btn-sm">{t.allMiniGames}</a>
		<a href={chapterHref(chapterMeta)} class="btn btn-ghost btn-sm">{t.backToChapter}</a>
	</nav>
</div>
