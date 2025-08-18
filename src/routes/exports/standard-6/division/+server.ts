import Standard6Division from '$lib/server/exports/standard-6/Division';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const number_of_pages = Number(url.searchParams.get('nop') || 1);
	const doc = new Standard6Division(number_of_pages);
	const fileName = `Standard 6 Division - ${number_of_pages} pg.pdf`;
	return doc.response(fileName);
};
