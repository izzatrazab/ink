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
		},
		{
			name: 'Tahun 6',
			child: [
				{
					name: 'Penambahan',
					url: '/generator/standard-6/addition'
				}
			]
		}
	];
	// let current_url = page.url.pathname;
	
</script>

<svelte:head>
	<style>
		.ink-nav {
			li {
				a {
					font-weight: bolder;
				}
				a:hover {
					text-decoration: var(--pico-text-decoration);
				}

				details {
					summary {
						font-weight: bolder;
					}

					ul {
						li {
							border: none;
							border-color: var(--pico-secondary-focus);
							color: var(--pico-muted-color);

							a {
								font-weight: normal;
							}

							a:hover {
								text-decoration: var(--pico-text-decoration);
								text-decoration-color: var(--pico-secondary-hover-underline);
							}
						}
						li:hover {
							border-width: 0 0 0 1px;
							border-style: solid;
							border-color: var(--pico-secondary);
							color: var(--pico-color);
						}
					}
				}
			}
		}
	</style>
</svelte:head>

<aside style="width: 100%;">
	<nav>
		<ul class="menu menu-lg bg-base-300 rounded-box w-56">
			<li class='menu-focus'>
				<a href="/generator" class:menu-active="{page.url.pathname.endsWith('/generator')}">Pengenalan</a>
			</li>
			<li>
				{#each navigations as navigation}
				<details open>
					<summary>{navigation['name']}</summary>
					<ul>
						{#each navigation['child'] as child}
							<li>
								<a href={child['url']} class:menu-active="{page.url.pathname.endsWith(child['url'])}">{child['name']}</a>
							</li>
						{/each}
					</ul>
				</details>
			{/each}
			</li>
		</ul>
	</nav>
</aside>
