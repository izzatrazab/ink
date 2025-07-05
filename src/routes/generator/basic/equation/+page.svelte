<script>
	import { base } from '$app/paths';
	import UnderConstruction from '$lib/components/alert/UnderConstruction.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';
	const formAction = `${base}/exports/equation`;
</script>

<div>
	<h1 class="text-4xl font-bold">Equation Problems</h1>
	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<p class="flex-1 text-xl">Simple equation problems</p>
		<div class="card bg-base-100 mx-auto shadow-sm" style="width: 300px;">
			<form
				action={formAction}
				method="GET"
				id="generate-equation-drill"
				target="_blank"
				class="card-body"
			>
				<h2 class="card-title text-wrap">Jana Latih Tubi</h2>
				<fieldset class="fieldset">
					<label for="operation" class="fieldset-legend">Operasi</label>
					<select
						name="operation"
						class="select"
						placeholder="Select operation"
						aria-label="Select operation"
					>
						<option selected value="addition">Tambah</option>
						<option value="subtraction">Tolak</option>
						<option value="multiplication">Darab</option>
					</select>
				</fieldset>
				<fieldset class="fieldset">
					<label for="difficulty" class="fieldset-legend">Tahap Kesukaran</label>
					<select
						name="difficulty"
						class="select"
						placeholder="Pilih Tahap Kesukaran"
						aria-label="Select difficulty"
					>
						<option value="easy" selected>Mudah</option>
						<option value="medium">Sederhana</option>
						<option value="hard">Sukar</option>
					</select>
				</fieldset>

				<NumberOfPagesInput name="nop" />

				<div class="card-actions mt-4 justify-center">
					<button class="btn btn-primary btn-block" type="submit" aria-label="Jana">
						Jana
					</button>
				</div>
			</form>
		</div>
	</article>
</div>
