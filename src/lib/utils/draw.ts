import fontChilankaRegular from '$lib/assets/fonts/Chilanka-Regular.ttf';
import fontDynaPuffVariable from '$lib/assets/fonts/DynaPuff-VariableFont.ttf';
import imgStar8 from '$lib/assets/stars/star-8.png';
import imgStar9 from '$lib/assets/stars/star-9.png';
import imgStar10 from '$lib/assets/stars/star-10.png';

import { join } from 'path';

/** add header in the page. header includes name field (top left) and marks field (top right) */
export function addHeader(
	PDFKit: PDFKit.PDFDocument,
	x: number,
	y: number,
	origin_x: number,
	total_marks: number = 16
) {
	PDFKit.registerFont('Chilanka', join(process.cwd(), fontChilankaRegular));
	PDFKit.font('Chilanka')
		.fontSize(14)
		.text('Name: ___________________________________________________', { align: 'left' });
	PDFKit.fontSize(9).fillColor('grey').text('Nama:');

	PDFKit.font('Chilanka')
		.fontSize(14)
		.fillColor('black')
		.text(`Marks: _______/${total_marks}`, x, y, { align: 'right' });

	PDFKit.fontSize(9)
		.fillColor('grey')
		.text('Markah:', 445, y + 15.5);

	PDFKit.font('Chilanka').fontSize(14).fillColor('black');

	// Reset the value of x
	PDFKit.x = origin_x;

	PDFKit.moveDown(1);
}

/** sini kene explain function */
export function displayCartoonImage(
	PDFKit: PDFKit.PDFDocument,
	x: number,
	y: number,
	difficulty: string,
	height: number = 90
) {
	let allImagesPath: any;

	switch (difficulty) {
		default:
		case 'easy':
			allImagesPath = import.meta.glob('/src/lib/assets/animals/easy/*.png', { eager: true });
			break;
		case 'medium':
			allImagesPath = import.meta.glob('/src/lib/assets/animals/medium/*.png', { eager: true });
			break;
		case 'hard':
			allImagesPath = import.meta.glob('/src/lib/assets/animals/hard/*.png', { eager: true });
			break;
	}

	const imagePaths = Object.keys(allImagesPath);
	const randomIndex = Math.floor(Math.random() * imagePaths.length);
	const selectedImagePath = imagePaths[randomIndex];
	const module = allImagesPath[selectedImagePath];

	const imagePath = join(process.cwd(), module.default as string);

	PDFKit.image(imagePath, x, y, {
		align: 'right',
		height
	});
}

/**
 * draw animal images
 */
export function drawAnimalImage(
	PDFKit: PDFKit.PDFDocument,
	x: number,
	y: number,
	height: number = 90,
	width: number = 90
) {
	let allImagesPath: any;
	let paths: any;

	switch (Math.floor(Math.random() * 3)) {
		default:
		case 0:
			paths = import.meta.glob('/src/lib/assets/animals/easy/*.png', { eager: true });
			break;
		case 1:
			paths = import.meta.glob('/src/lib/assets/animals/medium/*.png', { eager: true });
			break;
		case 2:
			paths = import.meta.glob('/src/lib/assets/animals/hard/*.png', { eager: true });
			break;
	}

	const imagePaths = Object.keys(paths);
	const randomIndex = Math.floor(Math.random() * imagePaths.length);
	const selectedImagePath = imagePaths[randomIndex];
	const module = paths[selectedImagePath];

	const imagePath = join(process.cwd(), module.default as string);

	PDFKit.image(imagePath, x, y, {
		// align: 'right',
		height,
		width,
		fit: [width, 50]
	});
}

export function addTitleBox(
	PDFKit: PDFKit.PDFDocument,
	x: number,
	y: number,
	width: number,
	height: number,
	eng_title: string,
	malay_title: string
) {
	const halfHeight = height / 2;

	PDFKit.strokeColor('#737373').lineWidth(2);
	PDFKit.rect(x, y, width, height).stroke();

	PDFKit.registerFont('DynaPuff', join(process.cwd(), fontDynaPuffVariable)).font('DynaPuff');

	PDFKit.fontSize(14)
		.fillColor('#2acf90')
		.text(eng_title, x, y + halfHeight - 3, {
			align: 'center',
			baseline: 'bottom'
		});

	PDFKit.fontSize(11)
		.fillColor('grey')
		.text(malay_title, x, y + halfHeight + 3, {
			align: 'center',
			baseline: 'top'
		});
}

export function addInstruction(
	PDFKit: PDFKit.PDFDocument,
	x: number,
	y: number,
	instruction: string,
	translation: string
) {
	PDFKit.registerFont('Chilanka', join(process.cwd(), fontChilankaRegular));
	PDFKit.font('Chilanka');
	PDFKit.fontSize(14).fillColor('black').text(instruction, x, y, { align: 'center' });
	PDFKit.fontSize(10).fillColor('grey').text(translation, PDFKit.x, PDFKit.y, { align: 'center' });
}

