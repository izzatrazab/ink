import LongDivisionMethod from '$lib/server/LongDivisionMethod';
import { pdfResponse } from '$lib/utils/pdfResponse';

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	
	const difficulty = url.searchParams.get('difficulty') ?? 'easy';
	const has_remainder = url.searchParams.get('remainder') ?? 'false';
	const number_of_pages = Number(url.searchParams.get('nop') ?? '1');
	const fileName = `Long Division Method - ${((has_remainder == 'true') ? 'has remainder' : 'no remainder')} - ${difficulty} - ${number_of_pages} question pages.pdf`


	const doc = new LongDivisionMethod(difficulty, number_of_pages, (has_remainder === 'true'));
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
