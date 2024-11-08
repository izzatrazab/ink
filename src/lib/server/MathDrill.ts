import PDFDocument from 'pdfkit';
/**
 * custom class extending PDFDocument with additional mathematical drawings.
 */
export default class MathDrill extends PDFDocument {
	constructor(constructor: any) {
		super(constructor);
	}

	/**
	 * rindu org tu 💕
	 * @param x coordinate x
	 * @param y coordinate y
	 * @param num1 first number in the equation
	 * @param num2 second number in the equation
	 * @param operation the operation symbol (+, -, x)
	 * @param width width of the column method (box ??, ibarat mcm kotak).
	 */
	drawColumnMethod(
		x: number,
		y: number,
		num1: number,
		num2: number,
		operation: string,
		width: number,
		questionNumber: number,
		answer: boolean,
		padding: number = 5
	) {
		const content_width = width - padding - padding;
		const content_x = x + padding;
		const content_y = y + padding;

		// Draw question number
		this.text(questionNumber.toString() + ')', content_x, content_y, {
			width: width,
			align: 'left'
		});

		// Draw first number
		this.text(num1.toString(), content_x, content_y + 15, {
			width: content_width,
			align: 'right'
		});

		// Draw operation sign
		this.text(operation, content_x + 20, content_y + 30, {
			width: content_width,
			align: 'left'
		});

		// Draw second number
		this.text(num2.toString(), content_x, content_y + 30, {
			width: content_width,
			align: 'right'
		});

		// Draw line
		const lineY = content_y + 50;

		// this.rect(x, y, width, 70) // temporary

		this.moveTo(content_x + 20, lineY)
			.lineTo(content_x + content_width, lineY)
			.stroke();

		this.moveTo(content_x + 20, lineY + 20)
			.lineTo(content_x + content_width, lineY + 20)
			.stroke();

		// Calculate and write the answer
		if (answer) {
			// Calculate and write the answer
			const result =
				operation === '+' ? num1 + num2 : 
				operation === '-' ? num1 - num2 : num1 * num2;

			this.text(result.toString(), content_x, content_y + 55, {
				width: content_width,
				align: 'right'
			});
		}

		// const result = operation === '+' ? num1 + num2 : num1 - num2;
		// this.text(result.toString(), x+30, lineY + 10);
		// console.dir(lineY);
	}

	async drawAnimal() {
		this.image("src/lib/assets/animals/hard/bear.png", 0, 15, { width: 300 });
	}
}
