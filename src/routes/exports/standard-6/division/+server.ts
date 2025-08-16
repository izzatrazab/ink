import Standard6Division from '$lib/server/exports/standard-6/Division';
import { pdfResponse } from '$lib/utils/pdfResponse';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const number_of_pages = Number(url.searchParams.get('nop') || 1);
	const doc = new Standard6Division(number_of_pages);
	const fileName = `Standard 6 Division - ${number_of_pages} pg.pdf`;

	let buffers: any[] = [];

	// Collect data as the PDF is being generated
	doc.on('data', (chunk) => buffers.push(chunk));

	// Return a promise that resolves when the PDF is fully generated
	await new Promise((resolve) => {
		doc.on('end', resolve);
		doc.end();
	});

	return pdfResponse(buffers, fileName);
};
