import { addHeader, displayCartoonImage, drawAnimalImage, drawOrangeBorder } from '$lib/utils/draw';
import PDFDocument from 'pdfkit';
import imgStar8 from '$lib/assets/stars/star-8.png';
import imgStar9 from '$lib/assets/stars/star-9.png';
import imgStar10 from '$lib/assets/stars/star-10.png';
import fontDynaPuffVariable from '$lib/assets/fonts/DynaPuff-VariableFont.ttf';
import fontArial from '$lib/assets/fonts/Arial.ttf';
import { join } from 'path';

export class DrillBase extends PDFDocument {
	/** The number of pages in the document. */
	public num_page: number = 0;
	/** The X coordinate after applying the left margin. */
	public origin_x: number = 0;
	/** The Y coordinate after applying the top margin. */
	public origin_y: number = 0;
	/** The total number of questions. */
	public total_questions: number = 0;
	/** question layout */
	public layout: {
		row: number;
		column: number;
		rowHeight: number;
		columnWidth: number;
		cellPadding: number;
	} = {
		row: 12,
		column: 1,
		rowHeight: 0,
		columnWidth: 0,
		cellPadding: 30
	};
	public header: { withPicture: boolean } = {
		withPicture: false
	};

	/** store answers */
	public answers: Array<number> = [];
	/** for question numbers */
	public counter: number = 0;
	public title = {
		eng: '',
		ms: ''
	};
	public buffers: any[] = [];

	constructor(info: {
		Producer?: string;
		Creator?: string;
		CreationDate?: Date;
		Title?: string;
		Author?: string;
		Subject?: string;
		Keywords?: string;
		ModDate?: Date;
	}) {
		super({
			size: 'A4',
			margins: {
				top: 50,
				left: 50,
				bottom: 50, // to allow page number
				right: 50
			},
			info,
			bufferPages: true
		});
		this.origin_x = this.x;

		// collect data as the PDF is being generated
		this.on('data', (chunk) => this.buffers.push(chunk));

		this.registerFont('Arial', join(process.cwd(), fontArial));
		this.registerFont('DynaPuff', join(process.cwd(), fontDynaPuffVariable));
	}

	addHeader() {
		addHeader(
			this,
			this.x,
			this.y,
			this.origin_x,
			this.layout.row * this.layout.column * this.num_page
		);

		if (this.header.withPicture) {
			drawAnimalImage(this,this.origin_x + (this.trueWidth/9), this.y-10, 90, 90);
			drawAnimalImage(this,this.origin_x + (this.trueWidth * 7/9), this.y-10, 90, 90);
			// drawAnimalImage(this,this.origin_x, this.y, 90, 90);
			// displayCartoonImage(this, this.x, this.y - 13, 'easy', 60, this.page.width - this.page.margins.left - this.page.margins.right);
			// displayCartoonImage(this, this.x, this.y - 13, 'easy', 60, this.page.width - this.page.margins.left - this.page.margins.right);
			this.font('DynaPuff').fontSize(14).fillColor('#2acf90').text(this.title.eng, this.x, this.y, {
				align: 'center'
				// baseline: 'bottom'
			});
			this.fontSize(11).fillColor('grey').text(`  ${this.title.ms}`, this.x, this.y, {
				align: 'center'
				// baseline: 'top'
			});
			this.moveDown(1);
		} else {
			this.registerFont('DynaPuff', join(process.cwd(), fontDynaPuffVariable)).font('DynaPuff');

			this.fontSize(16).fillColor('#982cc9').text(this.title.eng, this.x, this.y, {
				continued: true,
				baseline: 'middle'
			});

			this.fontSize(11).fillColor('grey').text(`  ${this.title.ms}`, this.x, this.y, {
				baseline: 'middle'
			});
		}
	}

