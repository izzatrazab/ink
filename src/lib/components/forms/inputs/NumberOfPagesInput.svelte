<script lang="ts">
	type Props = {
		name: string;
		label?: string;
		placeholder?: string;
	};

	let { name, label = 'Bilangan Muka Surat Soalan', placeholder = 'Contoh: 3' }: Props = $props();
</script>

<fieldset class="fieldset">
	<label for={name} class="fieldset-legend">
		{label}
	</label>
	<input
		type="number"
		{name}
		class="input"
		required
		{placeholder}
		aria-label={label}
		min="1"
		value="1"
	/>
</fieldset>
