import { DrillBase } from '../base/DrillBase';
import { getRandomNumber } from '$lib/helper';

export default class AdditionStandardForm extends DrillBase {
	constructor(num_page: number) {
		let eng_title = 'Standard 1 - Addition Standard Form';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penambahan Bentuk Lazim';
		this.num_page = num_page;
		this.origin_x = this.x;
		this.layout.column = 3;
		this.layout.row = 5;
		this.header.withPicture = true;

		this.generate();
		this.generatePageNumbers();
	}

	public drawQuestion(x: number, y: number): void {
		let numbers = this.getNumbers();

		this.answers[this.counter] = numbers.reduce((result, num) => result + num, 0);

		this.drawColumnMethod(
			x,
			y,
			numbers[0],
			numbers[1],
			'+',
			this.layout.columnWidth / 1.5,
			++this.counter
		);
	}

	private getNumbers() {
		return this.caseOne();
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
}
