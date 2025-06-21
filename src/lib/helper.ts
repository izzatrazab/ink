/**
 * @var digits number of digits the return number should have
 */
export function getRandomNumber(digits: number): number {
	if (digits <= 0) return 0;
	const min: number = 10 ** (digits - 1);
	const max: number = 10 ** digits - 1;

	return Math.floor(Math.random() * (max - min + 1) + min);
}
