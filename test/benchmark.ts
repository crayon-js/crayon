import crayon from 'crayon.js'
import chalk from 'chalk'
import ansiColors from 'ansi-colors'
import kleur from 'kleur'

const benchSettings = {
	iterations: 100,
	repeats: 1000,
}

interface BenchFunction extends Function {
	id: string
	time: number
	fluctuation: number
}
interface BenchResult {
	bench: Bench
	func: BenchFunction
}

interface BenchResults {
	[id: string]: BenchResult
}

class Bench {
	funcs: BenchFunction[]
	id: string

	static compare(...benches: Bench[]) {
		const results: BenchResults = {}

		benches.forEach((bench) => {
			bench.funcs.forEach((func) => {
				results[func.id] ||= { func: func, bench: bench }
				results[func.id] =
					results[func.id].func.time > func.time
						? { func: func, bench: bench }
						: results[func.id]
			})
		})

		for (const id in results) {
			const fastest = results[id]

			let result = crayon`\n⚡ {yellow {bold ${fastest.bench.id}}} {green was the fastest in {bold {italic ${fastest.func.id}}} test}\n`

			const tempBenches = Array.from(benches)
			tempBenches.splice(tempBenches.indexOf(fastest.bench), 1)

			tempBenches.forEach((bench: Bench) => {
				const time = bench.funcs.filter((b) => b.id == id)[0].time
				const delta = time - fastest.func.time
				const percentageDiff = Math.abs(
					100 - (time / fastest.func.time) * 100
				).toFixed(2)
				result += crayon`\t{cyan ➜} Faster than {yellow {bold ${bench.id}}} by {bold ${percentageDiff}%} (Δ ${delta}ms)\n`
			})

			console.log(result)
		}
	}

	constructor(id: string, funcs: BenchFunction[]) {
		this.id = id
		this.funcs = funcs
	}

	run() {
		return new Promise<boolean>((resolve) => {
			console.log(
				crayon`{blue ⏱  Starting benchmark of} {yellow {bold ${this.id}}}`
			)

			const check = async (index: number) => {
				if (index >= this.funcs.length) {
					resolve(true)
					return
				}

				const func = this.funcs[index]
				const start = Date.now()
				let end
				;[end, func.fluctuation] = await func()
				func.time = end - start

				console.log(
					crayon`\t{green {bold ✓}} Finished {bold ${func.id}} task in {bold {cyan ${
						func.time
					}ms}} ± ${((func.fluctuation / func.time) * 100).toFixed(
						2
					)}% | {bold ${Math.round(
						(benchSettings.iterations * benchSettings.repeats) / (func.time / 1000)
					)}ops/s}`
				)

				check(++index)
			}

			check(0)
		})
	}
}

const generateTest = (
	...objects: {
		id: string
		func: (i: number) => void
		endFunc?: () => void
	}[]
): BenchFunction[] => {
	const functions: BenchFunction[] = []
	for (const object of objects) {
		const benchFunc = () => {
			let min = Date.now() * 100,
				max = 0

			for (let r = 0; r < benchSettings.repeats; ++r) {
				const start = Date.now()
				for (let i = 0; i < benchSettings.iterations; ++i) object.func(i)
				min = Math.min(Date.now() - start, min)
				max = Math.max(Date.now() - start, max)
			}

			if (typeof object.endFunc === 'function') object.endFunc()

			const fluctuation = Math.abs(max - min)
			return [Date.now(), fluctuation]
		}

		benchFunc.time = 0
		benchFunc.id = object.id
		benchFunc.fluctuation = 0
		functions.push(benchFunc)
	}

	return functions
}

const testPhrase = 'This is test phrase'
const checkmark = '\t\x1b[92m✓\x1b[0m '

//#region kleur tests
const kleurTests = generateTest({
	id: 'access time',
	func: (i: number) => kleur.bgBlue().underline().bold().red(i),
	endFunc: () =>
		console.log(checkmark + kleur.bgBlue().underline().bold().red(testPhrase)),
})
const kleurBench = new Bench('kleur', kleurTests)
//#endregion

//#region crayon func tests
const crayonFuncTests = generateTest({
	id: 'access time',
	func: (i: number) =>
		crayon.keyword('bgBlue').keyword('underline').keyword('bold').red(i),
	endFunc: () =>
		console.log(
			checkmark +
				crayon
					.keyword('bgBlue')
					.keyword('underline')
					.keyword('bold')
					.red(testPhrase)
		),
})
const crayonFuncBench = new Bench('crayon (func)', crayonFuncTests)
//#endregion

//#region compatible libs chain tests
const testLibs: { [name: string]: any } = { crayon, chalk, ansiColors } //libs with compatible API
const libBenches: Bench[] = []
for (const name in testLibs) {
	const lib = testLibs[name as string]
	libBenches.push(
		new Bench(
			name,
			generateTest({
				id: 'access time',
				func: (i: number) => lib.bgBlue.red.underline.bold(i),
				endFunc: () =>
					console.log(checkmark + lib.bgBlue.red.underline.bold(testPhrase)),
			})
		)
	)

	const cached = (lib === crayon ? lib() : lib).bgBlue.underline.bold.red
	libBenches.push(
		new Bench(
			`${name} (cached)`,
			generateTest({
				id: 'access time',
				func: (i: number) => cached(i),
				endFunc: () => console.log(checkmark + cached(testPhrase)),
			})
		)
	)
}
//#endregion

//#region compatible libs literal templates tests
const literalTestLibs: { [name: string]: any } = { crayon, chalk } //libs with compatible API
const literalLibBenches: Bench[] = []
for (const name in literalTestLibs) {
	const lib = literalTestLibs[name as string]
	literalLibBenches.push(
		new Bench(
			`${name} (literal template)`,
			generateTest({
				id: 'access time',
				func: (i: number) => lib`{bgBlue {red {underline {bold ${i}}}}}`,
				endFunc: () =>
					console.log(
						checkmark + lib`{bgBlue {red {underline {bold ${testPhrase}}}}}`
					),
			})
		)
	)
}
//#endregion

const chainBenches: Bench[] = [...libBenches, crayonFuncBench, kleurBench]
Promise.resolve().then(async () => {
	console.log(crayon`{bold Comparing performance of chaining API's}`)
	for (const bench of chainBenches) await bench.run()
	Bench.compare(...chainBenches)

	console.log(crayon`{bold Comparing performance of ES6 literal templates}`)
	for (const bench of literalLibBenches) await bench.run()
	Bench.compare(...literalLibBenches)
})
