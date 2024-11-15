/**
 * Leeda's generate random number
 * @var digits number of digits the return number should have
 */
export function generateRandomNumber(digits: number): number {
	let min: number;
	let max: number;

	switch (digits) {
		/** utk default case, kita guna case 1 dulu.
		 * akan datang kalau nak guna jumlah digit yg lain boleh update nanti
		 */
		default:
		case 1:
			min = 1;
			max = 9;
			break;
		case 2:
			min = 10;
			max = 99;
			break;
		case 3:
			min = 100;
			max = 999;
			break;
	}

	return Math.floor(Math.random() * (max - min + 1) + min);
}
