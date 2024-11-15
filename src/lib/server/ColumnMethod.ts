import PDFDocument from 'pdfkit';

enum DrillTypes {
	Addition = '+',
	Subtraction = '-',
	Multiplication = '*'
}

/**
 * custom class extending PDFDocument with additional mathematical drawings.
 */
export default class ColumnMethod extends PDFDocument {
	/** x coordinate after the left margin */
	public origin_x: number = 0;
	/** y coordinate after the top margin */
	public origin_y: number = 0;
	/** page height minus top margin and bottom margin */
	public content_height: number = 0;
	/** page width minus left margin and right margin */
	public content_width: number = 0;
	/** array containing first number in the column method */
	public array_num_1: Array<number> = [];
	/** array containing second number in the column method */
	public array_num_2: Array<number> = [];

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
		if (hasTitle){
			this.addTitle(this.x, this.y);
			this.displayCartoonImage();
		}
	}

	/** header includes name, and score */
	addHeader(x: number, y: number) {

		this.registerFont('Chilanka','src/lib/assets/fonts/Chilanka-Regular.ttf');
		this.font('Chilanka').fontSize(14);
		this.text('Name: ___________________________________________________', { align: 'left' });
		this.fontSize(9).fillColor('grey').text('Nama:', { align: 'left' });

		this.font('Chilanka').fontSize(14).fillColor('black');
		this.text('Marks: _______/25', x, y, { align: 'right' });
		this.fontSize(9).fillColor('grey').text('Markah:', 423, y+15.5);

		this.font('Chilanka').fontSize(14).fillColor('black');

		// Reset the value of x
		this.x = this.origin_x;

		this.moveDown(1);
	}

	/** title includes cartoon image, and title */
	addTitle(x: number, y: number) {

		let width: number = 90;		
		let gap: number = 10;
		let xTitle: number = x + width + 3*(gap);
		let wTitle: number = this.content_width - width - 3*(gap);
		let hTitle: number = 70;
		this.strokeColor('#737373').lineWidth(2);
		this.rect(xTitle, y, wTitle, hTitle).stroke();

		this.registerFont('DynaPuff','src/lib/assets/fonts/DynaPuff-VariableFont.ttf');
		this.font('DynaPuff').fontSize(16);
		this.fillColor('#2acf90').text('Latihan: Tahap 1', xTitle, y + 5, { align: 'center', height: hTitle });
		this.fontSize(9).fillColor('grey').text('Worksheet: Level 1', xTitle, y+23, { align: 'center', height: hTitle });

		this.font('Chilanka').fontSize(14).fillColor('black');
		this.text('Solve the following questions using the addition function.', x, y + 85, { align: 'center' })
		this.fontSize(10).fillColor('grey').text('Selesaikan soalan-soalan berikut dengan menggunakan fungsi tambah.', x, y + 100.5, { align: 'center' })

		this.font('Helvetica').fontSize(12).fillColor('black');
		
		this.moveDown(1);

		// Set the stroke color and line width for the border
		this.strokeColor('orange').lineWidth(3);

		// Draw a rounded rectangle
		const xAxis = 60;
		const yAxis = 209;
		const widthRect = 475;
		const heightRect = 565;
		const radius = 10;
		this.roundedRect(xAxis, yAxis, widthRect, heightRect, radius).stroke();

		// Reset the stroke color and line width
		this.strokeColor('black').lineWidth(1);

		// star images
		this.image('src/lib/assets/stars/star-8.png', 540, 665, { align: 'right', width: 30 });
		this.image('src/lib/assets/stars/star-9.png', 540, 705, { align: 'right', width: 30 });
		this.image('src/lib/assets/stars/star-10.png', 540, 745, { align: 'right', width: 30 });

	}

	/**
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
	}

	/**
	 * @param x coordinate x
	 * @param y coordinate y
	 * @param num1 first number in the equation
	 * @param num2 second number in the equation
	 * @param operation the operation symbol (+, -, x)
	 * @param width width of the column method (box ??, ibarat mcm kotak).
	 */
	printAnswers (
		x: number,
		y: number,
		num1: number,
		num2: number,
		operation: string,
		width: number,
		questionNumber: number,
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

		// Calculate and write the answer
		const result =
			operation === '+' ? num1 + num2 : operation === '-' ? num1 - num2 : num1 * num2;

		this.text(result.toString(), content_x + 30, content_y, {
				width: content_width,
				align: 'left'
		});
	}

	displayCartoonImage() {
		let images: string[] = [];
		let selectedImage: string | null = null;
		
		const allImagesPath = import.meta.glob('/src/lib/assets/animals/easy/*.png');

		for(const path in allImagesPath) {
			images.push(path.replace(/^\/src/, 'src')); // replace: to remove the '/' in front
		}

		const randomIndex = Math.floor(Math.random() * images.length);
		selectedImage = images[randomIndex];
		console.log('path selected image:', selectedImage);

		this.image(selectedImage, this.x, this.y - 136, { align: 'right', height: 90 });

	}

}
