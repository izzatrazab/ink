<script>
	import DrillForm from '$lib/components/forms/DrillForm.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';

	import { base } from '$app/paths';
	import DownloadSimple from '$lib/components/icons/phosphor/DownloadSimple.svelte';

	// import Addition from "$lib/components/drill-sections/standard-6/addition.svelte";
	// import Division from "$lib/components/drill-sections/standard-6/division.svelte";
	// import Multiplication from "$lib/components/drill-sections/standard-6/multiplication.svelte";
	// import Subtraction from "$lib/components/drill-sections/standard-6/subtraction.svelte";

	const formAction = `${base}/exports/primary-school/standard-1/addition`;
</script>

<svelte:head>
	<title>Tahun 1</title>
</svelte:head>

<h1 class="text-3xl font-bold">Tahun 1</h1>
<div class="mt-16">
	<ul class="list bg-base-100 rounded-box shadow-md">
		<li class="p-4 pb-2 text-lg tracking-wide opacity-60">Koleksi Latih Tubi</li>

		<li class="list-row">
			<div class="text-2xl">1)</div>
			<div>
				<hgroup>
					<h2 class="text-2xl">Penambahan</h2>
					<!-- <p class="text-base font-semibold uppercase opacity-60">test</p> -->
				</hgroup>
			</div>
			<div class="list-col-grow">
				<form action={formAction} class="flex flex-row justify-end gap-2" target="_blank">
					<fieldset class="max-w-[200px] flex-1 text-right">
						<input
							type="number"
							class="input"
							placeholder="Muka Surat"
							min="1"
							max="10"
							title="Must be between be 1 to 10"
							name="nop"
						/>
					</fieldset>
					<!-- <NumberOfPagesInput name="nop" /> -->
					<button class="btn btn-square p-1" aria-label="muat turun" title="muat turun">
						<!-- test -->
						<DownloadSimple class="w-100 h-100" />
					</button>
				</form>
			</div>
		</li>
	</ul>
</div>
