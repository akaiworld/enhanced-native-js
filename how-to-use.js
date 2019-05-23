// How to use
const {a, b} = await Promise.map({
	a: (async () => {
		return new Promise(resolve => {
			setTimeout(() => {
				console.log('a')
				resolve('a value')
			}, 1000);
		});
	})(),
	b: (async () => {
		return new Promise(resolve => {
			setTimeout(() => {
				console.log('b')
				resolve('b value')
			}, 1000);
		});
	})(),
});

Promise.forEach([1,2,3].map(item => async () => {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log('Value: ', item)
			resolve(item)
		}, 1000);
	});
}));