	public addTitle() {
		displayCartoonImage(this, this.x, this.y - 13, 'easy', 70);
		this.font('DynaPuff')
			.fontSize(14)
			.fillColor('#2acf90')
			.text('test', this.x + 120, this.y, {
				align: 'center',
				baseline: 'bottom'
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

	initDrillLayout() {
		let padding = 10;
		this.layout.columnWidth = (this.getContentWidth() - padding * 2) / this.layout.column;
		let remaining_available_height =
			this.page.height - this.y - this.page.margins.bottom - padding * 2;
		this.layout.rowHeight = remaining_available_height / this.layout.row;
	}

	drawAnswers() {
		this.font('Chilanka')
			.fontSize(14)
			.text('Answer Sheet', {
				align: 'left'
			})
			.fontSize(9)
			.fillColor('grey')
			.text('Kertas Jawapan');

		//reset font and font color
		this.font('Arial').fontSize(12).fillColor('black').moveDown(1);
		let formatted_answers = this.answers.map((answer) => answer.toLocaleString());

		this.moveDown(1);

		let string = formatted_answers.map(function (value, index) {
			return index + 1 + ')  ' + value;
		});

		let final = string.reduce((result, item) => (result += item + '\n'), '');

		this.text(final, {
			columns: 3,
			columnGap: 15,
			align: 'justify',
			wordSpacing: 5,
			characterSpacing: 1,
			lineGap: 20
		});
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

	public generatePageNumbers() {
		// see the range of buffered pages
		const range = this.bufferedPageRange(); // => { start: 0, count: 2 }

		for (let index = range.start; index < range.count; index++) {
			this.switchToPage(index);

			this.text(`p. ${index + 1}/${range.count}`, this.origin_x, this.page.margins.top / 2, {
				align: 'right',
				baseline: 'top'
			});
		}
	}

	public generate() {
		this.addHeader();
		this.moveDown(0.5);
		for (let index = 0; index < this.num_page; index++) {
			this.drawBorder({ x: this.origin_x, y: this.y });
			this.initDrillLayout();
			this.drawAllQuestions();
			this.addPage();
		}
		this.drawAnswers();
	}

	public drawAllQuestions() {
		// x origin point of the first box
		let x: number = this.origin_x + this.cellPadding;

		// y origin point of the first box
		let y: number = this.y + this.cellPadding;

		this.font('Arial').fillColor('black');

		for (let index = 0; index < this.layout.row; index++) {
			for (let j = 0; j < this.layout.column; j++) {
				let x_point = x + j * this.layout.columnWidth;
				let y_point = y + index * this.layout.rowHeight;

				this.drawQuestion(x_point, y_point);
			}	
		}
	}

	/**
	 * overwrite this method to draw question specifically for each drill
	 * Remember, for one question only. This function will be called multiple times in drawAllQuestions()
	 * @param x coordinate x
	 * @param y coordinate y
	 */
	public drawQuestion(x: number, y: number): void {
		console.log('Please overwrite this method to draw question specifically for each drill');
		
	}

	/**
	 * @param x coordinate x
	 * @param y coordinate y
	 * @param num1 first number in the equation
	 * @param num2 second number in the equation
	 * @param operation the operation symbol (+, -, x)
	 * @param width width of the column method (box ??, ibarat mcm kotak).
	 */
	public drawColumnMethod(
		x: number,
		y: number,
		num1: number,
		num2: number,
		operation: string,
		width: number,
		questionNumber: number,
		padding: number = 3
	) {
		const content_width = width - padding - padding;
		const content_x = x + padding;
		const content_y = y + padding;
		const characterSpacing = 8;
		const fontSize = 14;
		const operationSymbolSize = 18;

		// Draw question number
		this.fontSize(fontSize - 2).text(questionNumber.toString() + ')', content_x, content_y, {
			width: width,
			align: 'left'
		});

		// Draw first number
		this.fontSize(fontSize).text(num1.toString(), content_x, content_y + 15, {
			width: content_width - 5,
			align: 'right',
			characterSpacing: characterSpacing
		});

		// Draw operation sign
		this.fontSize(operationSymbolSize).text(operation, content_x + 20, content_y + 30, {
			width: content_width,
			align: 'left'
		});

		// Draw second number
		this.fontSize(fontSize).text(num2.toString(), content_x, content_y + 30, {
			width: content_width - 5,
			align: 'right',
			characterSpacing: characterSpacing
		});

		// Draw lines for calculation and answer space
		const start_line_x = content_x + 15;
		const end_line_x = content_x + content_width;

		this.strokeColor('black').lineWidth(0.5);
		// Draw first line
		this.moveTo(start_line_x, this.y).lineTo(end_line_x, this.y).stroke();

		// // Draw middle line (for multiplication, it has additional middle line if second number has more than 1 digit)
		// if (this.operation_method_eng === 'multiplication' && this.second_number_of_digits > 1) {
		// 	this.moveDown(this.second_number_of_digits * 1.25);
		// 	this.moveTo(start_line_x, this.y).lineTo(end_line_x, this.y).stroke();
		// }

		// answer gap and draw last line
		this.moveDown(1.5);
		this.moveTo(start_line_x, this.y).lineTo(end_line_x, this.y).stroke();
	}

	public async response(fileName: string) {
		await new Promise((resolve) => {
			this.on('end', resolve);
			this.end();
		});

		const pdfData = Buffer.concat(this.buffers);

		// Return the PDF as a response
		return new Response(pdfData, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'inline; filename="' + fileName + '"' // open in new tab
				// 'Content-Disposition': 'attachment' // direct download
			}
		});
	}

	// ACCESSOR METHODS

	public get cellPadding(): number {
		return this.layout.cellPadding;
	}

	public get trueWidth(): number {
		return this.page.width - this.page.margins.left - this.page.margins.right;
	}
}
