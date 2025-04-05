
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
			<details>
				<summary>Asas</summary>
				<ul>
					<li>
						<a href="/generator/basic/column" class="contrast">
							Kaedah Kolumn</a
						>
					</li>
					<li><a href="/generator/basic/long-division" class="contrast">Long Division</a></li>
				</ul>
			</details>
		</li>
	</nav>
</aside>
