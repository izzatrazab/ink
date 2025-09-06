import { getRandomNumber } from '$lib/helper';
import { DrillBase } from '../base/DrillBase';

export default class SubtractionStandardForm extends DrillBase {
	constructor(num_page: number) {
		let eng_title = 'Standard 1 - Subtraction';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penolakan';
		this.num_page = num_page;
		this.layout.column = 3;
		this.layout.row = 5;
		this.header.withPicture = true;

		this.generate();
		this.generatePageNumbers();
	}

	public drawQuestion(x: number, y: number): void {
		let numbers = this.getNumbers();

		this.answers[this.counter] = numbers.slice(1).reduce((result, num) => result - num, numbers[0]);

		this.drawColumnMethod(
			x,
			y,
			numbers[0],
			numbers[1],
			'-',
			this.layout.columnWidth / 1.5,
			++this.counter
		);
	}

	private getNumbers() {
		return this.caseOne();
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
}
