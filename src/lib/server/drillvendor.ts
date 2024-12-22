import fontChilankaRegular from '$lib/assets/fonts/Chilanka-Regular.ttf';

import { join } from 'path';

/** add header in the page. header includes name field (top left) and marks field (top right) */
export function addHeader(PDFKit: PDFKit.PDFDocument, x: number, y: number, origin_x: number) {
	PDFKit.registerFont('Chilanka', join(process.cwd(), fontChilankaRegular));
	PDFKit.font('Chilanka')
		.fontSize(14)
		.text('Name: ___________________________________________________', { align: 'left' });
	PDFKit.fontSize(9).fillColor('grey').text('Nama:');

	PDFKit.font('Chilanka')
		.fontSize(14)
		.fillColor('black')
		.text('Marks: _______/16', x, y, { align: 'right' });
	PDFKit.fontSize(9)
		.fillColor('grey')
		.text('Markah:', 423, y + 15.5);

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
	difficulty: string
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

	let imagePath = join(process.cwd(), module.default as string);

	PDFKit.image(imagePath, x, y, {
		align: 'right',
		height: 90
	});
}

export function drawOrangeBorder(PDFKit: PDFKit.PDFDocument, x: number, y:number, content_width: number, content_height: number) {
	//	Draw an orange rounded rectangle
	//	Set the stroke color and line width for the border
	PDFKit.strokeColor('orange').lineWidth(2);

	let padding = 8;
	let rect_x_coordinate = x - padding / 2; // shift to the left half of the padding to add the x-padding
	let rect_y_coordinate = PDFKit.y - padding / 2; // shift to the top half of the padding to add the y-padding
	let rect_width = content_width + padding; // add padding length to the width
	let rect_height = content_height - (PDFKit.y - y) + padding; // add padding length to the height
	let radius = 10;

	PDFKit.roundedRect(rect_x_coordinate, rect_y_coordinate, rect_width, rect_height, radius).stroke();

	// Reset the stroke color and line width
	PDFKit.strokeColor('black').lineWidth(1);
}
