interface Packages {
	[name: string]: string
}

interface RunInfo {
	ts: boolean
	turn: number
	times: {
		[name: string]: {
			value: number
			min: number
			max: number
		}
	}
	missing: string[]
}

const turns = 100

const packages = {
	crayon: 'crayon.js',
	chalk: 'chalk',
	ansiColors: 'ansi-colors',
	kleur: 'kleur',
} as Packages

const fs = require('fs')
const { exec, execSync } = require('child_process')

const encodeRunInfo = (info: RunInfo): string =>
	encodeURIComponent(JSON.stringify(info))
const decodeRunInfo = (codedInfo: string): RunInfo =>
	JSON.parse(decodeURIComponent(codedInfo))

const getCurrentInfo = (
	arr = process.argv,
	info = arr[arr.indexOf('--info') + 1]
): RunInfo =>
	info.includes('node')
		? {
				ts: false,
				turn: 0,
				missing: [],
				times: {},
		  }
		: decodeRunInfo(info)

const info = getCurrentInfo()

if (process.argv[0].includes('ts-node')) {
	info.ts = true
	process.stdout.write('\rTranspiling to JavaScript...')
	execSync(`tsc ./test/require-times.ts`, {
		stdio: [],
	})
	process.stdout.write('\rTranspiled successfully       \n')
}

if (info.turn == 0)
	console.log('\x1b[33m⏱  Measuring package loading times\x1b[0m')

for (const id in packages) {
	const pkg = packages[id]

	try {
		const start = Date.now()
		const loaded = require(pkg)
		const time = Date.now() - start

		info.times[id] ||= { value: 0, min: 999, max: 0 }

		info.times[id].value += time
		info.times[id].max = Math.max(info.times[id].max, time)
		info.times[id].min = Math.min(info.times[id].min, time)
	} catch (_) {
		if (!info.missing.includes(id)) {
			console.log(`\t\x1b[31m✗\x1b[0m ${id} is missing`)
			info.missing.push(id)
		}
	}
}

++info.turn
if (info.turn < turns) {
	exec(
		`node ./test/require-times.js --info ${encodeRunInfo(info)}`,
		(err: Error, output: string, stderr: string) => {
			if (stderr || err) {
				console.log(stderr || err.message)
				return
			}
			process.stdout.write(output)
		}
	)
} else {
	for (const id in info.times) {
		const pkgTime = info.times[id]

		if (!pkgTime) continue

		const avg = pkgTime.value / turns
		const min = pkgTime.min
		const max = pkgTime.max

		console.log(
			`\t\x1b[32m✓\x1b[0m It took ${id} ${avg}ms ±${Math.abs(
				avg - (max + min) / 2
			).toFixed(2)}ms in average to load`
		)
	}

	if (info.ts) fs.unlinkSync('./test/require-times.js')
}
