# enhanced-promises

# Methods
Promise.forEach = async fns => {
	const results = [];
	const run = async () => {
		const fn = fns.shift();
		const result = await fn();
		results.push(result);
		if(fns.length > 0) await run();
	}
	await run();
	return results;
}

Promise.map = async promisesMap => {
	const promises = [];
	const names = [];
	Object.entries(promisesMap).forEach(([name, promise]) => {
		promises.push(promise);
		names.push(name);
	});
	const results = await Promise.all(promises);
	const resultsMap = {}
	results.forEach((result, index) => {
		const name = names[index];
		resultsMap[name] = result;
	});
	return resultsMap;
}

# How to use
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
