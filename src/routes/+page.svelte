<script>
	import Pdf from '$lib/components/icons/phosphor/Pdf.svelte';
</script>

<svelte:head>
	<title>Ink</title>
	<meta name="description" content="Generate column method drills." />
</svelte:head>

<div class="container" style="padding: 2rem;">
	<section class="my-10">
		<div class="mx-auto max-w-xl text-center text-5xl font-bold">
			<h1 class="ink-linear-gradient block">Penjana Latih Tubi Matematik</h1>
			<p class="mx-auto mt-6 max-w-lg text-lg leading-normal">
				Hasilkan Latih Tubi Matematik (<Pdf class={'inline size-6'} />) dengan soalan baharu dan
				unik setiap kali dimuat turun!
			</p>
		</div>
		<a href="/generator" type="button" class='mx-auto mt-10 block w-fit rounded-full'>
			Mari Mulakan &rarr;
		</a>
	</section>
</div>
