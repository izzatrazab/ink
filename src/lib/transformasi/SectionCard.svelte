<script lang="ts">
	// A chapter-landing card for one Section. It reads through the same
	// number / title / description vocabulary as <LessonShell>'s header, so a
	// Section is described one way across the landing and the lesson page.
	// With no `href` the Section is only outlined: the card is not a link and
	// shows `badge` instead.
	interface Props {
		/** Section number, e.g. "11.2". */
		number: string;
		/** Section title, e.g. "Translasi". */
		title: string;
		/** One-line summary shown under the title. */
		description: string;
		/** The Section's route; omit while the Section has no page yet. */
		href?: string;
		/** Headings the Section covers, listed under the summary. */
		outline?: string[];
		/** Small label for an unlinked card, e.g. "Coming soon". */
		badge?: string;
	}

	let { number, title, description, href, outline = [], badge }: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class="ink-card block space-y-1 p-6 {href ? '' : 'opacity-80'}"
>
	<span class="flex items-center justify-between gap-3">
		<span class="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-sm font-semibold"
			>{number}</span
		>
		{#if !href && badge}
			<span class="badge badge-ghost badge-sm">{badge}</span>
		{/if}
	</span>
	<span class="font-display block text-xl font-bold">{title}</span>
	<span class="block opacity-70">{description}</span>
	{#if outline.length > 0}
		<ul class="mt-3 list-disc space-y-1 pl-5 text-sm opacity-80">
			{#each outline as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
	{/if}
</svelte:element>
