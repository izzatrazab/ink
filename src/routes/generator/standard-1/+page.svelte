<script lang="ts">
	import DrillForm from '$lib/components/forms/DrillForm.svelte';
	import { resolve } from '$app/paths';

	const formActions = [
		{
			title: 'Penambahan',
			type: 'addition'
		},
		{
			title: 'Penambahan Bentuk Lazim',
			type: 'addition-standard-form'
		}
	];

	function action(type: string): string {
		return resolve('/exports/standard-one/[type]', { type });
	}
</script>

<svelte:head>
	<title>Tahun 1</title>
</svelte:head>

<h1 class="text-3xl font-bold">Koleksi Latih Tubi Tahun 1</h1>
<div class="mt-16">
	<ul class="list bg-base-100 rounded-box shadow-md">
		{#each formActions as { title, type }, i}
			<li class="list-row">
				<div class="text-2xl whitespace-nowrap">
					{i + 1})
				</div>
				<div class="list-col-grow">
					<div class="flex flex-col gap-y-2 sm:flex-row justify-between">
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
