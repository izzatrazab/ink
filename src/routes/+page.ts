import { redirect } from '@sveltejs/kit';

// The chapter is the new front door (ADR-0008). The old drill generator hero
// is retired here; the generator itself stays reachable at /generator.
export function load() {
	redirect(307, '/transformasi-isometri');
}
