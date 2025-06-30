<script>
	import { base } from '$app/paths';

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
		<div class="card bg-base-100 mx-auto w-[300px] shadow-sm">
			<form
				action={formAction}
				method="GET"
				id="generate-column-method-drill"
				target="_blank"
				class="card-body"
			>
				<h2 class="card-title">Jana Latih Tubi Bentuk Lazim</h2>
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
				<div class="card-actions mt-4">
					<button
						class="btn btn-primary btn-block"
						type="submit"
						form="generate-column-method-drill"
						aria-label="Generate"
					>
						Jana
					</button>
				</div>
			</form>
		</div>
	</article>
</div>
