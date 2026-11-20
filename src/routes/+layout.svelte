<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import plusMinusSvg from '$lib/assets/plus-minus.svg';
	import Moon from '$lib/components/icons/phosphor/Moon.svelte';
	import Sun from '$lib/components/icons/phosphor/Sun.svelte';
	import Github from '$lib/components/icons/Github.svelte';
	import { reader } from '$lib/language.svelte';

	let { children } = $props();
	let darkMode = $state(true);

	onMount(() => {
		reader.load();
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

<div
	class="navbar bg-base-100/90 border-base-300 sticky top-0 z-10 border-b px-4 backdrop-blur sm:px-8"
>
	<div class="flex-1">
		<a class="font-display text-primary text-4xl font-bold tracking-tight" href={resolve('/')}
			>InK</a
		>
	</div>
	<div class="flex flex-row gap-x-4">
		<button
			class="swap swap-rotate size-11"
			onclick={toggleTheme}
			aria-label={darkMode
				? 'Switch to light theme / Tukar ke tema cerah'
				: 'Switch to dark theme / Tukar ke tema gelap'}
		>
			<!-- this hidden checkbox controls the state -->
			<input type="checkbox" bind:checked={darkMode} />

			<!-- sun icon -->
			<div class="swap-off">
				<Sun class="h-8 w-8" />
			</div>

			<!-- moon icon -->
			<div class="swap-on">
				<Moon class="h-8 w-8" />
			</div>
		</button>

		<a
			href="https://github.com/izzatrazab/math-drill-generator"
			target="_blank"
			rel="noopener noreferrer"
			class="contrast flex size-11 items-center justify-center"
			aria-label="GitHub (opens in a new tab)"
		>
			<Github class="h-8 w-8" />
		</a>
	</div>
</div>
<main class="w-full" style="display: flex; align-items: center; justify-content: center;">
	{@render children()}
</main>
