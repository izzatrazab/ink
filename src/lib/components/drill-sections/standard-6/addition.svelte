<script lang="ts">
	import { base } from '$app/paths';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';
	const formAction = `${base}/exports/primary-school/standard-6/addition`;
</script>

<div>
	<h1 class="text-4xl font-bold">Penambahan</h1>
	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<p class="flex-1 text-xl">Latih tubi penambahan bagi darjah 6.</p>
		<div class="card bg-base-100 mx-auto shadow-sm" style="width:300px;">
			<form action={formAction} method="GET" id="form" target="_blank" class="card-body">
				<h2 class="card-title text-wrap">Jana Latih Tubi</h2>
				<NumberOfPagesInput name="nop" />
				<div class="card-actions mt-4 justify-center">
					<button class="btn btn-primary btn-block" type="submit" aria-label="Jana">Jana</button>
				</div>
			</form>
		</div>
	</article>
</div>
