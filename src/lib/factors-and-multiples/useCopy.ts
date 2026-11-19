// Chapter 2's binding of the Chapter copy module: components call `useCopy()`
// once and read `c.t`. Kept apart from copy.ts so the copy table (and the pure
// narration that reads it) stays free of the reader store.

import { chapterCopy } from '$lib/chapterCopy.svelte';
import { copy } from './copy';

export const useCopy = () => chapterCopy('factors-and-multiples', copy);
