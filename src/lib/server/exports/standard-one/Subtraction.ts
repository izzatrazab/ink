import { getRandomNumber } from '$lib/helper';
import { DrillBase } from '../base/DrillBase';

export default class Subtraction extends DrillBase {
	constructor(num_page: number) {
		let eng_title = 'Standard 1 - Subtraction';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penolakan';
		this.num_page = num_page;
		this.layout.column = 2;
		this.header.withPicture = true;

		this.generate();
		this.generatePageNumbers();
	}

	public drawQuestion(x: number, y: number): void {
		let numbers = this.getNumbers();

		this.answers[this.counter] = numbers.slice(1).reduce((result, num) => result - num, numbers[0]);
		let formatted_addends = numbers.map((num) => num.toLocaleString());

		let question_string = formatted_addends.join(' - ') + ' = ';

		this.fontSize(16)
			.text(`${++this.counter})  `, x, y, {
				continued: true
			})
			.text(`${question_string}`, {
				// wordSpacing: 1,
				characterSpacing: 2
			});
	}

	private getNumbers() {
		switch (Math.floor(Math.random() * 2)) {
			default:
			case 0:
				return this.caseOne();
			case 1:
				return this.caseTwo();
		}
	}

	private caseOne() {
		let num1: number;
		let num2: number;
		do {
			num1 = getRandomNumber(1);
			num2 = getRandomNumber(1);
		} while (num1 < num2);
		return [num1, num2];
	}

	private caseTwo() {
		let num1: number;
		let num2: number;
		do {
			num1 = getRandomNumber(2);
			num2 = getRandomNumber(1);
		} while (num1 < num2);
		return [num1, num2];
	}
}
