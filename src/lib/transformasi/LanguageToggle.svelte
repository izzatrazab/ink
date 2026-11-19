<script lang="ts">
	import { languagesOf, type Chapter, type Language } from '$lib/chapters';
	import { reader } from '$lib/language.svelte';

	// A BM / EN switch for chapters that are available in both. Renders nothing for
	// a single-language chapter. The choice is the reader's, saved for every page.
	let { chapter }: { chapter: Chapter } = $props();

	const names: Record<Language, { short: string; label: string }> = {
		en: { short: 'EN', label: 'English' },
		ms: { short: 'BM', label: 'Bahasa Melayu' }
	};
	const langs = $derived(languagesOf(chapter));
	const current = $derived(reader.for(chapter));
</script>

{#if langs.length > 1}
	<div class="join" role="group" aria-label="Language / Bahasa">
		{#each langs as lang (lang)}
			<button
				class="btn btn-sm join-item min-h-10 {lang === current ? 'btn-primary' : 'btn-outline'}"
				aria-pressed={lang === current}
				aria-label={names[lang].label}
				{lang}
				onclick={() => reader.set(lang)}>{names[lang].short}</button
			>
		{/each}
	</div>
{/if}
