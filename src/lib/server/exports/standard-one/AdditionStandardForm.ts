import { DrillBase } from '../base/DrillBase';
import { generateAdditionStandardForm } from '$lib/questions/standard-one/additionStandardForm';
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

		this.produceWorksheet(generateAdditionStandardForm);
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];

		this.drawColumnMethod(
			x,
			y,
			q.operands[0],
			q.operands[1],
			q.operator,
			this.layout.columnWidth / 1.5,
			++this.counter
		);
	}
}
