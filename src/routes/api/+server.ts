import PDFDocument from 'pdfkit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	// const min = Number(url.searchParams.get('min') ?? '0');
	// const max = Number(url.searchParams.get('max') ?? '1');
	const doc = new PDFDocument({ size: 'A4' });
	/**
	 * size: 'A4',
	 * width: 595.28, height: 841.89, (izzat x tahu metric dia pakai apa, dan value ni dah include margin)
	 * default margin: margins: { top: 72, left: 72, bottom: 72, right: 72 },
	 */

	let buffers: any[] = [];

	// Collect data as the PDF is being generated
	doc.on('data', (chunk) => buffers.push(chunk));

	// console.dir(doc.page);

	/** start add content to the PDF */
	// here is where we need to RnD

	const origin_x = 72;
	const origin_y = 72

	let tempX:number = origin_x;
	let tempY:number = origin_x;


	drawColumnAddition(doc, tempX, origin_y, 999, 111, '+',  50);
	drawColumnAddition(doc, tempX += 60,  origin_y, 999, 111, '+', 50);
	drawColumnAddition(doc, tempX += 60, origin_y, 999, 111, '+', 50); 
	drawColumnAddition(doc, tempX += 60, origin_y, 999, 111, '+', 50);
	drawColumnAddition(doc, tempX += 60, origin_y, 999, 111, '+', 50);

	/** end add content to the PDF */

	// Return a Promise that resolves when the PDF is fully generated
	await new Promise((resolve) => {
		doc.on('end', resolve);
		doc.end();
	});

	// Concatenate all the chunks into a single buffer
	const pdfData = Buffer.concat(buffers);

	// Return the PDF as a response
	return new Response(pdfData, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline' // open in page
			// 'Content-Disposition': 'attachment' // direct download
		}
	});
};

/**
 * 
 * @param doc PDFDocument
 * @param x coordinate x
 * @param y coordinate y
 * @param num1 first number in the equation
 * @param num2 second number in the equation
 * @param operation the operation symbol (+, -, x)
 * @param width width of the column method (box ??, ibarat mcm kotak).
 */

function drawColumnAddition(
	doc: typeof PDFDocument,
	x: number,
	y: number,
	num1: number,
	num2: number,
	operation: string,
	width: number,
) {

	// Draw first number
	doc.text(num1.toString(), x, y, {
		width: width,
		align: 'right'
	});
	// Draw operation sign
	doc.text(operation, x, y + 20, {
		width: width,
		align: 'left'
	});
	// Draw second number
	doc.text(num2.toString(), x, y + 20, {
		width: width,
		align: 'right'
	});

	// Draw line
	const lineY = y + 35;
	doc
		.moveTo(x, lineY)
		.lineTo(x + width, lineY)
		.stroke();
	doc
		.moveTo(x, lineY + 20)
		.lineTo(x + 50, lineY + 20)
		.stroke();

	// Calculate and write the answer
	// const result = operation === '+' ? num1 + num2 : num1 - num2;
	// doc.text(result.toString(), x+30, lineY + 10);
	console.dir(y);
	
}
