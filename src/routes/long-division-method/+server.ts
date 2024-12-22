import LongDivisionMethod from '$lib/server/LongDivisionMethod';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	
	const difficulty = url.searchParams.get('difficulty') ?? 'easy';
	const number_of_pages = Number(url.searchParams.get('nop') ?? '1');

	const doc = new LongDivisionMethod(difficulty, number_of_pages);
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
	const fileName = `Long Division Method - ${number_of_pages} question pages.pdf`

	// Return the PDF as a response
	return new Response(pdfData, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline ; filename="' + fileName + '"' // open in page
			// 'Content-Disposition': 'attachment' // direct download
		}
	});
};
