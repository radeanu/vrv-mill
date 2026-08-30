export function isNum(val: unknown): val is number {
	return Number.isFinite(val);
}

export function waitFor(ms = 2000) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(null);
		}, ms);
	});
}

export function splitIntoChunks<T>(arr: T[], numChunks: number) {
	const chunks: T[][] = [];
	const baseSize = Math.floor(arr.length / numChunks);
	const remainder = arr.length % numChunks;
	let start = 0;
	for (let i = 0; i < numChunks; i++) {
		let chunkSize = baseSize + (i < remainder ? 1 : 0);
		chunks.push(arr.slice(start, start + chunkSize));
		start += chunkSize;
	}
	return chunks;
}

export function splitIntoChunksByLimit<T>(arr: T[], chunkLimit: number) {
	const chunks: T[][] = [];
	let start = 0;
	for (let i = 0; i < arr.length; i += chunkLimit) {
		const sliceIdx = start + chunkLimit;
		chunks.push(arr.slice(start, sliceIdx));
		start = sliceIdx;
	}
	return chunks;
}

export function roundToDecimal(number: number, decimals: number) {
	const factor = Math.pow(10, decimals);
	return Math.round(number * factor) / factor;
}
