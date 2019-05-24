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
// Promise.forEach([
// 	async () => fn1(),
// 	async () => fn2(),
// 	async () => fn3(),
// ]);

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
// Promise.map({
// 	a: fn(),
// 	b: fn2(),
// });

// enrich objects
Object.prototype.entries = function(fn){
	return Object.entries(this).map(([key, value], i) => fn([key, value], i));
}
Object.prototype.values = function(fn){
	return Object.values(this).map((value, i) => fn(value, i));
}
Object.prototype.keys = function(fn){
	return Object.keys(this).map((key, i) => fn(key, i));
}
Object.prototype.objEntries = function(fn){
	const map = {}
	Object.entries(this).forEach(([key, value], i) => {
		const obj = fn([key, value], i);
		obj.entries(([key, value]) => {
			map[key] = value;
		});
	});
	return map;
}
Object.prototype.objValues = function(fn){
	const map = {}
	Object.values(this).forEach((value, i) => {
		const obj = fn(value, i);
		obj.entries(([key, value]) => {
			map[key] = value;
		});
	});
	return map;
}
Object.prototype.objKeys = function(fn){
	const map = {}
	Object.keys(this).forEach((key, i) => {
		const obj = fn(key, i);
		obj.entries(([key, value]) => {
			map[key] = value;
		});
	});
	return map;
}
Object.prototype.getEntries = function(filterFn){
	const entries = Object.entries(this);
	return filterFn ? entries.filter(filterFn) : entries;
}
Object.prototype.getValues = function(filterFn){
	const values = Object.values(this);
	return filterFn ? values.filter(filterFn) : values;
}
Object.prototype.getKeys = function(filterFn){
	const keys = Object.keys(this);
	return filterFn ? keys.filter(filterFn) : keys;
}
// obj.getKeys()
// obj.getKeys(key => key != 123)

Object.prototype.calcEntries = function(...props){
	return this.getEntries().calc(...props);
}
Object.prototype.calcValues = function(...props){
	return this.getValues().calc(...props);
}
Object.prototype.calcKeys = function(...props){
	return this.getKeys().calc(...props);
}
// obj.calcKeys((data, item) => {
// 	data.push(item);
// })
// obj.calcKeys({}, (data, item, i) => {
// 	data[i] = item;
// })

Object.prototype.findEntry = function(fn){
	return this.getEntries().find(fn);
}
// obj.findEntry(([key, value], i) => key == 'b')
Object.prototype.findValue = function(fn){
	return this.getValues().find(fn);
}
// obj.findValue((value, i) => value == 'b')
Object.prototype.findKey = function(fn){
	return this.getKeys().find(fn);
}
// obj.findKey((key, i) => key == 'b')
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
Array.prototype.calc = function(...props){
	const fn = props.pop();
	value = props[0] || [];
	this.forEach((item, i) => {
		const result = fn(value, item, i, this);
		if(result !== undefined){
			value = result;
		}
	});
	return value;
}
// arr.calc((data, item) => {
// 	data.push(item)
// })
// arr.calc({}, (data, item, i) => {
// 	data[i] = item;
// })
