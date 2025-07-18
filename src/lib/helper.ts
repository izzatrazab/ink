/**
 * @var digits number of digits the return number should have
 */
export function getRandomNumber(digits: number): number {
	if (digits <= 0) return 0;
	const min: number = 10 ** (digits - 1);
	const max: number = 10 ** digits - 1;

	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Fisher–Yates algorithm
 * @param array 
 * @returns 
 */
export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
