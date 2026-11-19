<script lang="ts">
	import { chapterHref, chapterLabel, chaptersByForm } from '$lib/chapters';
	import { reader } from '$lib/language.svelte';
</script>

<svelte:head>
	<title>InK — Matematik</title>
	<meta name="description" content="Pelajaran Matematik KSSM yang interaktif, bab demi bab." />
</svelte:head>

<div class="container mx-auto max-w-2xl space-y-10 px-8 py-16">
	<hgroup class="space-y-2">
		<h1 class="ink-linear-gradient text-5xl font-bold">Matematik KSSM</h1>
		<p class="opacity-80">Pilih bab untuk mula belajar.</p>
	</hgroup>

	{#each chaptersByForm() as group (group.form)}
		<section class="space-y-3" aria-label="Form {group.form}">
			<h2 class="text-sm font-semibold tracking-wide uppercase opacity-60">
				Form {group.form} · Tingkatan {group.form}
			</h2>
			<ul class="space-y-3">
				{#each group.chapters as base (base.slug)}
					{@const chapter = reader.view(base)}
					<li>
						<a
							href={chapterHref(chapter)}
							class="card bg-base-200 hover:bg-base-300 block p-5 transition-colors"
						>
							<span class="text-primary text-sm font-semibold">{chapterLabel(chapter)}</span>
							<span class="block text-lg font-bold">{chapter.title}</span>
							<span class="block opacity-70">{chapter.description}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
