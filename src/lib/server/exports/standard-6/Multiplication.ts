import { DrillBase } from '../base/DrillBase';
import fontArial from '$lib/assets/fonts/Arial.ttf';
import { join } from 'path';
import { getRandomNumber, shuffleArray } from '$lib/helper';

export default class Multiplication extends DrillBase {
	constructor(num_page: number) {
		let eng_title = 'Standard 6 - Multiplication';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 6 - Pendaraban';
		this.num_page = num_page;
		this.origin_x = this.x;

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
		let layout_padding = 0;
		let box_width: number = this.layout.columnWidth - layout_padding;
		let x_shift: number = (this.layout.columnWidth - box_width) / 2;
		// x origin point of the first box
		let x: number = this.origin_x + 10 + x_shift;

		let box_height: number = this.layout.rowHeight - layout_padding;
		let y_shift: number = (this.layout.rowHeight - box_height) / 2;
		// y origin point of the first box
		let y: number = this.y + 20 + y_shift;

		this.registerFont('Arial', join(process.cwd(), fontArial));
		this.font('Arial').fillColor('black');

		for (let index = 0; index < this.layout.row; index++) {
			for (let j = 0; j < this.layout.column; j++) {
				let x_point = x + j * this.layout.columnWidth;
				let y_point = y + index * this.layout.rowHeight;

				let nums = [getRandomNumber(1), getRandomNumber(7)];
				nums = shuffleArray(nums);

				this.answers[this.counter] = nums.reduce((result, num) => result * num, 1);
				let formatted_nums = nums.map((num) => num.toLocaleString());

				let question_string = formatted_nums.join(' x ') + ' = ';

				this.fontSize(16)
					.text(`${++this.counter})  `, x_point, y_point, {
						continued: true
					})
					.text(`${question_string}`, {
						wordSpacing: 5,
						characterSpacing: 2
					});
			}
		}
	}
}
