import crayon = require('crayon.js')
import chalk = require('chalk')
import ansiColors = require('ansi-colors')
import kleur = require('kleur')

const benchSettings = {
	iterations: 1000,
	repeats: 100,
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

			let result = `⚡ ${
				crayon.yellow.bold(fastest.bench.id) +
				crayon.green(` was the fastest in ${fastest.func.id} test\n`)
			}`

			const tempBenches = Array.from(benches)
			tempBenches.splice(tempBenches.indexOf(fastest.bench), 1)

			tempBenches.forEach((bench) => {
				const time = bench.funcs.filter((o) => {
					if (o.id == id) return o
				})[0].time
				result += `\t${crayon.cyan('➜')} Faster than ${crayon.yellow.bold(
					bench.id
				)} by ${crayon.bold(
					`${(100 - (fastest.func.time / time) * 100).toFixed(2)}%\n`
				)}`
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
				crayon.blue(`⏱  Starting benchmark of `) + crayon.yellow.bold(this.id)
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
					`\r\t${crayon.bold.green('✓')} Finished ${func.id} task in ${crayon.bold(
						func.time + 'ms'
					)} ± ${((func.fluctuation / func.time) * 100).toFixed(2)}% | ${crayon.bold(
						String(
							Math.round(
								(benchSettings.iterations * benchSettings.repeats) / (func.time / 1000)
							)
						)
					)}ops/s`
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

const crayonFuncTests = generateTest(
	{
		id: 'access time',
		func: (i: number) =>
			crayon.keyword('bgBlue').keyword('underline').keyword('bold').red(i),
	},
	{
		id: 'render',
		func: (i: number) =>
			process.stdout.write(
				`\r${crayon.keyword('bgBlue').keyword('underline').keyword('bold').red(i)}`
			),
		endFunc: async () =>
			process.stdout.write(
				'\r' + ' '.repeat(String(benchSettings.iterations).length)
			),
	}
)
const crayonFuncBench = new Bench('crayon (func)', crayonFuncTests)

const testLibs: { [name: string]: any } = { crayon, chalk, ansiColors } //libs with compatible API
const libBenches: Bench[] = []
for (const name in testLibs) {
	const lib = testLibs[name as string]
	libBenches.push(
		new Bench(
			name,
			generateTest(
				{
					id: 'access time',
					func: (i: number) => lib.bgBlue.red.underline.bold(i),
				},
				{
					id: 'render',
					func: (i: number) =>
						process.stdout.write(`\r${lib.bgBlue.red.underline.bold(i)}`),
					endFunc: () =>
						process.stdout.write(
							'\r' + ' '.repeat(String(benchSettings.iterations).length)
						),
				}
			)
		)
	)

	const cached = (lib === crayon ? lib() : lib).bgBlue.underline.bold.red
	libBenches.push(
		new Bench(
			`${name} (cached)`,
			generateTest(
				{
					id: 'access time',
					func: (i: number) => cached(i),
				},
				{
					id: 'render',
					func: (i: number) => process.stdout.write(`\r${cached(i)}`),
					endFunc: () =>
						process.stdout.write(
							'\r' + ' '.repeat(String(benchSettings.iterations).length)
						),
				}
			)
		)
	)
}

const benches: Bench[] = [...libBenches, crayonFuncBench]

Promise.resolve().then(async () => {
	for (const bench of benches) await bench.run()
	Bench.compare(...benches)
})
