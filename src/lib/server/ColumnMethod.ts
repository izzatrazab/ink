import { generateRandomNumber } from '$lib/helper';
import { difficultyList } from '$lib/difficulty';
import fontChilankaRegular from '$lib/assets/fonts/Chilanka-Regular.ttf';
import fontDynaPuffVariable from '$lib/assets/fonts/DynaPuff-VariableFont.ttf';
import fontArial from '$lib/assets/fonts/Arial.ttf';
import imgStar8 from '$lib/assets/stars/star-8.png';
import imgStar9 from '$lib/assets/stars/star-9.png';
import imgStar10 from '$lib/assets/stars/star-10.png';

import PDFDocument from 'pdfkit';

import path from 'path';

interface DrillLayout {
	row: number;
	column: number;
	rowHeight: number;
	columnWidth: number;
}

/**
 * custom class extending PDFDocument with additional mathematical drawings.
 */
export default class ColumnMethod extends PDFDocument {
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
	/** total number of questions */
	public total_questions: number = 0;
	/** operation symbol */
	public operation_symbol: string = '';
	/** operation method in english */
	public operation_method_eng: string = '';
	/** operation method in malay */
	public operation_method_malay: string = '';
	/** difficulty */
	public difficulty: string = '';
	/** label for the level of difficulty of the questions in english */
	public label_eng: string = '';
	/** label for the level of difficulty of the questions in malay */
	public label_malay: string = '';
	/** number of digits of the first number in a question */
	public first_number_of_digits: number = 1;
	/** number of digits of the second number in a question */
	public second_number_of_digits: number = 1;
	/** array containing first number in the column method */
	public array_num_1: Array<number> = [];
	/** array containing second number in the column method */
	public array_num_2: Array<number> = [];
	/** drills layout information */
	public layout: DrillLayout = {
		row: 4,
		column: 4,
		rowHeight: 0,
		columnWidth: 0
	};

	constructor(operation: string, difficulty: string, num_page: any) {
		super({
			size: 'A4',
			margins: {
				top: 50,
				left: 65,
				bottom: 50,
				right: 65
			}
		});

		/**
		 * size: 'A4',
		 * width: 595.28, height: 841.89, (PostScript points)
		 */

		this.origin_x = this.x;
		this.origin_y = this.y;
		if (operation === 'multiplication') {
			this.content_height =
				this.page.height - this.page.margins.top / 50 - this.page.margins.bottom * 2;
		} else {
			this.content_height = this.page.height - this.page.margins.top - this.page.margins.bottom;
		}

		this.content_width = this.page.width - this.page.margins.left - this.page.margins.right;
		this.operation_symbol = this.getSymbol(operation).symbol;
		this.operation_method_eng = operation;
		this.operation_method_malay = this.getSymbol(operation).operation_char;
		this.difficulty = difficulty;
		this.first_number_of_digits = difficultyList.get(difficulty)?.first_number_of_digits ?? 1;
		this.second_number_of_digits = difficultyList.get(difficulty)?.second_number_of_digits ?? 1;
		this.label_eng = difficultyList.get(difficulty)?.level_eng ?? 'easy';
		this.label_malay = difficultyList.get(difficulty)?.level_malay ?? 'mudah';
		this.num_page = num_page;

		/** to determine the number of worksheets created */
		for (let i = 0; i < this.num_page; i++) {
			this.addHeader(this.x, this.y);
			this.addTitle(this.x, this.y, operation);
			this.initDrillLayout(operation);
			this.drawAllQuestions();
			this.addPage();
		}
		this.createAnswerSheet();
	}

