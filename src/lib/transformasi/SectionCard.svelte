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
	class="card bg-base-200 block p-5 transition-colors {href ? 'hover:bg-base-300' : ''}"
>
	<span class="flex items-center justify-between gap-3">
		<span class="text-primary text-sm font-semibold">{number}</span>
		{#if !href && badge}
			<span class="badge badge-ghost badge-sm">{badge}</span>
		{/if}
	</span>
	<span class="block text-lg font-bold">{title}</span>
	<span class="block opacity-70">{description}</span>
	{#if outline.length > 0}
		<ul class="mt-3 list-disc space-y-1 pl-5 text-sm opacity-80">
			{#each outline as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
	{/if}
</svelte:element>
