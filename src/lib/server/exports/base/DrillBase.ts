import { displayStarImages, drawOrangeBorder } from '$lib/server/drillvendor';
import PDFDocument from 'pdfkit';
import imgStar8 from '$lib/assets/stars/star-8.png';
import imgStar9 from '$lib/assets/stars/star-9.png';
import imgStar10 from '$lib/assets/stars/star-10.png';
import { join } from 'path';

export interface DrillLayout {
	row: number;
	column: number;
	rowHeight: number;
	columnWidth: number;
}

export class DrillBase extends PDFDocument {
	/**
	 * The number of pages in the document.
	 */
	public num_page: number = 0;

	/**
	 * The X coordinate after applying the left margin.
	 */
	public origin_x: number = 0;

	/**
	 * The Y coordinate after applying the top margin.
	 */
	public origin_y: number = 0;

	/**
	 * The total number of questions.
	 * */
	public total_questions: number = 0;

	constructor(
		info: {
			Producer?: string;
			Creator?: string;
			CreationDate?: Date;
			Title?: string;
			Author?: string;
			Subject?: string;
			Keywords?: string;
			ModDate?: Date;
		},
		bufferPages?: boolean
	) {
		super({
			size: 'A4',
			margins: {
				top: 50,
				left: 50,
				bottom: 50, // to allow page number
				right: 50
			},
			info,
			bufferPages
		});
	}

	drawBorder({ x = 0, y = 0 }: { x?: number; y?: number } = {}) {
		this.strokeColor('orange').lineWidth(2);

		let width = this.getContentWidth();
		let height = this.page.height - 50 - y;
		let radius = 8;

		this.roundedRect(x, y, width, height, radius).stroke();

		let star_size = 30;
		let y_gap = 40;

		let start_3_y = this.page.height - this.page.margins.bottom - star_size;
		this.image(
			join(process.cwd(), imgStar8),
			this.page.width - (this.page.margins.right * 7) / 8,
			start_3_y - y_gap * 3,
			{ align: 'right', width: star_size }
		);
		this.image(
			join(process.cwd(), imgStar9),
			this.page.width - (this.page.margins.right * 7) / 8,
			start_3_y - y_gap * 2,
			{ align: 'right', width: star_size }
		);
		this.image(
			join(process.cwd(), imgStar10),
			this.page.width - (this.page.margins.right * 7) / 8,
			start_3_y - y_gap,
			{ align: 'right', width: star_size }
		);

		return this;
	}

	/**
	 * @returns width of page minus left and right margins
	 */
	getContentWidth() {
		return this.page.width - this.page.margins.left - this.page.margins.right;
	}

	/**
	 *
	 * @returns height of page minus top and bottom margins
	 */
	getContentHeight() {
		return this.page.height - this.page.margins.top - 50;
	}
}
