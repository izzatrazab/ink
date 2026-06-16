import { DrillBase } from '../base/DrillBase';
import { generateAddition } from '$lib/questions/standard-6/addition';
import type { Question } from '$lib/questions/evaluate';

export default class Addition extends DrillBase {
	private questions: Question[];

	constructor(num_page: number) {
		let eng_title = 'Standard 6 - Addition';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 6 - Penambahan';
		this.num_page = num_page;
		this.origin_x = this.x;
		this.layout.questionOriginX = 10;
		this.layout.questionOriginY = 20;

		const total = this.layout.row * this.layout.column * this.num_page;
		this.questions = Array.from({ length: total }, () => generateAddition());

		this.generate();
		this.generatePageNumbers();
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.answers[this.counter] = q.answer;
		this.drawInlineForm(x, y, q, ++this.counter);
	}
}
