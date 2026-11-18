<script lang="ts">
	import SectionCard from '$lib/transformasi/SectionCard.svelte';
	import { chapterLabel, chapterText, sectionHref, type Chapter } from '$lib/chapters';

	// The shared chapter landing: eyebrow, title, blurb, and one card per Section.
	// A chapter with no sections yet shows a "coming soon" note instead of a list.
	let { chapter }: { chapter: Chapter } = $props();
	const t = $derived(chapterText(chapter));
</script>

<svelte:head>
	<title>{chapter.title}</title>
	<meta name="description" content="{chapterLabel(chapter)}: {chapter.title} — {t.interactive}." />
</svelte:head>

<div class="container mx-auto max-w-2xl space-y-10 px-8 py-16">
	<hgroup class="space-y-2">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">
			{chapterLabel(chapter)}
		</p>
		<h1 class="ink-linear-gradient text-5xl font-bold">{chapter.title}</h1>
		<p class="opacity-80">{chapter.description}</p>
	</hgroup>

	{#if chapter.sections.length > 0}
		<nav aria-label={t.sectionList}>
			<ul class="space-y-3">
				{#each chapter.sections as section (section.slug)}
					<li>
						<SectionCard
							number={section.number}
							title={section.title}
							description={section.description}
							href={section.ready === false ? undefined : sectionHref(chapter, section)}
							outline={section.outline}
							badge={t.comingSoon}
						/>
					</li>
				{/each}
			</ul>
		</nav>
	{:else}
		<p class="card bg-base-200 p-5 opacity-80">{t.noSections}</p>
	{/if}
</div>
