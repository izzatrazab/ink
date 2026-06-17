import { DrillBase } from '../base/DrillBase';
import { generateSubtraction } from '$lib/questions/standard-6/subtraction';
export default class Subtraction extends DrillBase {
	constructor(num_page: number) {
		const eng_title = 'Standard 6 - Subtraction';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 6 - Penolakan';
		this.num_page = num_page;
		this.origin_x = this.x;
		this.layout.questionOriginX = 10;
		this.layout.questionOriginY = 20;

		this.produceWorksheet(generateSubtraction);
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.drawInlineForm(x, y, q, ++this.counter);
	}
}
