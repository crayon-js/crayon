import { existsSync, promises as fs } from 'fs'

const colors = ['red', 'orange', 'yellowgreen', 'green']

const generateBadgeJSON = (label: string, message: string, color: string) =>
	JSON.stringify({
		schemaVersion: 1,
		label,
		message,
		color,
	})

if (!existsSync('./docs')) await fs.mkdir('./docs')
if (!existsSync('./docs/badges')) await fs.mkdir('./docs/badges')

const testsPassed =
	existsSync('./test-passed') &&
	(await fs
		.readFile('./test-passed')
		.then((buffer) => JSON.parse(buffer.toString())))

fs.writeFile(
	'./docs/badges/tests.json',
	generateBadgeJSON(
		'tests',
		testsPassed ? 'passing' : 'failing',
		testsPassed ? 'lightgreen' : 'red'
	)
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

const color =
	coverage >= 100
		? 'brightgreen'
		: colors[Math.round((coverage / 100) * (colors.length - 1))]

fs.writeFile(
	'./docs/badges/coverage.json',
	generateBadgeJSON('coverage', coverage.toString(), color)
)
