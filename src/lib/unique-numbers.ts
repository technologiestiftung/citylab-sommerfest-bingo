function generateUniqueRandomNumbers(len: number): number[] {
	let arr: number[] = [];
	while (arr.length < len) {
		let r = Math.floor(Math.random() * 75) + 1;
		let exists = false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === r) {
				exists = true;
				break;
			}
		}
		if (!exists) arr.push(r);
	}
	return arr;
}
