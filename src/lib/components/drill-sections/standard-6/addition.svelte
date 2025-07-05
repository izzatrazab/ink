<script lang="ts">
	import { base } from '$app/paths';
	import DrillForm from '$lib/components/forms/DrillForm.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';
	const formAction = `${base}/exports/primary-school/standard-6/addition`;
</script>

<div>
	<h1 class="text-4xl font-bold">Penambahan</h1>
	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<p class="flex-1 text-xl">Latih tubi penambahan bagi darjah 6.</p>
		<DrillForm action={formAction} id="standard-6-addition">
			<NumberOfPagesInput name="nop" />
		</DrillForm>
	</article>
</div>
