'use strict'
import { exec as _exec } from 'child_process'
import { existsSync, promises as fs } from 'fs'
import { Dirent } from 'node:fs'
import uglifyjs from 'uglify-js'
import { promisify } from 'util'
const exec = promisify(_exec)

let checksAmount = 0
let checkedFiles = {
	passed: 0,
	failed: 0,
}

let dir = './'

const commentRegex = /(\/\/.+\n)|(\/\*(.|\n)*\*\/)/g
const importRegex =
	/import[\S\s]+?\s?from\s?("|'|`)((\.|\.\.)\/)+(.+(?<!\.js))\1/
const exportsRegex = /exports\s?=.+(;|\s|$)/
const jsFileRegex = /^.*.js*$/

const checkmark = '\x1b[32m✓\x1b[0m'
const crossmark = '\x1b[31m✗\x1b[0m'

console.log(`📝 \x1b[34mParsing \x1b[1mtsconfig.json\x1b[0m`)

fs
	.readFile('tsconfig.json', { encoding: 'utf-8' })
	.then(async (data) => {
		data = data.replace(commentRegex, '')

		checksAmount = 1
		const tsconfig = (() => {
			try {
				return JSON.parse(data)
			} catch (error) {
				return rejectOperation(error), {}
			}
		})()

		if (tsconfig?.compilerOptions) passOperation('Parsed tsconfig.json')

		dir =
			'./' + ((tsconfig.compilerOptions && tsconfig.compilerOptions.outDir) || '')

		checksAmount = 2
		console.log(`⚙️ \x1b[34m Compiling project\x1b[0m`)

		if (existsSync(dir)) {
			if (
				!(await fs
					.rm(dir, { recursive: true })
					.then(() => passOperation(`Deleted ${dir}`, 'initial cleaning'))
					.catch((error) =>
						rejectOperation(`Failed deleting ${dir}:\n`, error.message)
					))
			)
				return summary()
		} else passOperation(`Skipped ${dir} deletion`, `doesn't exist`)

		if (
			!(await exec('tsc')
				.then(() => passOperation(`Compiled ${dir}`))
				.catch((error) =>
					rejectOperation(`Failed compiling ${dir}:\n`, error.message)
				))
		)
			return

		console.log(
			`📦 \x1b[34mBundling \x1b[1m${dir}\x1b[0m\x1b[34m directory\x1b[0m`
		)

		fs
			.readdir(dir, {
				encoding: 'utf-8',
				withFileTypes: true,
			})
			.then((files) => {
				const jsFiles = files.filter((file) => jsFileRegex.test(file.name))
				checksAmount = jsFiles.length
				jsFiles.forEach(minifyFile)
			})
			.catch((error) => {
				console.log(error)
			})
	})
	.catch((error) => {
		console.log(`\t ${crossmark} Failed loading tsconfig.json file:\n`, error)
	})

const minifyFile = async (file: Dirent) => {
	const fileDir = `${dir}/${file.name}`

	let fileContent = (await fs.readFile(fileDir)).toString()

	let importMatches = fileContent.match(importRegex)
	while (importMatches?.length) {
		const importMatch = importMatches[0]
		const relativePath = importMatches[2]
		const importedFile = importMatches[4]

		fileContent = fileContent.replace(
			importMatch,
			importMatch.replace(
				relativePath + importedFile,
				`${relativePath}${importedFile}.js`
			)
		)

		importMatches = fileContent.match(importRegex)
	}

	let exportsMatches = fileContent.match(exportsRegex)
	while (exportsMatches?.length) {
		fileContent = fileContent.replace(exportsMatches[0], '')
		exportsMatches = fileContent.match(exportsRegex)
	}

	const minifiedContent = uglifyjs.minify(fileContent, {
		compress: {
			dead_code: true,
			loops: true,
			strings: true,
			varify: false,
			join_vars: false,
			reduce_vars: true,
		},
		sourceMap: false,
	})

	if (minifiedContent.error) {
		fs.writeFile(fileDir, fileContent).catch(() => {})
		return rejectOperation(
			`Failed minifying ${fileDir}`,
			minifiedContent.error.message
		)
	}

	if (minifiedContent.code === '') {
		return fs
			.unlink(fileDir)
			.then(() => passOperation(`Deleted ${fileDir}`, 'empty file'))
			.catch((error) => rejectOperation(`Failed deleting ${fileDir}: \n`, error))
	}

	fs
		.writeFile(fileDir, minifiedContent.code)
		.then(() => passOperation(`Minified ${fileDir}`))
		.catch((error) => rejectOperation(`Failed minifying ${fileDir}:\n`, error))
}

const rejectOperation = (operation: string, reason?: string) => {
	++checkedFiles.failed
	console.log(`\t${crossmark} ${operation}  ${reason ? `(${reason})` : ''}:`)
	if (checkedFiles.passed + checkedFiles.failed >= checksAmount) summary()
	return false
}

const passOperation = (operation: string, reason?: string) => {
	++checkedFiles.passed
	console.log(`\t${checkmark} ${operation} ${reason ? `(${reason})` : ''}`)
	if (checkedFiles.passed + checkedFiles.failed >= checksAmount) summary()
	return true
}

const summary = () => {
	const { passed } = checkedFiles
	const passedAll = passed >= checksAmount
	console.log(
		`\t${' -'.repeat(12)}\n\t${
			passedAll ? checkmark : crossmark
		} ${passed}/${checksAmount} operations passed`
	)

	checkedFiles.passed = 0
	checkedFiles.failed = 0
}
