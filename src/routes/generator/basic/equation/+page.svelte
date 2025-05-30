<script>
	import { base } from '$app/paths';
	const formAction = `${base}/exports/equation`
</script>

<div>
	<hgroup>
		<h1>Equation Problems</h1>
		<p>Simple equation problems</p>
	</hgroup>
	<article>
		<header>Generate Equation Drills</header>
		<form
			action="{formAction}"
			method="GET"
			id="generate-equation-drill"
			target="_blank"
		>
			<fieldset class="grid">
				<label for="operation"
					>Operation
					<select name="operation" placeholder="Select operation" aria-label="Select operation">
						<option selected value="addition">Addition</option>
						<option value="subtraction">Subtraction</option>
						<option value="multiplication">Multiplication</option>
					</select>
				</label>
				<label for="difficulty">
					Difficulty
					<select name="difficulty" placeholder="Select difficulty" aria-label="Select difficulty">
						<option selected value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
				</label>
			</fieldset>
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
			<button type="submit" form="generate-equation-drill" aria-label="Generate">
				Generate Drill
			</button>
		</footer>
	</article>
</div>
