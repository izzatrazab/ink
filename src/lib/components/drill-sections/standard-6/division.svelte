<script lang="ts">
	import { base } from '$app/paths';
	import DrillForm from '$lib/components/forms/DrillForm.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';
	import DrillSection from '$lib/components/layouts/DrillSection.svelte';
	const formAction = `${base}/exports/primary-school/standard-6/division`;
</script>

<div>
	<DrillSection heading="Pembahagian">
		{#snippet main()}
			<DrillForm action={formAction} id="standard-6-division-form">
				<NumberOfPagesInput name="nop" />
			</DrillForm>
		{/snippet}
		{#snippet info()}
			<p class="text-lg">Latih tubi pembahagian.</p>
		{/snippet}
	</DrillSection>
</div>
