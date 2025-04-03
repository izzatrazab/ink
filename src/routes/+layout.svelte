<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import plusMinusSvg from '$lib/assets/plus-minus.svg';
	import Moon from '$lib/components/icons/phosphor/Moon.svelte';
	import Sun from '$lib/components/icons/phosphor/Sun.svelte';
	import Github from '$lib/components/icons/Github.svelte';

	let { children } = $props();
	let darkMode = $state(true);

	onMount(() => {
		// Set theme on mount
		let prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
		let theme = localStorage.getItem('theme') || (prefersDarkScheme ? 'dark' : 'light');
		document.documentElement.setAttribute('data-theme', theme);
		if (theme == 'dark') darkMode = true;
		else darkMode = false;
	});

	function toggleTheme() {
		const newTheme =
			document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		darkMode = !darkMode;
	}
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href={plusMinusSvg} />
</svelte:head>

<nav class="container" style="padding: .25rem 2rem .25rem 2rem;">
	<ul>
		<li>
			<a href="{base}/">
				<strong style="font-size: 2.5rem;"> InK </strong>
			</a>
		</li>
	</ul>
	<ul>
		<li>
			<button onclick={toggleTheme} class="contrast outline" style="border: none; ">
				{#if darkMode}
					<Moon class="icon" />
				{:else}
					<Sun class="icon" />
				{/if}
			</button>
		</li>
		<li>
			<a href="https://github.com/izzatrazab/math-drill-generator" target="_blank" class="contrast">
				<Github class="icon" />
			</a>
		</li>
	</ul>
</nav>
<main style="display: flex; align-items: center; justify-content: center;">
	{@render children()}
</main>
