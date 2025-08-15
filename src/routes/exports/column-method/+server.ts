import ColumnMethod from '$lib/server/ColumnMethod';
import { pdfResponse } from '$lib/utils/pdfResponse';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const operation = url.searchParams.get('operation') ?? 'addition';
	const difficulty = url.searchParams.get('difficulty') ?? 'easy';
	const number_of_pages = Number(url.searchParams.get('nop') ?? '1');
	const fileName = `Column Method - ${operation} - ${difficulty} - ${number_of_pages} question pages.pdf`
	
	const doc = new ColumnMethod(operation, difficulty, number_of_pages);
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
