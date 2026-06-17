<script lang="ts">
	import { resolve } from '$app/paths';
	import DrillForm from '$lib/components/forms/DrillForm.svelte';

	const formActions = [
		{ title: 'Penambahan', type: 'addition' },
		{ title: 'Penolakan', type: 'subtraction' },
		{ title: 'Pendaraban', type: 'multiplication' },
		{ title: 'Pembahagian', type: 'division' }
	];

	function action(type: string): string {
		return resolve('/exports/standard-6/[type]', { type });
	}
</script>

<svelte:head>
	<title>Tahun 6</title>
</svelte:head>

<h1 class="text-3xl font-bold">Koleksi Latih Tubi Tahun 6</h1>

<div class="mt-16">
	<ul class="list bg-base-100 rounded-box shadow-md">
		<!-- <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Tahun 6</li> -->
		{#each formActions as { title, type }, i}
			<li class="list-row">
				<div class="text-2xl whitespace-nowrap">
					{i + 1})
				</div>
				<div class="list-col-grow">
					<div class="flex flex-col justify-between gap-y-2 sm:flex-row">
						<hgroup>
							<h2 class="text-2xl">{title}</h2>
						</hgroup>
						<DrillForm action={action(type)} />
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
