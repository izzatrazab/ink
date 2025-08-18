import Standard6Multiplication from '$lib/server/exports/standard-6/Multiplication';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {

    const number_of_pages = Number(url.searchParams.get('nop') || 1);
    const doc = new Standard6Multiplication(number_of_pages);
    const fileName = `Standard 6 Multiplication - ${number_of_pages} pg.pdf`;
    return doc.response(fileName);
};
