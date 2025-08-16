<script lang="ts">
	import { onMount } from 'svelte';
	import DownloadSimple from '../icons/phosphor/DownloadSimple.svelte';

	let {
		action = '#',
		id = '',
	}: {
		action: string;
		id?: string;
	} = $props();

	const uid = $props.id();
	
	onMount(() => {
		id = `${uid}-${id}`;
	});

</script>

<form {action} method="GET" {id} class="flex flex-row justify-end gap-2" target="_blank">
	<fieldset class="max-w-[200px] flex-1 text-right">
		<input
			type="number"
			class="input"
			placeholder="Muka Surat"
			min="1"
			max="10"
			title="Must be between be 1 to 10"
			name="nop"
		/>
	</fieldset>
	<!-- <NumberOfPagesInput name="nop" /> -->
	<button class="btn btn-square p-1" aria-label="muat turun" title="muat turun">
		<DownloadSimple class="w-100" />
	</button>
</form>
