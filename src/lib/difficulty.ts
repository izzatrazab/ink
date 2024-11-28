interface Difficulty {
	first_number_of_digits: number;
	second_number_of_digits: number;
	level_eng: string;
	level_malay: string;
}

const difficultyList: Map<string, Difficulty> = new Map();
difficultyList.set('easy', {
	first_number_of_digits: 2,
	second_number_of_digits: 1,
	level_eng: 'Easy',
	level_malay: 'Mudah'
});
difficultyList.set('medium', {
	first_number_of_digits: 3,
	second_number_of_digits: 2,
	level_eng: 'Medium',
	level_malay: 'Sederhana'
});
difficultyList.set('hard', {
	first_number_of_digits: 4,
	second_number_of_digits: 3,
	level_eng: 'Hard',
	level_malay: 'Sukar'
});

export { difficultyList };
