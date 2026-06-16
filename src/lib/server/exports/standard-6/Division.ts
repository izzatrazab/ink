import { DrillBase } from '../base/DrillBase';
import { generateDivision } from '$lib/questions/standard-6/division';
import type { Question } from '$lib/questions/evaluate';

export default class Division extends DrillBase {
	private questions: Question[];

	constructor(num_page: number) {
		let eng_title = 'Standard 6 - Division';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 6 - Pembahagian';
		this.num_page = num_page;
		this.origin_x = this.x;
		this.layout.questionOriginX = 10;
		this.layout.questionOriginY = 20;

		const total = this.layout.row * this.layout.column * this.num_page;
		this.questions = Array.from({ length: total }, () => generateDivision());

		this.generate();
		this.generatePageNumbers();
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.answers[this.counter] = q.answer;
		this.drawInlineForm(x, y, q, ++this.counter);
	}
}
