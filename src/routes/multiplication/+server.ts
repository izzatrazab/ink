import MathDrill from '$lib/server/MathDrill';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const doc = new MathDrill();

	let buffers: any[] = [];

	// Collect data as the PDF is being generated
	doc.on('data', (chunk) => buffers.push(chunk));

	/** start add content to the PDF */

	const origin_x = doc.origin_x;
	const origin_y = doc.y;
	const page_content_width = doc.content_width;
	const page_content_height = doc.content_height + doc.page.margins.top - origin_y;
	let tempX: number = origin_x;
	let tempY: number = origin_y;

	const column = 5; // for now 5
	/**
	 *  @var column_width - width of each column
	 */
	const column_width = page_content_width / column; // each column width

	const row = 5; // for now 5
	/**
	 * @var row_height width of each column
	 */
	const row_height = page_content_height / row; // each column width

	let tempCMW: number = column_width - 10; // temporary column method width
	let counter = 0;

	// calculate x shift
	let x_shift: number = (column_width - tempCMW) / 2;

	// To assign the random numbers generated into the arrays
	let array1: number[] = [];
	let array2: number[] = [];

	let answerSheet: boolean = false;

	for (let index = 0; index < 5; index++) {
		for (let j = 0; j < 5; j++) {
			/** start generating random questions */
			let firstNumDigit = 3; // for now 3 (boleh tukar samada 1/2/3)
			let secondNumDigit = 3; // for now 3 (boleh tukar samada 1/2/3)

			var firstNum = 0;
			var secondNum = 0;

			// options to choose the number of digit for the first number
			switch (firstNumDigit) {
				case 1:
					firstNum = randomQuestionsMethod(1, 9);
					break;
				case 2:
					firstNum = randomQuestionsMethod(10, 99);
					break;
				case 3:
					firstNum = randomQuestionsMethod(100, 999);
					break;
				default:
					break;
			}

			// options to choose the number of digit for the second number
			switch (secondNumDigit) {
				case 1:
					secondNum = randomQuestionsMethod(1, 9);
					break;
				case 2:
					secondNum = randomQuestionsMethod(10, 99);
					break;
				case 3:
					secondNum = randomQuestionsMethod(100, 999);
					break;
				default:
					break;
			}

			array1.push(firstNum);
			array2.push(secondNum);

			/** end of generating random questions */

			// var firstNum = randomQuestionsMethod(100, 999);
			// var secondNum = randomQuestionsMethod(100, 999);
			doc.drawColumnMethod(
				origin_x + x_shift + j * column_width,
				origin_y + index * row_height,
				array1[counter],
				array2[counter],
				'x',
				tempCMW,
				++counter,
				answerSheet
			);
		}
	}

	//new page (Answer Sheet)
	doc
		.addPage({ size: 'A4' })
		.text('Answer Sheet', origin_y + 5, origin_x + x_shift + 5, {
			align: 'left'
		})
		.underline(76, 90, 76, 5);
	// .registerFont('GoodDog','fonts/GoodDog.ttf')
	// .font('fonts/GoodDog.ttf');

	counter = 0; // reset counter to zero
	answerSheet = true;

	for (let index = 0; index < 5; index++) {
		for (let j = 0; j < 5; j++) {
			doc.drawColumnMethod(
				origin_x + x_shift + j * column_width,
				doc.origin_y + index * row_height + 30,
				array1[counter],
				array2[counter],
				'x',
				tempCMW,
				++counter,
				answerSheet
			);
		}
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

/**
 * @param min first number in the equation
 * @param max second number in the equation
 */

function randomQuestionsMethod(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
