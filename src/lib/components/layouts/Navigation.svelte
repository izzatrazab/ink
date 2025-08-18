<script lang="ts">
	import { page } from '$app/state';

	const navigations = [
		{
			name: 'Pengenalan',
			url: '/generator'
		},
		{
			name: 'Asas',
			child: [
				{
					name: 'Bentuk Lazim',
					url: '/generator/basic/column'
				},
				{
					name: 'Pembahagian Panjang',
					url: '/generator/basic/long-division'
				}
			]
		},
		{
			name: 'Tahun 1',
			url: '/generator/standard-1'
		},
		{
			name: 'Tahun 6',
			url: '/generator/standard-6'
		}
	];
</script>

<aside style="width: 250px;">
	<nav>
		<ul class="menu menu-lg w-full">
			{#each navigations as navigation}
				<li>
					{#if 'child' in navigation && Array.isArray(navigation.child)}
						<details open>
							<summary>{navigation.name}</summary>
							<ul>
								{#each navigation.child ?? [] as child}
									<li>
										<a href={child.url} class:menu-active={page.url.pathname.endsWith(child.url)}>
											{child.name}
										</a>
									</li>
								{/each}
							</ul>
						</details>
					{:else}
						<a
							href={navigation.url}
							class:menu-active={typeof navigation.url === 'string'
								? page.url.pathname.endsWith(navigation.url)
								: false}
						>
							{navigation.name}
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
</aside>
