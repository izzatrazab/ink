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

	public drawAllQuestions(): void {
		let columnMethodWidth: number = this.layout.columnWidth / 1.5;
        
		let x_shift: number = (this.layout.columnWidth - columnMethodWidth) / 2;
		let x: number = this.origin_x + x_shift;

		let columnMethodHeight: number = this.layout.rowHeight - 10;
		let y_shift: number = (this.layout.rowHeight - columnMethodHeight) / 2;
		let y: number = this.y + y_shift + 20;

		this.font('Arial').fillColor('black');

		for (let index = 0; index < this.layout.row; index++) {
			for (let j = 0; j < this.layout.column; j++) {
				let x_point = x + j * this.layout.columnWidth;
				let y_point = y + index * this.layout.rowHeight;

				let addends = this.getAddends();
				this.answers[this.counter] = addends.reduce((sum, addend) => sum + addend, 0);

				/** end of generating random a question */
				
				this.drawColumnMethod(
					x_point,
					y_point,
					addends[0],
					addends[1],
					'+',
					columnMethodWidth,
					++this.counter
				);
			}
		}
	}

	private getAddends() {
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
