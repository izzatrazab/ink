import { DrillBase } from '../base/DrillBase';
import { generateSubtraction } from '$lib/questions/standard-one/subtraction';
import type { Question } from '$lib/questions/evaluate';

export default class Subtraction extends DrillBase {
	private questions: Question[];

	constructor(num_page: number) {
		let eng_title = 'Standard 1 - Subtraction';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penolakan';
		this.num_page = num_page;
		this.layout.column = 2;
		this.header.withPicture = true;

		const total = this.layout.row * this.layout.column * this.num_page;
		this.questions = Array.from({ length: total }, () => generateSubtraction());

		this.generate();
		this.generatePageNumbers();
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.answers[this.counter] = q.answer;
		this.drawInlineForm(x, y, q, ++this.counter);
	}
}
