<script lang="ts">
	// import '../app.css';
	let { children } = $props();
</script>
<svelte:head>
	<title>Generator</title>
	<meta name="description" content="math drill generator forms" />
</svelte:head>
{@render children()}
