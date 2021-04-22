'use strict'
import uglifyjs from 'uglify-js'
import { promises as fs } from 'fs'

let fileAmount = 0
let checkedFiles = {
	passed: 0,
	failed: 0,
}

let dir = './'

const commentRegex = /(\/\/.+\n)|(\/\*(.|\n)*\*\/)/g
const importRegex = /import\s.+\sfrom\s("|'|`)(.+(?<!\.js))\1/
const exportsRegex = /exports\s?=.+(;|\s|$)/
const jsFileRegex = /^.*.js*$/

const checkmark = '\x1b[32m✓\x1b[0m'
const crossmark = '\x1b[31m✗\x1b[0m'

fs
	.readFile('tsconfig.json', { encoding: 'utf-8' })
	.then((data) => {
		try {
			data = data.replace(commentRegex, '')
			const tsconfig = JSON.parse(data)

			if (!tsconfig.compilerOptions) throw 'No compilerOptions object'
			dir = './' + (tsconfig.compilerOptions.outDir || '')

			console.log(`📦 \x1b[34mBundling ${dir} directory\x1b[0m`)

			fs
				.readdir(dir, {
					encoding: 'utf-8',
					withFileTypes: true,
				})
				.then((files) => {
					const jsFiles = files.filter((file) => jsFileRegex.test(file.name))
					fileAmount = jsFiles.length
					jsFiles.forEach(minifyFile)
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (err) {
			console.log(`\t${crossmark} Could not parse tsconfig.json`)
			throw err
		}
	})
	.catch((error) => {
		console.log(`\t ${crossmark} Failed loading tsconfig.json file:\n`, error)
	})

const minifyFile = async (file) => {
	const fileDir = `${dir}/${file.name}`

	let fileContent = (await fs.readFile(fileDir)).toString()

	let importMatches = fileContent.match(importRegex)
	while (importMatches?.length) {
		const importMatch = importMatches[0]
		const importedFile = importMatches[2]

		fileContent = fileContent.replace(
			importMatch,
			importMatch.replace(importedFile, importedFile + '.js')
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
		return rejectFile(fileDir, `minifying - ${minifiedContent.error}`)
	}

	if (minifiedContent.code === '') {
		fs
			.unlink(fileDir)
			.then(() => passFile(fileDir, 'deleted - empty file'))
			.catch((error) => rejectFile(fileDir, `deletion - ${error}`))
		return
	}

	fs
		.writeFile(fileDir, minifiedContent.code)
		.then(() => passFile(fileDir))
		.catch((error) => rejectFile(fileDir, `writing file - ${error}`))
}

const rejectFile = (fileDir, reason) => {
	++checkedFiles.failed
	console.log(
		`\t${crossmark} Couldn't minify ${fileDir}  ${reason ? `(${reason})` : ''}:`
	)
	if (checkedFiles.passed + checkedFiles.failed >= fileAmount) summary()
}

const passFile = (fileDir, reason) => {
	++checkedFiles.passed
	console.log(
		`\t${checkmark} Minified ${fileDir} ${reason ? `(${reason})` : ''}`
	)
	if (checkedFiles.passed + checkedFiles.failed >= fileAmount) summary()
}

const summary = () => {
	const { passed, failed } = checkedFiles
	const passedAll = passed >= fileAmount
	console.log(
		`\t${' -'.repeat(16)}\n\t${
			passedAll ? checkmark : crossmark
		} ${passed}/${fileAmount} operations on files passed`
	)
}
