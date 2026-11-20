<script lang="ts">
	import LessonShell from '$lib/transformasi/LessonShell.svelte';
	import CompareLadders from '$lib/factors-and-multiples/CompareLadders.svelte';
	import Rich from '$lib/factors-and-multiples/Rich.svelte';
	import { useCopy } from '$lib/factors-and-multiples/useCopy';

	const copy = useCopy();
	const t = $derived(copy.t);
</script>

<LessonShell
	chapter="factors-and-multiples"
	number="2.3"
	description={t.meta.desc23}
	prev={{ href: '/factors-and-multiples/2-2', label: t.nav.prev23 }}
>
	<!-- Beat 1 — Same numbers, two questions -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.introHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s23.intro} /></p>
	</section>

	<!-- Beat 2 — The differences at a glance -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.tableHeading}</h2>
		<div class="overflow-x-auto">
			<table class="table-zebra table min-w-lg">
				<thead>
					<tr>
						<th scope="col"><span class="sr-only">{t.s23.tableHeading}</span></th>
						<th scope="col" class="text-primary text-base">{t.ladder.hcf}</th>
						<th scope="col" class="text-secondary text-base">{t.ladder.lcm}</th>
					</tr>
				</thead>
				<tbody>
					{#each t.s23.rows as row (row.aspect)}
						<tr>
							<th scope="row" class="font-semibold">{row.aspect}</th>
							<td><Rich text={row.hcf} /></td>
							<td><Rich text={row.lcm} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Beat 3 — The two ladders side by side (Explorable) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.ladderHeading}</h2>
		<p class="leading-relaxed"><Rich text={t.s23.ladderIntro} /></p>
		<CompareLadders
			custom
			presets={[
				[12, 18],
				[36, 60, 72],
				[8, 9]
			]}
		/>
	</section>

	<!-- Beat 4 — Which one do I need? -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">{t.s23.cluesHeading}</h2>
		<p class="leading-relaxed">{t.s23.cluesIntro}</p>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="border-primary/50 space-y-2 rounded-2xl border-2 p-4">
				<h3 class="text-primary font-bold">{t.s23.hcfClue.title}</h3>
				<p>{t.s23.hcfClue.problem}</p>
				<p class="font-semibold"><Rich text={t.s23.hcfClue.answer} /></p>
			</div>
			<div class="border-secondary/50 space-y-2 rounded-2xl border-2 p-4">
				<h3 class="text-secondary font-bold">{t.s23.lcmClue.title}</h3>
				<p>{t.s23.lcmClue.problem}</p>
				<p class="font-semibold"><Rich text={t.s23.lcmClue.answer} /></p>
			</div>
		</div>
	</section>
</LessonShell>
