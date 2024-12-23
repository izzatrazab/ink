import { generateRandomNumber } from '$lib/helper';
import PDFKit from 'pdfkit';
import {
	addHeader,
	addInstruction,
	addTitleBox,
	displayCartoonImage,
	displayStarImages,
	drawOrangeBorder
} from '$lib/server/drillvendor';
import { difficultyList } from '$lib/difficulty';
import fontArial from '$lib/assets/fonts/Arial.ttf';

import { join } from 'path';

interface DrillLayout {
	row: number;
	column: number;
	rowHeight: number;
	columnWidth: number;
}

export default class longDivisionMethod extends PDFKit {
	/** number of pages */
	public num_page: number = 0;
	/** x coordinate after the left margin */
	public origin_x: number = 0;
	/** y coordinate after the top margin */
	public origin_y: number = 0;
	/** page height minus top margin and bottom margin */
	public content_height: number = 0;
	/** page width minus left margin and right margin */
	public content_width: number = 0;
	/** label for the level of difficulty of the questions in english */
	public label_eng: string = '';
	/** difficulty */
	public difficulty: string = '';
	/** number of digits of the first number in a question */
	public first_number_of_digits: number = 1;
	/** operation symbol */
	public operation_symbol: string = '÷';
	/** label for the level of difficulty of the questions in malay */
	public label_malay: string = '';
	/** operation method in english */
	public operation_method_eng: string = 'divide';
	/** operation method in malay */
	public operation_method_malay: string = 'bahagi';
	/** number of digits of the second number in a question */
	public second_number_of_digits: number = 1;
	/** array containing first number in the column method */
	public array_num_1: Array<number> = [];
	/** array containing second number in the column method */
	public array_num_2: Array<number> = [];
	/** total number of questions */
	public total_questions: number = 0;
	/** drills layout information */
	public layout: DrillLayout = {
		row: 4,
		column: 4,
		rowHeight: 0,
		columnWidth: 0
	};

