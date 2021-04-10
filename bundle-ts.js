'use strict'
/*
 * This script minifies javascript files stored in ./lib
 */

const uglifyjs = require('uglify-js')
const fs = require('fs')

const inputDir = './lib'
const outputDir = './lib'

fs.readdir(inputDir, { withFileTypes: true }, (err, files) => {
	if (err) {
		console.log(err.message)
		return
	}

	const jsFiles = files.filter((file) => /.*.js*$/.test(file.name))

	jsFiles.forEach((file) => {
		const code = uglifyjs.minify(
			fs.readFileSync(`${inputDir}/${file.name}`).toString(),
			{
				compress: true,
				sourceMap: false,
			}
		)

		if (!code.error) {
			fs.writeFileSync(`${outputDir}/${file.name}`, code.code)
			console.log(`Minified ${file.name}`)
		} else {
			console.log(`Couldn't minify ${file.name}`)
		}
	})
})
