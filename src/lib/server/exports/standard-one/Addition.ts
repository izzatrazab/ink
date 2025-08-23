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

	public drawQuestion(x: number, y: number): void {
		let addends = this.getAddends();
		this.answers[this.counter] = addends.reduce((sum, addend) => sum + addend, 0);
		let formatted_addends = addends.map((addend) => addend.toLocaleString());

		let question_string = formatted_addends.join(' + ') + ' = ';

		this.fontSize(16)
			.text(`${++this.counter})  `, x, y, {
				continued: true
			})
			.text(`${question_string}`, {
				// wordSpacing: 1,
				characterSpacing: 2
			});
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
