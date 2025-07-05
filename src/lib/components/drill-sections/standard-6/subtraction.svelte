<script lang="ts">
	import { base } from '$app/paths';
	import DrillForm from '$lib/components/forms/DrillForm.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';

	const formAction = `${base}/exports/primary-school/standard-6/subtraction`;
</script>

<div>
	<h2 class="text-3xl font-bold">Penolakan</h2>
	<article class="mt-4 flex flex-col gap-8 md:flex-row-reverse">
		<p class="flex-1 text-xl">Latih tubi penolakan.</p>
		<DrillForm action={formAction} id="standard-6-subtraction-form">
			<NumberOfPagesInput name="nop" />
		</DrillForm>
	</article>
</div>
