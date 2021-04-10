const { exec } = require('child_process')

const runs = 100

const getInfo = () => {
	const arr = process.argv
	const hasInfo = arr.indexOf('--info')

	return hasInfo === -1
		? {
				run: 0,
				times: {},
				missing: [],
		  }
		: JSON.parse(decodeURIComponent(arr[hasInfo + 1]))
}

let { run, times, missing } = getInfo()

const packages = {
	crayon: 'crayon.js',
	chalk: 'chalk',
	ansiColors: 'ansi-colors',
	kleur: 'kleur',
}

if (run == 0) console.log('\x1b[33m⏱  Measuring package loading times\x1b[0m')

for (const name in packages) {
	const package = packages[name]
	try {
		times[name] ||= { time: 0, min: 9999, max: -9999 }
		const start = Date.now()
		require(package)
		const time = Date.now() - start
		times[name].min = Math.min(times[name].min, time)
		times[name].max = Math.max(times[name].max, time)
		times[name].time += time
	} catch (_err) {
		if (!missing.includes(name))
			console.log(`\t\x1b[31m✗\x1b[0m ${package} package is missing`)
		missing.push(name)
		continue
	}
}

if (run == runs) {
	for (const package in times) {
		const avg = times[package].time / runs
		const min = times[package].min
		const max = times[package].max
		console.log(
			`\t\x1b[32m✓\x1b[0m It took ${package} ${avg}ms ±${Math.abs(
				(avg - (max + min) / 2).toFixed(2)
			)}ms in average to load`
		)
	}
	return
} else {
	++run
	exec(
		`node test/require-times.js --info ${encodeURIComponent(
			JSON.stringify({ run, times, missing })
		)}`,
		(err, output, stderr) => {
			if (stderr || err) {
				console.log(stderr || err.message)
				return
			}
			process.stdout.write(output)
		}
	)
}
