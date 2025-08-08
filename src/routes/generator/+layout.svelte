<script lang="ts">
	import { page } from '$app/state';
	import List from '$lib/components/icons/phosphor/List.svelte';
	import Navigation from '$lib/components/layouts/Navigation.svelte';

	let { children } = $props();

	const navs = new Map<string, string>(
		Object.entries({
			basic: 'Asas',
			column: 'Bentuk Lazim',
			'long-division': 'Pembahagi Panjang',
			equation: 'Equation',
			'standard-6': 'Tahun 6',
			'standard-1': 'Tahun 1',
			addition: 'Penambahan'
		})
	);

	let modal: HTMLDialogElement;
</script>

<svelte:head>
	<title>Generator</title>
	<meta name="description" content="math drill generator forms" />

	<style>
		@media (min-width: 768px) {
			.generator-layout {
				display: grid;
				grid-template-columns: auto 1fr;
				column-gap: 2.5rem;
			}
		}
	</style>
</svelte:head>

<div class="generator-layout container mt-4 flex-1">
	<nav class="hidden lg:block">
		<Navigation />
	</nav>

	<div class="flex-1 px-8 pb-36">
		<div class="flex flex-row items-center">
			<button class="btn btn-ghost block lg:hidden" onclick={() => modal.showModal()}>
				<List class="icon" />
			</button>
			<div class="breadcrumbs text-sm">
				<ul>
					{#each page.url.pathname.split('/').filter(Boolean).slice(1) as key}
						<li>{navs.get(key)}</li>
					{:else}
						<li>Pengenalan</li>
					{/each}
				</ul>
			</div>
		</div>
		{@render children()}
	</div>
</div>

<!-- modal for navigation -->
<dialog class="modal grid lg:hidden" bind:this={modal}>
	<div class="modal-box w-auto">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<div class="flex w-full justify-center">
			<Navigation />
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
