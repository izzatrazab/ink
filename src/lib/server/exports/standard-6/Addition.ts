import {
	addHeader
} from '$lib/server/drillvendor';
import { DrillBase, type DrillLayout } from '../base/DrillBase';
import fontArial from '$lib/assets/fonts/Arial.ttf';

import fontDynaPuffVariable from '$lib/assets/fonts/DynaPuff-VariableFont.ttf';
import { join } from 'path';
import { getRandomNumber} from '$lib/helper';

export default class Addition extends DrillBase {
	public layout: DrillLayout = {
		row: 12,
		column: 1,
		rowHeight: 0,
		columnWidth: 0
	};

	public answers: Array<number> = [];
	public counter: number = 0;

	constructor(num_page: number) {
		super(
			{
				Title: 'Standard 6 - Addition'
			},
			true
		);

		this.num_page = num_page;
		this.origin_x = this.x;

		this.generate();

		// see the range of buffered pages
		const range = this.bufferedPageRange(); // => { start: 0, count: 2 }
		console.dir(range);

		for (let index = range.start; index < range.count; index++) {
			this.switchToPage(index);
			console.dir(this.page.height);
			this.text(
				`p. ${index + 1}/${range.count}`,
				this.origin_x,
				this.page.margins.top / 2,
				{
					align: "right",
					baseline: 'top'
				}
			);
		}
	}

	private generate() {
		for (let index = 0; index < this.num_page; index++) {
			addHeader(this, this.x, this.y, this.origin_x);
			this.addTitle();
			this.moveDown(0.5).drawBorder({ x: this.origin_x, y: this.y });
			this.initDrillLayout();
			this.drawAllQuestions();
			this.addPage();
		}

		// answer
		this.font('Chilanka')
			.fontSize(14)
			.text('Answer Sheet', {
				align: 'left'
			})
			.fontSize(9)
			.fillColor('grey')
			.text('Kertas Jawapan');

		//reset font and font color
		this.font('Arial').fontSize(12).fillColor('black').moveDown(1);
		let formatted_answers = this.answers.map((answer) => answer.toLocaleString());

		this.moveDown(1);

		let string = formatted_answers.map(function (value, index) {
			return index + 1 + ')  ' + value;
		});

		let final = string.reduce((result, item) => (result += item + '\n'), '');

		this.text(final, {
			columns: 3,
			columnGap: 15,
			align: 'justify',
			wordSpacing: 5,
			characterSpacing: 1,
			lineGap: 20
		});
	}

	initDrillLayout() {
		let padding = 10;
		this.layout.columnWidth = (this.getContentWidth() - padding * 2) / this.layout.column;
		let remaining_available_height =
			this.page.height - this.y - this.page.margins.bottom - padding * 2;
		this.layout.rowHeight = remaining_available_height / this.layout.row;
	}

	addTitle() {
		let x = this.x;
		let y = this.y;
		let eng_title = 'Standard 6 - Addition';
		let malay_title = '  (Tahun 6 - Penambahan)';

		this.registerFont('DynaPuff', join(process.cwd(), fontDynaPuffVariable)).font('DynaPuff');

		this.fontSize(16).fillColor('#982cc9').text(eng_title, this.x, this.y, {
			continued: true,
			baseline: 'middle'
		});

		this.fontSize(11).fillColor('grey').text(malay_title, this.x, this.y, {
			baseline: 'middle'
		});
	}

	private drawAllQuestions() {
		let layout_padding = 0;
		let box_width: number = this.layout.columnWidth - layout_padding;
		let x_shift: number = (this.layout.columnWidth - box_width) / 2;
		// x origin point of the first box
		let x: number = this.origin_x + 10 + x_shift;

		let box_height: number = this.layout.rowHeight - layout_padding;
		let y_shift: number = (this.layout.rowHeight - box_height) / 2;
		// y origin point of the first box
		let y: number = this.y + 20 + y_shift;

		this.registerFont('Arial', join(process.cwd(), fontArial));
		this.font('Arial').fillColor('black');

		// this.counter = 0;

		for (let index = 0; index < this.layout.row; index++) {
			for (let j = 0; j < this.layout.column; j++) {
				let x_point = x + j * this.layout.columnWidth;
				let y_point = y + index * this.layout.rowHeight;

				let addends = [getRandomNumber(6), getRandomNumber(6), getRandomNumber(6)];
				this.answers[this.counter] = addends.reduce((sum, addend) => sum + addend, 0);
				let formatted_addends = addends.map((addend) => addend.toLocaleString());

				let question_string = formatted_addends.join(' + ') + ' = ';

				this.fontSize(16).text(`${++this.counter})`, x_point, y_point, {
					width: box_width * 0.05,
					// continued: true,
					align: 'right'
				});

				this.fontSize(16).text(question_string, x_point + 35, y_point, {
					width: box_width * 0.8,
					align: 'left',
					wordSpacing: 5,
					characterSpacing: 2
				});
			}
		}
	}
}
