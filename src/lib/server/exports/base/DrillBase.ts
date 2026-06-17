import { addHeader, displayCartoonImage, drawAnimalImage, drawColumnForm, drawOrangeBorder } from '$lib/utils/draw';
import PDFDocument from 'pdfkit';
import imgStar8 from '$lib/assets/stars/star-8.png';
import imgStar9 from '$lib/assets/stars/star-9.png';
import imgStar10 from '$lib/assets/stars/star-10.png';
import fontDynaPuffVariable from '$lib/assets/fonts/DynaPuff-VariableFont.ttf';
import fontArial from '$lib/assets/fonts/Arial.ttf';
import type { Question } from '$lib/questions/evaluate';
import { pdfResponse } from '$lib/utils/pdfResponse';
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
		/** X offset of the first question from the content origin. */
		questionOriginX: number;
		/** Y offset of the first question from the current Y. */
		questionOriginY: number;
	} = {
		row: 12,
		column: 1,
		rowHeight: 0,
		columnWidth: 0,
		questionOriginX: 30,
		questionOriginY: 30
	};
	public header: { withPicture: boolean } = {
		withPicture: false
	};

	/** the Questions this drill renders; the answer sheet is read from here */
	protected questions: Question[] = [];
	/** for question numbers */
	public counter: number = 0;
	public title = {
		eng: '',
		ms: ''
	};

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
		let formatted_answers = this.questions.map((q) => q.answer.toLocaleString());

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

	/**
	 * Produce the Worksheet from this Drill's Generator: fill one Question per
	 * grid cell across every page, render the question pages and answer sheet,
	 * then number the pages. Call once, after configuring layout/title/header.
	 * @param generate the Drill's Generator (e.g. generateAddition)
	 */
	protected produceWorksheet(generate: () => Question) {
		const total = this.layout.row * this.layout.column * this.num_page;
		this.questions = Array.from({ length: total }, generate);

		this.generate();
		this.generatePageNumbers();
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
		let x: number = this.origin_x + this.layout.questionOriginX;

		// y origin point of the first box
		let y: number = this.y + this.layout.questionOriginY;

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
	 * Draw one Question in inline form: `n)  a + b = `. The counterpart to
	 * drawColumnMethod for the inline presentation; renders the Question's own
	 * operands and operator on a single line.
	 * @param x coordinate x
	 * @param y coordinate y
	 * @param question the Question to render
	 * @param questionNumber the 1-based number shown before the equation
	 */
	public drawInlineForm(x: number, y: number, question: Question, questionNumber: number) {
		const formatted = question.operands.map((n) => n.toLocaleString());
		const question_string = formatted.join(` ${question.operator} `) + ' = ';

		this.fontSize(16)
			.text(`${questionNumber})  `, x, y, {
				continued: true
			})
			.text(question_string, {
				wordSpacing: 5,
				characterSpacing: 2
			});
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
		// Inline/column drills never render multi-digit multiplication, so no
		// middle line — see drawColumnForm and ADR-0004.
		drawColumnForm(this, x, y, num1, num2, operation, width, questionNumber, { padding });
	}

	public response(fileName: string) {
		return pdfResponse(this, fileName);
	}

	// ACCESSOR METHODS

	public get trueWidth(): number {
		return this.page.width - this.page.margins.left - this.page.margins.right;
	}
}
