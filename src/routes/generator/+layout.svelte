<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import List from '$lib/components/icons/phosphor/List.svelte';
	import Navigation from '$lib/components/layouts/Navigation.svelte';

	let { children } = $props();

	// prepare breadcrumb
	let navsKey: string[] = $state([]);
	initNavKeys();

	const navs = new Map<string, string>(
		Object.entries({
			basic: 'Asas',
			column: 'Kaedah Kolumn',
			'long-division': 'Long Division'
		})
	);

	afterNavigate(() => {
		closeNavDialog();
		initNavKeys();
	});

	let navigationIsOpen = $state(false);

	function closeNavDialog() {
		navigationIsOpen = false;
	}

	function openNavDialog() {
		navigationIsOpen = true;
	}

	function initNavKeys() {
		navsKey = page.url.pathname.split('/').filter(Boolean).slice(1);
	}

	// function navigating() {
	// 	closeNavDialog();
	// 	initNavKeys();
	// }
</script>

<svelte:head>
	<title>Generator</title>
	<meta name="description" content="math drill generator forms" />

	<style>
		.mobile-nav {
			justify-content: start;
			column-gap: 0.5rem;
		}

		@media (min-width: 768px) {
			.mobile-nav {
				display: none;
			}

			.generator-layout {
				display: flex;
				flex-direction: row;
				column-gap: 1rem;
			}

			.desktop-nav {
				min-width: 200px;
			}

			.generator-content {
				flex-grow: 1;
			}
		}

		@media (max-width: 768px) {
			.desktop-nav {
				display: none;
			}
		}

		.mobile-nav-button {
			display: flex;
			align-items: center;
			padding: 0;
			border: none;
		}
	</style>
</svelte:head>
<div class="generator-layout container" style="width: 100%;">
	<nav class="desktop-nav">
		<!-- <ink-navigation direct={navigating}></ink-navigation> -->

		<Navigation />
	</nav>
	<nav class="mobile-nav">
		<button onclick={openNavDialog} class="mobile-nav-button outline">
			<List class="icon" />
		</button>
		<nav aria-label="breadcrumb">
			<ul>
				{#each navsKey as key}
					<li>{navs.get(key)}</li>
				{:else}
					<li>Pengenalan</li>
				{/each}
			</ul>
		</nav>
	</nav>
	<div class="generator-content">
		<!-- <button onclick={initNavKeys}>test</button> -->
		{@render children()}
	</div>
</div>
<dialog open={navigationIsOpen}>
	<article>
		<header
			class="flex justify-between"
			style="display: flex; justify-content:space-between; align-items:center;"
		>
			<strong style="height: fit-content;">Navigasi</strong>
			<button aria-label="Close" onclick={closeNavDialog} class="outline" style="border: none;">
				&cross;
			</button>
		</header>
		<Navigation />
		<!-- <ink-navigation ondirect={navigating}></ink-navigation> -->
	</article>
</dialog>
