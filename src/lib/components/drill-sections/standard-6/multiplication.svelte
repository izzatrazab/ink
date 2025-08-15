<script lang="ts">
	import { resolve } from '$app/paths';
	import DrillForm from '$lib/components/forms/DrillFormOld.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';
	import DrillSection from '$lib/components/layouts/DrillSection.svelte';
	const formAction = resolve('/exports/standard-6/multiplication');
</script>

<div>
	<DrillSection heading="Pendaraban">
		{#snippet main()}
			<DrillForm action={formAction} id="standard-6-multiplication-form">
				<NumberOfPagesInput name="nop" />
			</DrillForm>
		{/snippet}
		{#snippet info()}
			<!-- <p class="text-lg">Latih tubi .</p> -->
		{/snippet}
	</DrillSection>
</div>
