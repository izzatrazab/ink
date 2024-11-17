interface Difficulty {
	first_number_of_digits: number;
	second_number_of_digits: number;
}

const difficultyList: Map<string, Difficulty> = new Map();
difficultyList.set('easy', {
	first_number_of_digits: 2,
	second_number_of_digits: 1
});
difficultyList.set('medium', {
	first_number_of_digits: 3,
	second_number_of_digits: 2
});
difficultyList.set('hard', {
	first_number_of_digits: 4,
	second_number_of_digits: 3
});

export { difficultyList };
