import { DrillBase } from '../base/DrillBase';
import { generateMultiplication } from '$lib/questions/standard-6/multiplication';
export default class Multiplication extends DrillBase {
	constructor(num_page: number) {
		const eng_title = 'Standard 6 - Multiplication';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 6 - Pendaraban';
		this.num_page = num_page;
		this.origin_x = this.x;
		this.layout.questionOriginX = 10;
		this.layout.questionOriginY = 20;

		this.produceWorksheet(generateMultiplication);
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.drawInlineForm(x, y, q, ++this.counter);
	}
}
