
import fontChilankaRegular from '$lib/assets/fonts/Chilanka-Regular.ttf';
import PDFKit from 'pdfkit';
import { join } from 'path';

export default class longDivisionMethod extends PDFKit{

	/** x coordinate after the left margin */
	public origin_x: number = 0;

    constructor(num_page: number){
        super({
			size: 'A4',
			margins: {
				top: 50,
				left: 65,
				bottom: 50,
				right: 65
			},
			info: {
				// Producer?: string;
				// Creator?: string;
				// CreationDate?: Date;
				Title: "Long Division Method"
				// Author?: string;
				// Subject?: string;
				// Keywords?: string;
				// ModDate?: Date;
			}
		});

        this.origin_x = this.x;
        this.addHeader(this.x, this.y)
    }

    	/** header includes name, and score */
	addHeader(x: number, y: number) {
		this.registerFont('Chilanka', join(process.cwd(), fontChilankaRegular));
		this.font('Chilanka')
			.fontSize(14)
			.text('Name: ___________________________________________________', { align: 'left' });
		this.fontSize(9).fillColor('grey').text('Nama:');

		this.font('Chilanka')
			.fontSize(14)
			.fillColor('black')
			.text('Marks: _______/16', x, y, { align: 'right' });
		this.fontSize(9)
			.fillColor('grey')
			.text('Markah:', 423, y + 15.5);

		this.font('Chilanka').fontSize(14).fillColor('black');

		// Reset the value of x
		this.x = this.origin_x;

		this.moveDown(1);
	}


}