import ColumnMethod from '$lib/server/ColumnMethod';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const doc = new ColumnMethod('-');

	let buffers: any[] = [];

	// Collect data as the PDF is being generated
	doc.on('data', (chunk) => buffers.push(chunk));

	/** start add content to the PDF */

	let tempCMW: number = doc.layout.columnWidth - 10; // temporary column method width

	// calculate x shift
	let x_shift: number = (doc.layout.columnWidth - tempCMW) / 2;

	//new page (Answer Sheet)
	doc.font('Chilanka');
	doc
		.addPage()
		.text('Answer Sheet', {
			align: 'left',
			underline: true
		})
		.fontSize(9)
		.fillColor('grey')
		.text('Kertas Jawapan');
	doc.moveDown(1);
	doc.font('Helvetica').fontSize(12).fillColor('black');

	let counter = 0;

	// Set the stroke color and line width for the border
	doc.strokeColor('orange').lineWidth(3);

	// Draw a rounded rectangle
	const xAxis = 60;
	const yAxis = 109;
	const widthRect = 475;
	// const heightRect = origin_y + row * (doc.layout.rowHeight - 70) - 200;
	const heightRect = 665;
	const radius = 10;
	
	doc.roundedRect(xAxis, yAxis, widthRect, heightRect, radius).stroke();
	doc.y = yAxis + 10;
	for (let index = 0; index < 5; index++) {
		let y = doc.y;
		for (let j = 0; j < 5; j++) {
			doc.printAnswers(
				doc.origin_x + x_shift + j * doc.layout.columnWidth,
				y,
				doc.array_num_1[counter],
				doc.array_num_2[counter],
				'-',
				tempCMW,
				++counter
			);
		}
		doc.moveDown(2);
	}

	/** end add content to the PDF */

	// Return a promise that resolves when the PDF is fully generated
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
