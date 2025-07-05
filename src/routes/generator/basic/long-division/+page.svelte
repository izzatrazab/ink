<script>
	import { base } from '$app/paths';
	import UnderConstruction from '$lib/components/alert/UnderConstruction.svelte';
	import DrillForm from '$lib/components/forms/DrillForm.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';

	const formAction = `${base}/exports/long-division-method`;
</script>

<div>
	<h1 class="text-4xl font-bold">Pembahagian Panjang</h1>
	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<p class="flex-1 text-xl">
			Pembahagian Panjang adalah suatu kaedah pembahagian dimana nombor yang dibahagi akan
			dihuraikan kepada langkah-langkah yang lebih kecil.
		</p>

		<DrillForm action={formAction} id="long-division">
			<fieldset class="fieldset">
				<label for="remainder" class="fieldset-legend">Ada Baki</label>
				<input type="checkbox" class="checkbox" name="remainder" value="true" checked />
			</fieldset>

			<fieldset class="fieldset">
				<label for="difficulty" class="fieldset-legend">Tahap Kesukaran</label>
				<select
					name="difficulty"
					class="select"
					placeholder="Pilih Tahan Kesukaran"
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
