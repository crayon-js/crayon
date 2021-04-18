import crayon = require('crayon.js')

crayon.config.optimizeStyles = {
	chain: true,
	literal: true,
}

test('color and attributes chaining', () =>
	expect(crayon.red.bgBlue.bold('test')).toMatch(
		'\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m'
	))

test('keyword color and attributes chaining', () =>
	expect(
		crayon.keyword('red').keyword('bgBlue').keyword('bold')('test')
	).toMatch('\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m'))

test('template literal', () =>
	expect(crayon`{red {bgBlue {bold test}}}`).toMatch(
		'\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m'
	))

test('multiline template literal', () =>
	expect(
		crayon`{red
			Test multiline literal
			{bold this text is bold {blue and this is blue}}
		}`
	).toMatch(
		'\x1B[31m\t\t\tTest multiline literal\n' +
			'\t\t\t\x1B[1mthis text is bold \x1B[34mand this is blue\x1B[0m\x1B[31m\n' +
			'\t\t\x1B[0m'
	))

test('rgb->8bit color conversion', () => {
	crayon.config.colorSupport.trueColor = false
	expect(crayon.rgb(255, 127, 127)('test')).toMatch('\x1B[38;5;213mtest\x1B[0m')
	crayon.config.colorSupport.trueColor = true
})

test('rgb->4bit color conversion', () => {
	crayon.config.colorSupport.trueColor = false
	crayon.config.colorSupport.highColor = false
	expect(crayon.rgb(255, 0, 255)('test')).toMatch('\x1B[35mtest\x1B[0m')
	crayon.config.colorSupport.highColor = true
	crayon.config.colorSupport.trueColor = true
})

test('8bit->4bit color conversion', () => {
	crayon.config.colorSupport.highColor = false
	expect(crayon.ansi8(123)('test')).toMatch('\x1B[36mtest\x1B[0m')
	crayon.config.colorSupport.highColor = true
})

test('8bit->3bit color conversion', () => {
	crayon.config.colorSupport.highColor = false
	crayon.config.colorSupport.fourBitColor = false
	expect(crayon.ansi8(123)('test')).toMatch('\x1B[36mtest\x1B[0m')
	crayon.config.colorSupport.fourBitColor = true
	crayon.config.colorSupport.highColor = true
})

test('4bit->3bit color conversion', () => {
	crayon.config.colorSupport.fourBitColor = false
	expect(crayon.ansi4(9)('test')).toMatch('\x1B[31mtest\x1B[0m')
	crayon.config.colorSupport.fourBitColor = true
})
