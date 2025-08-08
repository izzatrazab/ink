import Standard6Addition from '$lib/server/exports/standard-6/Addition';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	
	const number_of_pages = Number(url.searchParams.get('nop') || 1);
	
	const doc = new Standard6Addition(number_of_pages);
	let buffers: any[] = [];

	// Collect data as the PDF is being generated
	doc.on('data', (chunk) => buffers.push(chunk));

	// Return a promise that resolves when the PDF is fully generated
	await new Promise((resolve) => {
		doc.on('end', resolve);
		doc.end();
	});

	// Concatenate all the chunks into a single buffer
	const pdfData = Buffer.concat(buffers);
	const fileName = `Standard 6 Addition - ${number_of_pages} pg.pdf`

	// Return the PDF as a response
	return new Response(pdfData, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline ; filename="' + fileName + '"' // open in page
			// 'Content-Disposition': 'attachment' // direct download
		}
	});
};
