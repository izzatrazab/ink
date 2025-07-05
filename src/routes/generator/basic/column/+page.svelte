<script>
	import { base } from '$app/paths';
	import DrillForm from '$lib/components/forms/DrillForm.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';

	const formAction = `${base}/exports/column-method`;
</script>

<div>
	<h1 class="text-4xl font-bold">Bentuk Lazim</h1>

	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<p class="flex-1 text-xl">
			Bentuk Lazim adalah satu kaedah untuk melakukan pengiraan.
			<br />
			Setiap digit akan disusun mengikut nilai digit secara menegak.
			<br />
			Kaedah ini boleh digunakan untuk melakukan proses penambahan, penolakan, dan pendaraban.
		</p>

		<DrillForm action={formAction} id="column-method-form">
			<fieldset class="fieldset">
				<label class="fieldset-legend" for="operation">Operasi</label>
				<select
					class="select"
					name="operation"
					placeholder="Select operation"
					aria-label="Select operation"
				>
					<option selected value="addition">Tambah</option>
					<option value="subtraction">Tolak</option>
					<option value="multiplication">Darab</option>
				</select>
			</fieldset>
			<fieldset class="fieldset">
				<label class="fieldset-legend" for="difficulty">Tahap Kesukaran</label>
				<select
					class="select"
					name="difficulty"
					placeholder="Select difficulty"
					aria-label="Select difficulty"
				>
					<option selected value="easy">Mudah</option>
					<option value="medium">Sederhana</option>
					<option value="hard">Sukar</option>
				</select>
			</fieldset>

			<NumberOfPagesInput name="nop" />
		</DrillForm>
	</article>
</div>
