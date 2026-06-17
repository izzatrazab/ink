<script lang="ts">
	import SectionCard from '$lib/transformasi/SectionCard.svelte';
</script>

<svelte:head>
	<title>Transformasi Isometri</title>
	<meta name="description" content="Bab 11: Transformasi Isometri — pelajaran interaktif." />
</svelte:head>

<div class="container mx-auto max-w-2xl px-8 py-16 space-y-10">
	<hgroup class="space-y-2">
		<p class="text-sm font-semibold tracking-wide uppercase opacity-60">Bab 11</p>
		<h1 class="ink-linear-gradient text-5xl font-bold">Transformasi Isometri</h1>
		<p class="opacity-80">
			Belajar bagaimana sesuatu objek berubah kedudukan, orientasi, atau saiz — dan apa yang kekal
			sama apabila ia berubah.
		</p>
	</hgroup>

	<nav aria-label="Senarai bahagian">
		<ul class="space-y-3">
			<li>
				<SectionCard
					number="11.1"
					title="Transformasi dan Kekongruenan"
					description="Apa itu transformasi, objek dan imej, serta maksud kekongruenan."
					href="/transformasi-isometri/11-1"
				/>
			</li>
			<li>
				<SectionCard
					number="11.2"
					title="Translasi"
					description="Bagaimana setiap titik beralih anjakan (a, b) yang sama, mengekalkan bentuk, saiz, dan orientasi."
					href="/transformasi-isometri/11-2"
				/>
			</li>
		</ul>
	</nav>
</div>
