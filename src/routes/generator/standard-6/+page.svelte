<script>
	import Addition from "$lib/components/drill-sections/standard-6/addition.svelte";
	import Division from "$lib/components/drill-sections/standard-6/division.svelte";
	import Multiplication from "$lib/components/drill-sections/standard-6/multiplication.svelte";
	import Subtraction from "$lib/components/drill-sections/standard-6/subtraction.svelte";
</script>

<svelte:head>
	<title>Tahun 6</title>
</svelte:head>

<h1 class="font-bold text-3xl">
	Tahun 6
</h1>
<div class="space-y-24 mt-16">
	<!-- <div class="divider"></div> -->
	<Addition />
	<div class="divider"></div>
	<Subtraction />
	<div class="divider"></div>
	<Multiplication />
	<div class="divider"></div>
	<Division />
</div>


