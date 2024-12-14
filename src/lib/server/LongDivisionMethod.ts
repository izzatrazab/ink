
// import fontChilankaRegular from '$lib/assets/fonts/Chilanka-Regular.ttf';
import PDFKit from 'pdfkit';
// import { join } from 'path';
import { addHeader } from '$lib/server/drillvendor';

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
        addHeader(this, this.x, this.y, this.origin_x)
    }
}