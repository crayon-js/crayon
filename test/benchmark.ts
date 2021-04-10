import chalk = require('chalk')
import ansiColors = require('ansi-colors')
import kleur = require('kleur')
import crayon = require('crayon.js')

const benchSettings = {
	iterations: 1000,
	repeats: 100,
}

interface BenchFunction extends Function {
	id: string
	time?: number
	fluctuation?: number
}

class Bench {
	funcs: BenchFunction[]
	id: string

	static compare(...benches: Bench[]) {
		let fastest: any = {}

		benches.forEach((bench) => {
			bench.funcs.forEach((func) => {
				fastest[func.id] ||= { f: func, b: bench }
				fastest[func.id] =
					fastest[func.id].f.time > func.time
						? { f: func, b: bench }
						: fastest[func.id]
			})
		})

		for (let fast in fastest) {
			const fastero = fastest[fast]

			let string = `⚡ ${
				crayon.yellow.bold(fastero.b.id) +
				crayon.green(` was the fastest in ${fastero.f.id} test\n`)
			}`

			const tempBenches = Array.from(benches)
			tempBenches.splice(tempBenches.indexOf(fastero.b), 1)

			tempBenches.forEach((bench) => {
				const time = (bench.funcs.filter((o) => {
					if (o.id == fast) return o
				}) as any)[0].time
				string += `\t${crayon.cyan('➜')} Faster than ${crayon.yellow.bold(
					bench.id
				)} by ${crayon.bold(
					`${(100 - (fastero.f.time / time) * 100).toFixed(2)}%\n`
				)}`
			})

			console.log(string)
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

const sleep = (time: number): Promise<any> =>
	new Promise((resolve) => setTimeout(resolve, time))

const generateTest = (
	...objects: { id: string; func: (i: number) => void; endFunc?: () => void }[]
): BenchFunction[] => {
	const funcs: BenchFunction[] = []
	for (const object of objects) {
		const benchFunc = async () => {
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
		benchFunc.id = object.id
		funcs.push(benchFunc)
	}

	return funcs
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
		endFunc: () =>
			process.stdout.write(
				'\r' + ' '.repeat(String(benchSettings.iterations).length)
			),
	}
)

const kleurTests = generateTest(
	{
		id: 'access time',
		func: (i: number) => kleur.red().bgBlue().underline().bold(i),
	},
	{
		id: 'render',
		func: (i: number) =>
			process.stdout.write(`\r${kleur.red().bgBlue().underline().bold(i)}`),
		endFunc: () =>
			process.stdout.write(
				'\r' + ' '.repeat(String(benchSettings.iterations).length)
			),
	}
)

const kleurBench = new Bench('kleur', kleurTests)
const crayonFuncBench = new Bench('crayon (func)', crayonFuncTests)

const testLibs = { chalk, crayon, ansiColors } //libs with compatible API
const libBenches = []
for (const name in testLibs) {
	const lib = testLibs[name]
	libBenches.push(
		new Bench(
			name,
			generateTest(
				{
					id: 'access time',
					func: (i: number) => lib.red.bgBlue.underline.bold(i),
				},
				{
					id: 'render',
					func: (i: number) =>
						process.stdout.write(`\r${lib.red.bgBlue.underline.bold(i)}`),
					endFunc: () =>
						process.stdout.write(
							'\r' + ' '.repeat(String(benchSettings.iterations).length)
						),
				}
			)
		)
	)

	const cached = (lib == crayon ? lib() : lib).red.bgBlue.underline.bold
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

Promise.resolve().then(async () => {
	const benches: Bench[] = [...libBenches, kleurBench, crayonFuncBench]

	for await (const bench of benches) bench.run()
	Bench.compare(...benches)
})
