<script lang="ts">
	import ChapterLanding from '$lib/transformasi/ChapterLanding.svelte';
	import { getChapter } from '$lib/chapters';
</script>

<ChapterLanding chapter={getChapter('transformasi-isometri')} />
