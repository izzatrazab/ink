import { DrillBase } from '../base/DrillBase';
import { generateDivision } from '$lib/questions/standard-6/division';
export default class Division extends DrillBase {
	constructor(num_page: number) {
		const eng_title = 'Standard 6 - Division';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 6 - Pembahagian';
		this.num_page = num_page;
		this.origin_x = this.x;
		this.layout.questionOriginX = 10;
		this.layout.questionOriginY = 20;

		this.produceWorksheet(generateDivision);
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.drawInlineForm(x, y, q, ++this.counter);
	}
}
