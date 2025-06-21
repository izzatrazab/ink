<script lang="ts">
	const navigations = [
		{
			name: 'Basic',
			child: [
				{
					name: 'Kolum',
					url: '/generator/basic/column'
				},
				{
					name: 'Long Division',
					url: '/generator/basic/long-division'
				},
				{
					name: 'Equation',
					url: '/generator/basic/equation'
				}
			]
		},
		{
			name: 'Standard 6',
			child: [
				{
					name: 'Addition',
					url: '/generator/standard-6/addition'
				}
			]
		}
	];
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
	<nav class="ink-nav">
		<li>
			<a href="/generator" class="contrast">Pengenalan</a>
		</li>
		<li>
			{#each navigations as navigation}
				<details>
					<summary>{navigation['name']}</summary>
					<ul>
						{#each navigation['child'] as child}
							<li>
								<a href="{child['url']}" class="contrast">{child['name']}</a>
							</li>
						{/each}
					</ul>
				</details>
			{/each}
		</li>
	</nav>
</aside>
