import { DrillBase } from '../base/DrillBase';
import { generateAddition } from '$lib/questions/standard-one/addition';
import type { Question } from '$lib/questions/evaluate';

export default class Addition extends DrillBase {
	private questions: Question[];

	constructor(num_page: number) {
		let eng_title = 'Standard 1 - Addition';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penambahan';
		this.num_page = num_page;
		this.layout.column = 2;
		this.header.withPicture = true;

		const total = this.layout.row * this.layout.column * this.num_page;
		this.questions = Array.from({ length: total }, () => generateAddition());

		this.generate();
		this.generatePageNumbers();
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.answers[this.counter] = q.answer;
		let formatted_addends = q.operands.map((n) => n.toLocaleString());

		let question_string = formatted_addends.join(` ${q.operator} `) + ' = ';

		this.fontSize(16)
			.text(`${++this.counter})  `, x, y, {
				continued: true
			})
			.text(`${question_string}`, {
				// wordSpacing: 1,
				characterSpacing: 2
			});
	}
}
