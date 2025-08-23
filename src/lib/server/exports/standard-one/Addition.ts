import { DrillBase } from '../base/DrillBase';
import { getRandomNumber } from '$lib/helper';

export default class Addition extends DrillBase {
	constructor(num_page: number) {
		let eng_title = 'Standard 1 - Addition';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penambahan';
		this.num_page = num_page;
		this.layout.column = 2;
		this.header.withPicture = true;
		
		this.generate();
		this.generatePageNumbers();
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

		this.font('Arial').fillColor('black');

		// this.counter = 0;

		for (let index = 0; index < this.layout.row; index++) {
			for (let j = 0; j < this.layout.column; j++) {
				let x_point = x + j * this.layout.columnWidth;
				let y_point = y + index * this.layout.rowHeight;

				let addends = this.getAddends();
				this.answers[this.counter] = addends.reduce((sum, addend) => sum + addend, 0);
				let formatted_addends = addends.map((addend) => addend.toLocaleString());

				let question_string = formatted_addends.join(' + ') + ' = ';

				this.fontSize(16)
					.text(`${++this.counter})  `, x_point, y_point, {
						continued: true
					})
					.text(`${question_string}`, {
						// wordSpacing: 1,
						characterSpacing: 2
					});
			}
		}
	}

	private getAddends() {
		switch (Math.floor(Math.random() * 3)) {
			default:
			case 0:
				return this.caseOne();
			case 1:
				return this.caseTwo();
			case 2:
				return this.caseThree();
		}
	}

	private caseOne() {
		switch (Math.floor(Math.random() * 4)) {
			default:
			case 0:
				return [getRandomNumber(1), getRandomNumber(1)];
			case 1:
				return [getRandomNumber(2), getRandomNumber(1)];
			case 2:
				return [getRandomNumber(1), getRandomNumber(2)];
			case 3:
				return [getRandomNumber(2), getRandomNumber(2)];
		}
	}

	private caseTwo() {
		let temp = getRandomNumber(Math.floor(Math.random() * 2) + 1);

		return [temp, temp, temp];
	}
	private caseThree() {
		let temp = getRandomNumber(1);

		return [temp, temp, temp, temp];
	}
}
