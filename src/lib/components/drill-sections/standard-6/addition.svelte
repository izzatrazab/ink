<script lang="ts">
	import { resolve } from '$app/paths';
	import DrillForm from '$lib/components/forms/DrillFormOld.svelte';
	import NumberOfPagesInput from '$lib/components/forms/inputs/NumberOfPagesInput.svelte';
	import DrillSection from '$lib/components/layouts/DrillSection.svelte';
	const formAction = resolve('/exports/standard-6/addition');
</script>

<div>
	<DrillSection heading="Penambahan">
		{#snippet main()}
			<DrillForm action={formAction} id="standard-6-addition-form">
				<NumberOfPagesInput name="nop" />
			</DrillForm>
		{/snippet}
		{#snippet info()}
			<p class="text-lg">Latih tubi penambahan.</p>
		{/snippet}
	</DrillSection>
</div>
