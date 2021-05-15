import { createWriteStream, existsSync, PathLike, promises as fs } from 'fs'
import https from 'https'

const colors = ['red', 'orange', 'yellowgreen', 'green']

const testsPassed =
	existsSync('./test-passed') &&
	(await fs
		.readFile('./test-passed')
		.then((buffer) => JSON.parse(buffer.toString())))

const testsColor = testsPassed ? 'lightgreen' : 'red'
const testsMessage = testsPassed ? 'passing' : 'failing'

const testsBadge = encodeURI(
	`https://img.shields.io/badge/tests-${testsMessage}-${testsColor}`
)

const coverageSummary = JSON.parse(
	(await fs.readFile('./coverage/coverage-summary.json')).toString()
)

let coveragePercentage = 0
let tests = 0

for (const test in coverageSummary.total) {
	coveragePercentage += coverageSummary.total[test].pct
	++tests
}

const coverage = coveragePercentage / tests

const coverageColor =
	coverage >= 100
		? 'lightgreen'
		: colors[Math.round((coverage / 100) * (colors.length - 1))]

const coverageBadge = encodeURI(
	`https://img.shields.io/badge/coverage-${coverage}%-${coverageColor}`
)

const download = (url: string, dest: PathLike) =>
	new Promise<void>((resolve, reject) => {
		const file = createWriteStream(dest)
		https.get(url, (response) => {
			response.pipe(file)
			file.on('finish', () => {
				file.close()
				resolve()
			})
			file.on('error', reject)
		})
	})

download(coverageBadge, './coverage-badge.svg')
download(testsBadge, './coverage-badge.svg')
