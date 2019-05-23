// enrich promises
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

// Promises.map({
// 	a: fn(),
// 	b: fn2(),
// });

// enrich objects
Object.prototype.entries = function(fn){
	Object.entries(this).forEach(([key, value]) => fn([key, value]));
}
Object.prototype.values = function(fn){
	Object.values(this).forEach(value => fn(value));
}
Object.prototype.keys = function(fn){
	Object.keys(this).forEach(key => fn(key));
}
Object.prototype.getProp = function(prop, _default){
	parent = this;
	prop = typeof prop === 'string' ? prop.split('.') : '';
	while(prop.length > 0){
		parent = parent[prop.shift()];
		if(!parent){
			return _default !== undefined ? _default : undefined;
		}
	}
	return parent;
}
Object.prototype.setProp = function(prop, value){
	parent = this;
	const initiaParent = parent;
	const props = typeof prop === 'string' ? prop.split('.') : [prop];
	while(props.length > 0){
		if(props.length == 1){
			parent[props.shift()] = value;
		}else{
			const prop = props.shift();
			parent[prop] = parent[prop] || {};
			parent = parent[prop];
		}
	}
	return initiaParent;
}
Object.prototype.incProp = function(prop, inc){
	parent = this;
	const value = this.getProp(prop, 0);
	const newValue = value + inc;
	this.setProp(prop, newValue);
	return newValue;
}
Object.prototype.pushProp = function(prop, data){
	parent = this;
	const value = this.getProp(prop, []);
	const newValue = [
		...value,
		data,
	];
	this.setProp(prop, newValue);
	return newValue;
}
Object.prototype.defaultProp = function(prop, data){
	parent = this;
	const value = this.getProp(prop);
	if(value === undefined){
		this.setProp(prop, data);
		return data;
	}
	return value;
}

// enrich arrays
Array.prototype.obj = function(fn){
	const map = {}
	this.forEach((item, i) => {
		const obj = fn(item, i);
		obj.entries(([key, value]) => {
			map[key] = value;
		});
	});
	return map;
}
Array.prototype.getProp = function(prop, _default){
	parent = this;
	prop = typeof prop === 'string' ? prop.split('.') : '';
	while(prop.length > 0){
		parent = parent[prop.shift()];
		if(!parent){
			return _default !== undefined ? _default : undefined;
		}
	}
	return parent;
}
Array.prototype.setProp = function(prop, value){
	parent = this;
	const initiaParent = parent;
	const props = typeof prop === 'string' ? prop.split('.') : [prop];
	while(props.length > 0){
		if(props.length == 1){
			parent[props.shift()] = value;
		}else{
			const prop = props.shift();
			parent[prop] = parent[prop] || {};
			parent = parent[prop];
		}
	}
	return initiaParent;
}
Array.prototype.incProp = function(prop, inc){
	parent = this;
	const value = this.getProp(prop, 0);
	const newValue = value + inc;
	this.setProp(prop, newValue);
	return newValue;
}
Array.prototype.pushProp = function(prop, data){
	parent = this;
	const value = this.getProp(prop, []);
	const newValue = [
		...value,
		data,
	];
	this.setProp(prop, newValue);
	return newValue;
}
Array.prototype.defaultProp = function(prop, data){
	parent = this;
	const value = this.getProp(prop);
	if(value === undefined){
		this.setProp(prop, data);
		return data;
	}
	return value;
}
