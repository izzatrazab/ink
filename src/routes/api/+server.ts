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
	const page_content_width = doc.page.width - doc.page.margins.left - doc.page.margins.right
	const page_content_height = doc.page.height - doc.page.margins.top - doc.page.margins.bottom
	let tempX:number = origin_x;
	let tempY:number = origin_y;


	const column = 5; // for now 5
	/**
	 * @var column_width - width of each column
	 */
	const column_width = page_content_width/column; // each column width

	const row = 5; // for now 5
	/**
	 * @var row_height width of each column
	 */
	const row_height = page_content_height/row; // each column width

	let tempCMW:number = column_width - 10; // temporary column method width
	for (let index = 0; index < 5; index++) {

	// calculate x shift
	let x_shift:number = ( column_width - tempCMW ) / 2;

	drawColumnMethod(doc, origin_x + x_shift, 				 origin_y + index*row_height, 999, 111, '+', tempCMW);
	drawColumnMethod(doc, origin_x + x_shift + 1*column_width, origin_y + index*row_height, 999, 111, '+', tempCMW);
	drawColumnMethod(doc, origin_x + x_shift + 2*column_width, origin_y + index*row_height, 999, 111, '+', tempCMW); 
	drawColumnMethod(doc, origin_x + x_shift + 3*column_width, origin_y + index*row_height, 999, 119, '+', tempCMW);
	drawColumnMethod(doc, origin_x + x_shift + 4*column_width, origin_y + index*row_height, 999, 111, '+', tempCMW);

	}

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

function drawColumnMethod(
	doc: typeof PDFDocument,
	x: number,
	y: number,
	num1: number,
	num2: number,
	operation: string,
	width: number,
	padding: number = 5,
) {
	const content_width = width - padding - padding;
	const content_x = x + padding;
	const content_y = y + padding;

	// Draw first number
	doc.text(num1.toString(), content_x, content_y, {
		width: content_width,
		align: 'right'
	});
	 
	// Draw operation sign
	doc.text(operation, content_x, content_y + 15, {
		width: content_width,
		align: 'left'
	});

	// Draw second number
	doc.text(num2.toString(), content_x, content_y + 15, {
		width: content_width,
		align: 'right'
	});

	// Draw line
	const lineY = content_y + 35;

	doc.rect(x, y, width, 70) // temporary

	doc
		.moveTo(content_x, lineY)
		.lineTo(content_x + content_width, lineY)
		.stroke();

	doc
		.moveTo(content_x, lineY + 20)
		.lineTo(content_x + content_width, lineY + 20)
		.stroke();

	// Calculate and write the answer
	// const result = operation === '+' ? num1 + num2 : num1 - num2;
	// doc.text(result.toString(), x+30, lineY + 10);
	console.dir(lineY);
	
}
