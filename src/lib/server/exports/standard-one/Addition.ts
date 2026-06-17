import { DrillBase } from '../base/DrillBase';
import { generateAddition } from '$lib/questions/standard-one/addition';
export default class Addition extends DrillBase {
	constructor(num_page: number) {
		const eng_title = 'Standard 1 - Addition';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penambahan';
		this.num_page = num_page;
		this.layout.column = 2;
		this.header.withPicture = true;

		this.produceWorksheet(generateAddition);
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.drawInlineForm(x, y, q, ++this.counter);
	}
}
