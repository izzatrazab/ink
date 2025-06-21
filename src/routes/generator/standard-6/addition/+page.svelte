<script lang="ts">
	import { base } from '$app/paths';

	const formAction = `${base}/exports/primary-school/standard-6/addition`;
</script>

<div>
	<hgroup>
		<h1>Addition</h1>
		<p>--</p>
	</hgroup>
	<article>
		<header>Generate</header>
		<form action={formAction} method="GET" id="form" target="_blank">
			<fieldset>
				<label for="nop">
					Number of Pages
					<input
						type="number"
						name="nop"
						required
						placeholder="Provide number of pages"
						aria-label="Number of pages"
						min="1"
						list="fibonacci"
						value="1"
					/>
				</label>
				<datalist id="fibonacci">
					<option value="1"></option>
					<option value="2"></option>
					<option value="3"></option>
					<option value="5"></option>
					<option value="8"></option>
				</datalist>
			</fieldset>
		</form>
		<footer>
			<button type="submit" form="form" aria-label="Generate"> Generate Drill </button>
		</footer>
	</article>
</div>