export function drawOrangeBorder(
	PDFKit: PDFKit.PDFDocument,
	x: number,
	y: number,
	content_width: number,
	content_height: number
) {
	//	Draw an orange rounded rectangle
	//	Set the stroke color and line width for the border
	PDFKit.strokeColor('orange').lineWidth(2);

	const padding = 8;
	const rect_x_coordinate = x - padding / 2; // shift to the left half of the padding to add the x-padding
	const rect_y_coordinate = PDFKit.y - padding / 2; // shift to the top half of the padding to add the y-padding
	const rect_width = content_width + padding; // add padding length to the width
	const rect_height = content_height - (PDFKit.y - y) + padding; // add padding length to the height
	const radius = 10;

	PDFKit.roundedRect(
		rect_x_coordinate,
		rect_y_coordinate,
		rect_width,
		rect_height,
		radius
	).stroke();

	// Reset the stroke color and line width
	PDFKit.strokeColor('black').lineWidth(1);
}

/**
 * Draw one Question in Column form: operands stacked for column arithmetic,
 * the operator glyph to the left, and the rule lines for working and answer.
 *
 * The glyph is passed in rather than read from a Question on purpose — the
 * displayed symbol is a rendering choice that can differ from the Question's
 * operator (e.g. the `−` minus glyph vs the `-` operator). See ADR-0004.
 *
 * @param middleLineGap when set, draws an extra rule line this many `moveDown`
 *   units below the first — used by multi-digit multiplication. Omit it (the
 *   default) for single-line column problems.
 */
export function drawColumnForm(
	PDFKit: PDFKit.PDFDocument,
	x: number,
	y: number,
	num1: number,
	num2: number,
	glyph: string,
	width: number,
	questionNumber: number,
	{ padding = 3, middleLineGap }: { padding?: number; middleLineGap?: number } = {}
) {
	const content_width = width - padding - padding;
	const content_x = x + padding;
	const content_y = y + padding;
	const characterSpacing = 8;
	const fontSize = 14;
	const operationSymbolSize = 18;

	// Draw question number
	PDFKit.fontSize(fontSize - 2).text(questionNumber.toString() + ')', content_x, content_y, {
		width: width,
		align: 'left'
	});

	// Draw first number
	PDFKit.fontSize(fontSize).text(num1.toString(), content_x, content_y + 15, {
		width: content_width - 5,
		align: 'right',
		characterSpacing: characterSpacing
	});

	// Draw operation sign
	PDFKit.fontSize(operationSymbolSize).text(glyph, content_x + 20, content_y + 30, {
		width: content_width,
		align: 'left'
	});

	// Draw second number
	PDFKit.fontSize(fontSize).text(num2.toString(), content_x, content_y + 30, {
		width: content_width - 5,
		align: 'right',
		characterSpacing: characterSpacing
	});

	// Draw lines for calculation and answer space
	const start_line_x = content_x + 15;
	const end_line_x = content_x + content_width;

	PDFKit.strokeColor('black').lineWidth(0.5);
	// Draw first line
	PDFKit.moveTo(start_line_x, PDFKit.y).lineTo(end_line_x, PDFKit.y).stroke();

	// Draw middle line (multiplication adds one when the second number has >1 digit)
	if (middleLineGap != null) {
		PDFKit.moveDown(middleLineGap);
		PDFKit.moveTo(start_line_x, PDFKit.y).lineTo(end_line_x, PDFKit.y).stroke();
	}

	// answer gap and draw last line
	PDFKit.moveDown(1.5);
	PDFKit.moveTo(start_line_x, PDFKit.y).lineTo(end_line_x, PDFKit.y).stroke();
}

export function displayStarImages(PDFKit: PDFKit.PDFDocument, star_size: number, y_gap: number) {
	// let y_gap = 40;
	const start_3_y = PDFKit.page.height - PDFKit.page.margins.bottom - star_size;
	PDFKit.image(
		join(process.cwd(), imgStar8),
		PDFKit.page.width - (PDFKit.page.margins.right * 7) / 8,
		start_3_y - y_gap * 3,
		{ align: 'right', width: star_size }
	);
	PDFKit.image(
		join(process.cwd(), imgStar9),
		PDFKit.page.width - (PDFKit.page.margins.right * 7) / 8,
		start_3_y - y_gap * 2,
		{ align: 'right', width: star_size }
	);
	PDFKit.image(
		join(process.cwd(), imgStar10),
		PDFKit.page.width - (PDFKit.page.margins.right * 7) / 8,
		start_3_y - y_gap,
		{ align: 'right', width: star_size }
	);
}
