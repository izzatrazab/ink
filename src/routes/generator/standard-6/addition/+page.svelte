<script lang="ts">
	import { base } from '$app/paths';
	import UnderConstruction from '$lib/components/alert/UnderConstruction.svelte';

	const formAction = `${base}/exports/primary-school/standard-6/addition`;
</script>

<div>
	<h1 class="text-4xl font-bold">Penambahan</h1>
	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<p class="flex-1 text-xl">Latih tubi penambahan bagi darjah 6.</p>
		<div class="card bg-base-100 mx-auto" style="width:300px;">
			<form action={formAction} method="GET" id="form" target="_blank" class="card-body">
				<h2 class="card-title text-wrap">Jana Latih Tubi</h2>
				<fieldset class="fieldset">
					<label for="nop" class="fieldset-legend">Bilangan Muka Surat Soalan</label>
					<input
						type="number"
						name="nop"
						class="input"
						required
						placeholder="Provide number of pages"
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
					<button class="btn btn-primary btn-block" type="submit" aria-label="Jana">Jana</button>
				</div>
			</form>
		</div>
	</article>
</div>
