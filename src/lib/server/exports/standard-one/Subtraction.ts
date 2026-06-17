import { DrillBase } from '../base/DrillBase';
import { generateSubtraction } from '$lib/questions/standard-one/subtraction';
export default class Subtraction extends DrillBase {
	constructor(num_page: number) {
		const eng_title = 'Standard 1 - Subtraction';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penolakan';
		this.num_page = num_page;
		this.layout.column = 2;
		this.header.withPicture = true;

		this.produceWorksheet(generateSubtraction);
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.drawInlineForm(x, y, q, ++this.counter);
	}
}
