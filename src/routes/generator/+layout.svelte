<script lang="ts">
	// import '../app.css';
	import { page } from '$app/stores';
	import List from '$lib/components/icons/phosphor/List.svelte';
	import { nonpassive } from 'svelte/legacy';
	let { children } = $props();

	// prepare breadcrumb
	let navs: string[] = $page.url.pathname.split('/').filter(Boolean).slice(1);

	let navigationIsOpen = $state(false);

	function closeNavDialog() {
		navigationIsOpen = false;
	}

	function openNavDialog() {
		navigationIsOpen = true;
	}
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
		}

		.mobile-nav-button {
			display: flex;
			align-items: center;
			padding: 0;
			border: none;
		}
	</style>
</svelte:head>
<div class="container" style="width: 100%;">
	<!-- <aside  class="hidden md:block md:w-[25%]" style="padding-left:2rem;">
		<nav class="ink-nav">
			<li>
				<a href="/generator">Pengenalan</a>
			</li>
			<li>
				<details>
					<summary>Asas</summary>
					<ul>
						<li><a href="/generator/basic/column">Kaedah Kolumn</a></li>
						<li><a href="/generator/basic/long-division">Long Division</a></li>
					</ul>
				</details>
			</li>
		</nav>
	</aside> -->
	<nav class="mobile-nav">
		<button onclick={openNavDialog} class="mobile-nav-button outline">
			<List class="icon" />
		</button>
		<nav aria-label="breadcrumb">
			<ul>
				{#each navs as nav}
					<li>{nav}</li>
				{:else}
					<li>Pengenalan</li>
				{/each}
			</ul>
		</nav>
	</nav>
	<div>
		{@render children()}
	</div>
	<dialog 
	open={navigationIsOpen}
	>
		<article>
			<header class="flex justify-between" style="display: flex; justify-content:space-between; align-items:center;">
				<strong style="height: fit-content;">Navigasi</strong>
				<button aria-label="Close" onclick={closeNavDialog} class="outline" style="border: none;">
					&cross;
				</button>
			</header>
			<aside>
				<nav class="ink-nav">
					<li>
						<a href="/generator">Pengenalan</a>
					</li>
					<li>
						<details>
							<summary>Asas</summary>
							<ul>
								<li><a href="/generator/basic/column"> Kaedah Kolumn</a></li>
								<li><a href="/generator/basic/long-division">Long Division</a></li>
							</ul>
						</details>
					</li>
				</nav>
			</aside>
		</article>
	</dialog>
</div>
