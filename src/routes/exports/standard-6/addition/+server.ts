import Standard6Addition from '$lib/server/exports/standard-6/Addition';
import { pdfResponse } from '$lib/utils/pdfResponse';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const number_of_pages = Number(url.searchParams.get('nop') || 1);
	const fileName = `Standard 6 Addition - ${number_of_pages} pg.pdf`;

	const doc = new Standard6Addition(number_of_pages);
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