	constructor(difficulty: string, num_page: any) {
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
				Title: 'Long Division Method'
				// Author?: string;
				// Subject?: string;
				// Keywords?: string;
				// ModDate?: Date;
			}
		});

		this.origin_x = this.x;
		this.origin_y = this.y;

		this.content_height = this.page.height - this.page.margins.top - this.page.margins.bottom;
		this.content_width = this.page.width - this.page.margins.left - this.page.margins.right;
		this.difficulty = difficulty;
		this.first_number_of_digits = difficultyList.get(difficulty)?.first_number_of_digits ?? 1;
		this.second_number_of_digits = difficultyList.get(difficulty)?.second_number_of_digits ?? 1;
		this.label_eng = difficultyList.get(difficulty)?.level_eng ?? 'easy';
		this.label_malay = difficultyList.get(difficulty)?.level_malay ?? 'mudah';
		this.num_page = num_page;

		let instruction = `Solve the following questions using the ${this.operation_method_eng} function.`;
		let instruction_translation = `Selesaikan soalan-soalan berikut dengan menggunakan fungsi ${this.operation_method_malay}.`;

		addHeader(this, this.x, this.y, this.origin_x);
		this.addTitle(this.x, this.y);
		this.moveDown(2);
		this.x = this.origin_x;
		addInstruction(this, this.x, this.y, instruction, instruction_translation);
		this.moveDown(1);
		this.drawQuestionsBorder();
		this.initDrillLayout();
		this.drawAllQuestions();
		this.addPage();
		this.createAnswerSheet();
	}

	/** title includes cartoon image, and title */
	addTitle(x: number, y: number) {
		let eng_title: string = `Worksheet: ${this.label_eng} Level (${this.first_number_of_digits} digits ${this.operation_symbol} ${this.second_number_of_digits} digit(s))`;
		let malay_title: string = `Latihan: Tahap ${this.label_malay} (${this.first_number_of_digits} digit ${this.operation_symbol} ${this.second_number_of_digits} digit)`;

		displayCartoonImage(this, this.x, this.y - 13, this.difficulty);

		/** + 120 to shift to the right (avoid overlapped with the cartoon image */
		let x_title_box = x + 120;
		/** page width tolak x coordinate of title box tolak margin kanan */
		let width_title_box = this.page.width - x_title_box - this.page.margins.right;
		let height_title_box = 70;

		addTitleBox(this, x_title_box, y, width_title_box, height_title_box, eng_title, malay_title);
	}

	drawQuestionsBorder() {
		drawOrangeBorder(this, this.origin_x, this.origin_y, this.content_width, this.content_height);
		displayStarImages(this, 30, 40);
	}

	private drawAllQuestions() {
		let columnMethodWidth: number = this.layout.columnWidth - 10;
		let x_shift: number = (this.layout.columnWidth - columnMethodWidth) / 2;

		let origin_x: number = this.origin_x;
		let origin_y: number = this.y;

		this.registerFont('Arial', join(process.cwd(), fontArial));
		this.font('Arial').fillColor('black');

		for (let index = 0; index < this.layout.row; index++) {
			for (let j = 0; j < this.layout.column; j++) {
				/** start generating random a question */
				var firstNum = 0;
				var secondNum = 0;

				firstNum = generateRandomNumber(this.first_number_of_digits);
				secondNum = generateRandomNumber(this.second_number_of_digits);

				// for non-remainder question
				while (secondNum < 2 || firstNum % secondNum != 0) {
					firstNum = generateRandomNumber(this.first_number_of_digits);
					secondNum = generateRandomNumber(this.second_number_of_digits);
				}

				this.array_num_1.push(firstNum);
				this.array_num_2.push(secondNum);
				/** end of generating random a question */

				this.drawColumnMethod(
					origin_x + x_shift + j * this.layout.columnWidth,
					origin_y + index * this.layout.rowHeight,
					this.array_num_1[this.total_questions],
					this.array_num_2[this.total_questions],
					columnMethodWidth,
					++this.total_questions
				);
			}
		}
	}

	/**
	 * @param x coordinate x
	 * @param y coordinate y
	 * @param num1 first number in the equation
	 * @param num2 second number in the equation
	 * @param operation the operation symbol (+, -, x)
	 * @param width width of the column method (box ??, ibarat mcm kotak).
	 */
	drawColumnMethod(
		x: number,
		y: number,
		num1: number,
		num2: number,
		width: number,
		questionNumber: number,
		padding: number = 5
	) {
		const content_width = width - padding - padding;
		const content_x = x + padding;
		const content_y = y + padding;
		const characterSpacing = 8;
		const fontSize = 14;

		// Draw question number
		this.fontSize(fontSize).text(questionNumber.toString() + ')', content_x, content_y, {
			width: width,
			align: 'left'
		});

		// Draw first number
		this.fontSize(fontSize).text(num1.toString(), content_x + 60, content_y + 25, {
			width: content_width,
			align: 'left',
			characterSpacing: characterSpacing
		});

		// Draw operation sign
		this.moveTo(content_x + 100, content_y + 20)
			.lineTo(content_x + 50, content_y + 20)
			.quadraticCurveTo(content_x + 60, content_y + 60 / 2, content_x + 50, content_y + 45)
			.stroke();

		// Draw second number
		this.fontSize(fontSize).text(num2.toString(), content_x + 40, content_y + 25, {
			width: content_width,
			align: 'left',
			characterSpacing: characterSpacing
		});
	}

	createAnswerSheet() {
		this.answerSheetLayout();

		let counter = 0;
		let columnMethodWidth: number = this.layout.columnWidth - 10;
		let x_shift: number = (this.layout.columnWidth - columnMethodWidth) / 2;

		for (let index = 0; index < this.num_page * this.layout.row; index++) {
			let y = this.y;
			for (let j = 0; j < this.layout.column; j++) {
				this.printAnswers(
					this.origin_x + x_shift + j * this.layout.columnWidth,
					y,
					this.array_num_1[counter],
					this.array_num_2[counter],
					columnMethodWidth,
					++counter
				);
			}
			index++;

			if (counter % 48 == 0 && index < this.num_page * this.layout.row) {
				this.addPage();
				this.answerSheetLayout();
			}
			index--;

			this.moveDown(2);
		}
	}

	/**
	 * @param x coordinate x
	 * @param y coordinate y
	 * @param num1 first number in the equation
	 * @param num2 second number in the equation
	 * @param operation the operation symbol (+, -, x)
	 * @param width width of the column method (box ??, ibarat mcm kotak).
	 */
	printAnswers(
		x: number,
		y: number,
		num1: number,
		num2: number,
		width: number,
		questionNumber: number,
		padding: number = 5
	) {
		const content_width = width - padding - padding;
		const content_x = x + padding;
		const content_y = y + padding;

		// Draw question number
		this.text(questionNumber.toString() + ')', content_x, content_y, {
			width: width,
			align: 'left'
		});

		// Calculate and write the answer
		let result: number = num1 / num2;

		this.text(result.toString(), content_x + 30, content_y, {
			width: content_width,
			align: 'left'
		});
	}

	answerSheetLayout() {
		this.font('Chilanka')
			.fontSize(14)
			.text('Answer Sheet', {
				align: 'left'
			})
			.fontSize(9)
			.fillColor('grey')
			.text('Kertas Jawapan');

		//reset font and font color
		this.font('Helvetica').fontSize(12).fillColor('black');

		this.moveDown(1);
		drawOrangeBorder(this, this.origin_x, this.origin_y, this.content_width, this.content_height);
	}

	private initDrillLayout() {
		this.layout.columnWidth = this.content_width / this.layout.column;
		this.layout.rowHeight = (this.content_height - this.y) / this.layout.row;
	}
}
