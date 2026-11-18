<script lang="ts">
	import type { Snippet } from 'svelte';
	import { chapterHref, chapterLabel, chapterText, getChapter } from '$lib/chapters';

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
		/** Section title, e.g. "Translasi". */
		title: string;
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

	let { number, title, description, chapter, docTitle, prev, next, children }: Props = $props();

	const chapterMeta = $derived(getChapter(chapter));
	const t = $derived(chapterText(chapterMeta));
	const headTitle = $derived(docTitle ?? `${number} ${title}`);
</script>

<svelte:head>
	<title>{headTitle}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="container mx-auto max-w-2xl space-y-12 px-8 py-16">
	<hgroup class="space-y-2">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
			{chapterLabel(chapterMeta)} · {chapterMeta.title}
		</p>
		<h1 class="text-4xl font-bold">{number} {title}</h1>
	</hgroup>

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
