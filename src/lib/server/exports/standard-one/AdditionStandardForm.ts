import { DrillBase } from '../base/DrillBase';
import { generateAdditionStandardForm } from '$lib/questions/standard-one/additionStandardForm';
import type { Question } from '$lib/questions/evaluate';

export default class AdditionStandardForm extends DrillBase {
	private questions: Question[];

	constructor(num_page: number) {
		let eng_title = 'Standard 1 - Addition Standard Form';
		super({ Title: eng_title });

		this.title.eng = eng_title;
		this.title.ms = 'Tahun 1 - Penambahan Bentuk Lazim';
		this.num_page = num_page;
		this.origin_x = this.x;
		this.layout.column = 3;
		this.layout.row = 5;
		this.header.withPicture = true;

		const total = this.layout.row * this.layout.column * this.num_page;
		this.questions = Array.from({ length: total }, () => generateAdditionStandardForm());

		this.generate();
		this.generatePageNumbers();
	}

	public drawQuestion(x: number, y: number): void {
		const q = this.questions[this.counter];
		this.answers[this.counter] = q.answer;

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
