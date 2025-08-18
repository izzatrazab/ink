import Standard6Addition from '$lib/server/exports/standard-6/Addition';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const number_of_pages = Number(url.searchParams.get('nop') || 1);
	const fileName = `Standard 6 Addition - ${number_of_pages} pg.pdf`;
	const doc = new Standard6Addition(number_of_pages);
	return doc.response(fileName);
};
