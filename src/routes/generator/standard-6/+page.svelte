<script>
	import { resolve } from '$app/paths';
	import DrillForm from '$lib/components/forms/DrillForm.svelte';

	const formActions = [
		{
			title: 'Penambahan',
			action: resolve('/exports/standard-6/addition')
		},
		{
			title: 'Penolakan',
			action: resolve('/exports/standard-6/subtraction')
		},
		{
			title: 'Pendaraban',
			action: resolve('/exports/standard-6/multiplication')
		},
		{
			title: 'Pembahagian',
			action: resolve('/exports/standard-6/division')
		}
	];

</script>

<svelte:head>
	<title>Tahun 6</title>
</svelte:head>

<h1 class="text-3xl font-bold">Koleksi Latih Tubi Tahun 6</h1>

<div class="mt-16">
	<ul class="list bg-base-100 rounded-box shadow-md">
		<!-- <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Tahun 6</li> -->
		{#each formActions as { title, action }, i}
			<li class="list-row">
				<div class="text-2xl">{i + 1})</div>
				<div>
					<hgroup>
						<h2 class="text-2xl">{title}</h2>
					</hgroup>
				</div>

				<div class="list-col-grow">
					<DrillForm {action} />
				</div>
			</li>
		{/each}
	</ul>
</div>
