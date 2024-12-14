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
