<script>
	import { base } from '$app/paths';
	import UnderConstruction from '$lib/components/alert/UnderConstruction.svelte';

	const formAction = `${base}/exports/long-division-method`;
</script>

<div>
	<h1 class="text-4xl font-bold">Pembahagian Panjang</h1>
	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<p class="flex-1 text-xl">
			Pembahagian Panjang adalah suatu kaedah pembahagian dimana nombor yang dibahagi akan
			dihuraikan kepada langkah-langkah yang lebih kecil.
		</p>

		<div class="card bg-base-100 mx-auto w-[300px]">
			<form action={formAction} method="GET" id="form" target="_blank" class="card-body">
				<h2 class="card-title text-wrap">Jana Latih Tubi Pembahagian Panjang</h2>
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

				<fieldset class="fieldset">
					<label for="remainder" class="fieldset-legend">Ada Baki</label>
					<input type="checkbox" class="checkbox" name="remainder" value="true" checked />
				</fieldset>
				<fieldset class="fieldset">
					<label class="fieldset-legend" for="nop">Bilangan Muka Surat Soalan</label>
					<input
						class="input"
						type="number"
						name="nop"
						required
						placeholder="Sila isikan bilangan muka surat soalan"
						aria-label="Number of pages"
						min="1"
						list="fibonacci"
						value="1"
					/>
					<datalist id="fibonacci">
						<option value="1"></option>
						<option value="2"></option>
						<option value="3"></option>
						<option value="5"></option>
						<option value="8"></option>
					</datalist>
				</fieldset>
				<div class="card-actions mt-4 justify-center">
					<button class="btn btn-primary btn-block" type="submit" aria-label="Generate">
						Jana
					</button>
				</div>
			</form>
		</div>
	</article>
</div>
