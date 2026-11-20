<script lang="ts">
	import type { Snippet } from 'svelte';
	import { chapterHref, chapterLabel, chapterText, getChapter, sectionTitle } from '$lib/chapters';
	import { reader } from '$lib/language.svelte';
	import LanguageToggle from './LanguageToggle.svelte';

	// The shared chrome around one Section: the page container, the header
	// (chapter eyebrow, section number + title), the <svelte:head> tags, and a
	// light back-to-chapter / prev-next nav. The lesson content is supplied as a
	// snippet. This is a thin markup wrapper extracted once a real second Section
	// existed (ADR-0008's deepen-on-second-case) — not a lesson engine: it holds
	// no beat data and renders whatever children it is given.
	interface NavLink {
		href: string;
		label: string;
	}

	interface Props {
		/** Section number, e.g. "11.2". */
		number: string;
		/** <meta name="description"> for the page. */
		description: string;
		/** Slug of the chapter this Section belongs to (see `$lib/chapters`). */
		chapter: string;
		/** Document <title>; defaults to "<number> <title>". */
		docTitle?: string;
		/** Optional link to the previous Section. */
		prev?: NavLink;
		/** Optional link to the next Section. */
		next?: NavLink;
		children: Snippet;
	}

	let { number, description, chapter, docTitle, prev, next, children }: Props = $props();

	const base = $derived(getChapter(chapter));
	// The chapter in the reader's language (its own unless they switched).
	const chapterMeta = $derived(reader.view(base));
	const t = $derived(chapterText(chapterMeta));
	// The Section's title comes from the registry, in the reader's language, so the
	// page, the chapter landing and the tab title can never disagree.
	const title = $derived(sectionTitle(chapterMeta, number));
	const headTitle = $derived(docTitle ?? `${number} ${title}`);

	$effect(() => {
		document.documentElement.lang = chapterMeta.lang;
	});
</script>

<svelte:head>
	<title>{headTitle}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="container mx-auto max-w-4xl space-y-12 px-8 py-16">
	<div class="flex items-start justify-between gap-4">
		<hgroup class="space-y-2">
			<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
				{chapterLabel(chapterMeta)} · {chapterMeta.title}
			</p>
			<h1 class="text-4xl font-bold">{number} {title}</h1>
		</hgroup>
		<LanguageToggle chapter={base} />
	</div>

	{@render children()}

	<nav class="flex flex-wrap items-center justify-between gap-3" aria-label={t.sectionNav}>
		<a href={chapterHref(chapterMeta)} class="btn btn-ghost btn-sm">{t.allSections}</a>
		<div class="flex flex-wrap gap-3">
			{#if prev}
				<a href={prev.href} class="btn btn-outline btn-primary">{prev.label}</a>
			{/if}
			{#if next}
				<a href={next.href} class="btn btn-outline btn-primary">{next.label}</a>
			{/if}
		</div>
	</nav>
</div>