	/** header includes name, and score */
	addHeader(x: number, y: number) {
		this.registerFont('Chilanka', path.join(process.cwd(), fontChilankaRegular));
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

	/** title includes cartoon image, and title */
	addTitle(x: number, y: number, operation: string) {
		let width: number = 90;
		let gap: number = 10;
		let xTitle: number = x + width + 3 * gap;
		let wTitle: number = this.content_width - width - 3 * gap;
		let hTitle: number = 70;
		this.strokeColor('#737373').lineWidth(2);
		this.rect(xTitle, y, wTitle, hTitle).stroke();

		this.registerFont('DynaPuff', path.join(process.cwd(), fontDynaPuffVariable));
		this.font('DynaPuff').fontSize(14);
		this.fillColor('#2acf90').text(
			`Worksheet: ${this.label_eng} Level (${this.first_number_of_digits} digits ${this.operation_symbol} ${this.second_number_of_digits} digit(s))`,
			xTitle,
			y + 10,
			{
				align: 'center',
				height: hTitle
			}
		);
		this.fontSize(11)
			.fillColor('grey')
			.text(
				`Latihan: Tahap ${this.label_malay} (${this.first_number_of_digits} digit ${this.operation_symbol} ${this.second_number_of_digits} digit)`,
				xTitle,
				y + 35,
				{ align: 'center', height: hTitle }
			);

		this.font('Chilanka').fontSize(14).fillColor('black');
		this.text(
			`Solve the following questions using the ${this.operation_method_eng} function.`,
			x,
			y + 85,
			{
				align: 'center'
			}
		);
		this.fontSize(10)
			.fillColor('grey')
			.text(
				`Selesaikan soalan-soalan berikut dengan menggunakan fungsi ${this.operation_method_malay}.`,
				x,
				y + 100.5,
				{
					align: 'center'
				}
			);

		this.moveDown(1);

		// Set the stroke color and line width for the border
		this.strokeColor('orange').lineWidth(3);

		// Draw a rounded rectangle
		const xAxis = 60;
		const yAxis = 209;
		const widthRect = 475;
		var heightRect = 0;
		if (operation === 'multiplication') {
			heightRect = 595;
		} else {
			heightRect = 565;
		}
		const radius = 10;
		this.roundedRect(xAxis, yAxis, widthRect, heightRect, radius).stroke();

		// Reset the stroke color and line width
		this.strokeColor('black').lineWidth(1);

		// star images
		this.image(path.join(process.cwd(), imgStar8), 540, 665, { align: 'right', width: 30 });
		this.image(path.join(process.cwd(), imgStar9), 540, 705, { align: 'right', width: 30 });
		this.image(path.join(process.cwd(), imgStar10), 540, 745, { align: 'right', width: 30 });

		this.displayCartoonImage();
	}

	private drawAllQuestions() {
		let columnMethodWidth: number = this.layout.columnWidth - 10;
		let x_shift: number = (this.layout.columnWidth - columnMethodWidth) / 2;

		let origin_x: number = this.origin_x;
		let origin_y: number = this.y;

		this.registerFont('Arial', path.join(process.cwd(), fontArial));
		this.font('Arial').fillColor('black');

		for (let index = 0; index < this.layout.row; index++) {
			for (let j = 0; j < this.layout.column; j++) {
				/** start generating random a question */

				var firstNum = 0;
				var secondNum = 0;

				firstNum = generateRandomNumber(this.first_number_of_digits);
				secondNum = generateRandomNumber(this.second_number_of_digits);

				this.array_num_1.push(firstNum);
				this.array_num_2.push(secondNum);

				/** end of generating random a question */

				this.drawColumnMethod(
					origin_x + x_shift + j * this.layout.columnWidth,
					origin_y + index * this.layout.rowHeight,
					this.array_num_1[this.total_questions],
					this.array_num_2[this.total_questions],
					this.operation_symbol,
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
		operation: string,
		width: number,
		questionNumber: number,
		padding: number = 5
	) {
		const content_width = width - padding - padding;
		const content_x = x + padding;
		const content_y = y + padding;
		const characterSpacing = 8;
		const fontSize = 14;
		const operationSymbolSize = 18;

		// Draw question number
		this.fontSize(fontSize).text(questionNumber.toString() + ')', content_x, content_y, {
			width: width,
			align: 'left'
		});

		// Draw first number
		this.fontSize(fontSize).text(num1.toString(), content_x, content_y + 15, {
			width: content_width,
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
			width: content_width,
			align: 'right',
			characterSpacing: characterSpacing
		});

		// Draw lines for calculation and answer space
		const start_line_x = content_x + 15;
		const end_line_x = content_x + content_width + 5;

		// Draw first line
		this.moveTo(start_line_x, this.y).lineTo(end_line_x, this.y).stroke();

		// Draw middle line (for multiplication, it has additional middle line if second number has more than 1 digit)
		if (this.operation_method_eng === 'multiplication' && this.second_number_of_digits > 1) {
			this.moveDown(this.second_number_of_digits * 1.25);
			this.moveTo(start_line_x, this.y).lineTo(end_line_x, this.y).stroke();
		}

		// answer gap and draw last line
		this.moveDown(1.5);
		this.moveTo(start_line_x, this.y).lineTo(end_line_x, this.y).stroke();
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
		let result: number;

		switch (this.operation_method_eng) {
			default:
			case 'addition':
				result = num1 + num2;
				break;
			case 'subtraction':
				result = num1 - num2;
				break;
			case 'multiplication':
				result = num1 * num2;
				break;
		}

		this.text(result.toString(), content_x + 30, content_y, {
			width: content_width,
			align: 'left'
		});
	}

	displayCartoonImage() {
		let allImagesPath: any;

		switch (this.difficulty) {
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

		let imagePath = path.join(process.cwd(), module.default as string);

		this.image(imagePath, this.x, this.y - 136, {
			align: 'right',
			height: 90
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

		this.font('Helvetica').fontSize(12).fillColor('black');

		this.strokeColor('orange').lineWidth(3);

		// Draw a rounded rectangle
		const xAxis = 60;
		const yAxis = 109;
		const widthRect = 475;
		const heightRect = 665;
		const radius = 10;
		this.roundedRect(xAxis, yAxis, widthRect, heightRect, radius).stroke();

		this.y = yAxis + 10;
	}

	private initDrillLayout(operation: string) {
		this.layout.columnWidth = this.content_width / this.layout.column;
		if (operation === 'multiplication') {
			this.layout.rowHeight = (this.content_height - 160) / this.layout.row;
		} else {
			this.layout.rowHeight = (this.content_height - this.y) / this.layout.row;
		}
	}

	private getSymbol(operation: string) {
		switch (operation) {
			default:
			case 'addition':
				return { symbol: '+', operation_char: 'tambah' };
			case 'subtraction':
				return { symbol: '−', operation_char: 'tolak' };
			case 'multiplication':
				return { symbol: '×', operation_char: 'darab' };
		}
	}
}
