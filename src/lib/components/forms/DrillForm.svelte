<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let {
		action,
		title = 'Jana Latih Tubi',
		id = '',
		children
	}: {
		action: string;
		title?: string;
		id?: string;
		children?: Snippet;
	} = $props();

	const uid = $props.id();

	onMount(() => {
		id = `${uid}-${id}`;
	});
</script>

<div class="card bg-base-200 mx-auto shadow-sm" style="width: 300px;">
	<form {action} method="GET" {id} target="_blank" class="card-body">
		<h2 class="card-title text-wrap">{title}</h2>
		<div>
			{@render children?.()}
		</div>
		<div class="card-actions mt-4 justify-center">
			<button class="btn btn-primary btn-block" type="submit" aria-label="Jana" form={id}>
				Jana
			</button>
		</div>
	</form>
</div>
