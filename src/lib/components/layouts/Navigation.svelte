<script lang="ts">
	import { page } from '$app/state';

	const navigations = [
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
				},
				{
					name: 'Equation',
					url: '/generator/basic/equation'
				}
			]
		}
	];
</script>

<aside style="width: 250px;">
	<nav>
		<ul class="menu menu-lg w-full">
			<li class="menu-focus">
				<a href="/generator" class:menu-active={page.url.pathname.endsWith('/generator')}>
					Pengenalan
				</a>
			</li>
			<li>
				{#each navigations as navigation}
					<details open>
						<summary>{navigation['name']}</summary>
						<ul>
							{#each navigation['child'] as child}
								<li>
									<a
										href={child['url']}
										class:menu-active={page.url.pathname.endsWith(child['url'])}>{child['name']}</a
									>
								</li>
							{/each}
						</ul>
					</details>
				{/each}
			</li>
			<li>
				<a
					href="/generator/standard-6"
					class:menu-active={page.url.pathname.endsWith('/standard-6')}
				>
					Tahun 6
				</a>
			</li>
		</ul>
	</nav>
</aside>
