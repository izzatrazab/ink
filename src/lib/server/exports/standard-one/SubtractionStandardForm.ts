import { DrillBase } from '../base/DrillBase';
import { generateSubtractionStandardForm } from '$lib/questions/standard-one/subtractionStandardForm';
export default class SubtractionStandardForm extends DrillBase {
	constructor(num_page: number) {
		let eng_title = 'Standard 1 - Subtraction Standard Form';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penolakan Bentuk Lazim';
		this.num_page = num_page;
		this.layout.column = 3;
		this.layout.row = 5;
		this.header.withPicture = true;

		this.produceWorksheet(generateSubtractionStandardForm);
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
