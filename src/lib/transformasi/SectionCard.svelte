<script lang="ts">
	// A chapter-landing card linking to one Section. It reads through the same
	// number / title / description vocabulary as <LessonShell>'s header, so a
	// Section is described one way across the landing and the lesson page.
	interface Props {
		/** Section number, e.g. "11.2". */
		number: string;
		/** Section title, e.g. "Translasi". */
		title: string;
		/** One-line summary shown under the title. */
		description: string;
		/** The Section's route. */
		href: string;
	}

	let { number, title, description, href }: Props = $props();
</script>

<a {href} class="card bg-base-200 hover:bg-base-300 block p-5 transition-colors">
	<span class="text-primary text-sm font-semibold">{number}</span>
	<span class="block text-lg font-bold">{title}</span>
	<span class="block opacity-70">{description}</span>
</a>
