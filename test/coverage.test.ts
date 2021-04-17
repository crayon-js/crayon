import crayon = require('crayon.js')

test('color and attributes chaining', () =>
	expect(crayon.red.bgBlue.bold('test')).toBe(
		'\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m'
	))

test('keyword color and attributes chaining', () => {
	expect(crayon.keyword('red').keyword('bgBlue').keyword('bold')('test')).toBe(
		'\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m'
	)
})

test('template literal', () =>
	expect(crayon`{red {bgBlue {bold test}}}`).toBe(
		'\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m'
	))

test('multiline template literal', () =>
	expect(
		crayon`{red
			Test multiline literal
			{bold this text is bold {blue and this is blue}}
		}`
	).toBe(
		'\x1B[31m\t\t\tTest multiline literal\n' +
			'\t\t\t\x1B[1mthis text is bold \x1B[34mand this is blue\n' +
			'\t\t\x1B[0m'
	))

test('rgb->8bit color conversion', () => {
	crayon.colorSupport.trueColor = false
	expect(crayon.rgb(255, 127, 127)('test')).toBe('\x1B[38;5;213mtest\x1B[0m')
	crayon.colorSupport.trueColor = true
})

test('rgb->4bit color conversion', () => {
	crayon.colorSupport.trueColor = false
	crayon.colorSupport.highColor = false
	expect(crayon.rgb(255, 0, 255)('test')).toBe('\x1B[35mtest\x1B[0m')
	crayon.colorSupport.highColor = true
	crayon.colorSupport.trueColor = true
})

test('8bit->4bit color conversion', () => {
	crayon.colorSupport.highColor = false
	expect(crayon.ansi8(123)('test')).toBe('\x1B[36mtest\x1B[0m')
	crayon.colorSupport.highColor = true
})

test('8bit->3bit color conversion', () => {
	crayon.colorSupport.highColor = false
	crayon.colorSupport.fourBitColor = false
	expect(crayon.ansi8(123)('test')).toBe('\x1B[36mtest\x1B[0m')
	crayon.colorSupport.fourBitColor = true
	crayon.colorSupport.highColor = true
})

test('4bit->3bit color conversion', () => {
	crayon.colorSupport.fourBitColor = false
	expect(crayon.ansi4(9)('test')).toBe('\x1B[31mtest\x1B[0m')
	crayon.colorSupport.fourBitColor = true
})