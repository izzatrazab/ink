import { generateRandomNumber } from '$lib/helper';
import ColumnMethod from '$lib/server/ColumnMethod';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const doc = new ColumnMethod();

	let buffers: any[] = [];

	// Collect data as the PDF is being generated
	doc.on('data', (chunk) => buffers.push(chunk));

	/** start add content to the PDF */

	const origin_x = doc.origin_x;
	const origin_y = doc.y;

	let tempCMW: number = doc.layout.columnWidth - 10; // temporary column method width
	let counter = 0;

	// calculate x shift
	let x_shift: number = (doc.layout.columnWidth - tempCMW) / 2;

	for (let index = 0; index < 5; index++) {
		for (let j = 0; j < 5; j++) {
			/** start generating random questions */
			let firstNumDigit = 3; // for now 3 (boleh tukar samada 1/2/3)
			let secondNumDigit = 3; // for now 3 (boleh tukar samada 1/2/3)

			var firstNum = 0;
			var secondNum = 0;

			do {
				// to ensure that the first number is bigger than the second number
				firstNum = generateRandomNumber(firstNumDigit);
				secondNum = generateRandomNumber(firstNumDigit);
			} while (firstNum <= secondNum);

			doc.array_num_1.push(firstNum);
			doc.array_num_2.push(secondNum);

			/** end of generating random questions */

			doc.drawColumnMethod(
				origin_x + x_shift + j * doc.layout.columnWidth,
				origin_y + index * doc.layout.rowHeight,
				doc.array_num_1[counter],
				doc.array_num_2[counter],
				'+',
				tempCMW,
				++counter
			);
		}
	}

	//new page (Answer Sheet)
	doc.font('Chilanka');
	doc
		.addPage({ size: 'A4' })
		.text('Answer Sheet', {
			align: 'left'
		})
		.underline(72, 80, 76, 5)
		.fontSize(9)
		.fillColor('grey')
		.text('Kertas Jawapan', 72, 88);

	doc.font('Helvetica').fontSize(12).fillColor('black');

	counter = 0; // reset counter to zero
	// answerSheet = true;

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

	for (let index = 0; index < 5; index++) {
		for (let j = 0; j < 5; j++) {
			doc.printAnswers(
				origin_x + x_shift + j * doc.layout.columnWidth,
				origin_y + index * (doc.layout.rowHeight - 70) - 90,
				doc.array_num_1[counter],
				doc.array_num_2[counter],
				'+',
				tempCMW,
				++counter
			);
		}
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
