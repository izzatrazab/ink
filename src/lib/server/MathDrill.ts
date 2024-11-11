import PDFDocument from 'pdfkit';

enum DrillTypes {
	Addition = '+',
	Subtraction = '-',
	Multiplication = '*'
}

/**
 * custom class extending PDFDocument with additional mathematical drawings.
 */
export default class MathDrill extends PDFDocument {
	/** x coordinate after the left margin */
	public origin_x: number = 0;
	/** y coordinate after the top margin */
	public origin_y: number = 0;
	/** page height minus top margin and bottom margin */
	public content_height: number = 0;
	/** page width minus left margin and right margin */
	public content_width: number = 0;

	constructor(hasHeader: boolean = true, hasTitle: boolean = true) {
		super({
			size: 'A4',
			margins: {
				top: 50,
				left: 65,
				bottom: 50,
				right: 65
			}
		});
		/**
		 * size: 'A4',
		 * width: 595.28, height: 841.89, (PostScript points)
		 */

		this.origin_x = this.x;
		this.origin_y = this.y;
		this.content_height = this.page.height - this.page.margins.top - this.page.margins.bottom;
		this.content_width = this.page.width - this.page.margins.left - this.page.margins.right;

		if (hasHeader) this.addHeader(this.x, this.y);
		if (hasTitle) this.addTitle(this.x, this.y);
	}

	/** header includes name, and score */
	addHeader(x: number, y: number) {
		this.registerFont('Chilanka','src/lib/assets/fonts/Chilanka-Regular.ttf');
		this.font('Chilanka').fontSize(14);
		this.text('Nama: ___________________________________________', { align: 'left' });
		this.text('Markah: _______/25', x, y, { align: 'right' });
		this.moveDown(1);
	}

	/** title includes cartoon image, and title */
	addTitle(x: number, y: number) {
		let width: number = 90;
		this.image('src/lib/assets/animals/easy/chipmunk.png', x, y, { align: 'right', width: width });
		let gap: number = 10;
		let xTitle: number = x + width + gap;
		let wTitle: number = this.content_width - width - gap;
		let hTitle: number = 70;
		this.strokeColor('#737373').lineWidth(2);
		this.rect(xTitle, y, wTitle, hTitle).stroke();

		this.registerFont('DynaPuff','src/lib/assets/fonts/DynaPuff-VariableFont.ttf');
		this.font('DynaPuff').fontSize(16);
		this.fillColor('#2acf90').text('latihan level 1', xTitle, y + 5, { align: 'center', height: hTitle });

		// Reset the font colour
		this.fillColor('black');

		this.font('Chilanka').fontSize(14);
		this.text('Solve the following questions by adding the numbers given.', x, y + 85, { align: 'center' })

		this.font('Helvetica').fontSize(12);
		
		this.moveDown(2);

		// Set the stroke color and line width for the border
		this.strokeColor('orange').lineWidth(3);

		// Draw a rounded rectangle
		const xAxis = 60;
		const yAxis = 190;
		const widthRect = 475;
		const heightRect = 590;
		const radius = 10;
		this.roundedRect(xAxis, yAxis, widthRect, heightRect, radius).stroke();

		// Reset the stroke color and line width
		this.strokeColor('black').lineWidth(1);

		this.image('src/lib/assets/stars/star-2.png', 540, 665, { align: 'right', width: 30 });
		this.image('src/lib/assets/stars/star-7.png', 540, 705, { align: 'right', width: 30 });
		this.image('src/lib/assets/stars/star-1.png', 540, 745, { align: 'right', width: 30 });

	}

	/**
	 * rindu org tu 💕, aloo takde reply - AHAHAHA kita perasan, hihihi 🥰 haa tu lah haritu main2 lagi tanya apa maksud emoji 
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
				operation === '+' ? num1 + num2 : operation === '-' ? num1 - num2 : num1 * num2;

			this.text(result.toString(), content_x, content_y + 55, {
				width: content_width,
				align: 'right'
			});
		}

		// const result = operation === '+' ? num1 + num2 : num1 - num2;
		// this.text(result.toString(), x+30, lineY + 10);
		// console.dir(lineY);
	}

	// async drawAnimal() {
	// 	this.image('src/lib/assets/animals/hard/t-rex.png', 0, 15, { width: 300 });
	// }
}
