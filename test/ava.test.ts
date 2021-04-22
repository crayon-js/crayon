import test from 'ava'

import crayon, { optimizeStyles } from 'crayon.js'
import { CrayonStyle } from 'crayon.js/lib/types'

crayon.config.optimizeStyles = {
	chain: true,
	literal: true,
}

const errors: unknown[] = []
console.log = (...any: unknown[]) => errors.push(any) // disable logs

test('global config', (t) => {
	const crayonA = crayon()
	const crayonB = crayon()

	t.is(crayonA.config, crayonB.config)
	t.is(crayon.config, crayonA.config)
})

test("instancing doesn't return the same object", (t) => {
	t.not(crayon, crayon())
	t.not(crayon.instance(false, ''), crayon)
	t.not(crayon.instance(true, ''), crayon())
	t.not(crayon.clone(false), crayon)
})

test('no styling with no styles', (t) => {
	t.is(crayon('foo bar'), 'foo bar')
})

test('one style', (t) => {
	t.is(crayon.red('test'), '\x1b[31mtest\x1b[0m')
	t.is(crayon.bold('test'), '\x1b[1mtest\x1b[0m')
})

test('style chaining', (t) => {
	t.is(crayon.red.bgBlue.bold('test'), '\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m')
	t.is(crayon.bold.bgBlue.red('test'), '\x1B[1m\x1B[44m\x1B[31mtest\x1B[0m')
})

test('style nesting', (t) => {
	t.is(
		crayon.red(
			`red ${crayon.blue(
				`blue ${crayon.bold(
					`bold blue ${crayon.yellow('bold yellow')}`
				)} ${crayon.yellow('yellow')}`
			)} red`
		),
		'\x1B[31mred \x1B[34mblue \x1B[1mbold blue \x1B[33mbold yellow\x1B[0m\x1B[31m\x1B[34m \x1B[33myellow\x1B[0m\x1B[31m red\x1B[0m'
	)
})

test('keyword style chaining', (t) => {
	t.is(
		crayon.keyword('red').keyword('bgBlue').keyword('bold')('test'),
		'\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m'
	)
})

test('keyword style nesting', (t) => {
	t.is(
		crayon.keyword('red')(
			`red ${crayon.keyword('blue')(
				`blue ${crayon.keyword('bold')(
					`bold blue ${crayon.yellow('bold yellow')}`
				)}`
			)} ${crayon.yellow('yellow')} red`
		),
		'\x1B[31mred \x1B[34mblue \x1B[1mbold blue \x1B[33mbold yellow\x1B[0m\x1B[31m \x1B[33myellow\x1B[0m\x1B[31m red\x1B[0m'
	)
})

test('template literal', (t) => {
	t.is(crayon`{red {bgBlue {bold test}}}`, '\x1B[31m\x1B[44m\x1B[1mtest\x1B[0m')
	t.is(
		crayon`{red text ${0} ${false} test {bold ${2}}}`,
		'\x1B[31mtext 0 false test \x1B[1m2\x1B[0m'
	)
})

test('multiline template literal', (t) => {
	t.is(
		crayon`{red
			Test multiline literal
			{bold this text is bold {blue and this is blue}}
		}`,
		'\x1B[31m\t\t\tTest multiline literal\n' +
			'\t\t\t\x1B[1mthis text is bold \x1B[34mand this is blue\x1B[0m\x1B[31m\n' +
			'\t\t\x1B[0m'
	)
})

test('template literal nesting', (t) => {
	t.is(
		crayon`{red red {green green {bold bold} not bold} red}`,
		'\x1B[31mred \x1B[32mgreen \x1B[1mbold\x1B[0m\x1B[31m\x1B[32m not bold\x1B[0m\x1B[31m red\x1B[0m'
	)
})

test('stripped text', (t) => {
	t.is(crayon.strip(crayon.red('test')), 'test')
})

test('style caching', (t) => {
	const { bold, red } = crayon()
	const boldRed = crayon().bold.red
	const otherBoldRed = bold.red

	for (let i = 0; i < 2; ++i) {
		t.is(bold('test'), '\x1b[1mtest\x1b[0m')
		t.is(red('test'), '\x1b[31mtest\x1b[0m')
		t.is(boldRed('test'), '\x1b[1m\x1b[31mtest\x1b[0m')
		t.is(otherBoldRed('test'), '\x1b[1m\x1b[31mtest\x1b[0m')
	}
})

test('support different value types', (t) => {
	t.is(crayon(0), '0')
	t.is(crayon({}), '[object Object]')
	t.is(crayon(false), 'false')
	t.is(crayon('string'), 'string')
})

test('style functions', (t) => {
	t.is(crayon.rgb(123, 200, 100)('test'), '\x1B[38;2;123;200;100mtest\x1B[0m')
	t.is(crayon.ansi8(123)('test'), '\x1B[38;5;123mtest\x1B[0m')
	t.is(crayon.ansi4(12)('test'), '\x1B[94mtest\x1B[0m')
	t.is(crayon.ansi3(4)('test'), '\x1B[34mtest\x1B[0m')
	t.is(crayon.hex('#FF0000')('test'), '\x1B[38;2;255;0;0mtest\x1B[0m')
	t.is(crayon.hex('#FF0000', true)('test'), '\x1B[38;5;196mtest\x1B[0m')
	t.is(crayon.hsl(360, 50, 50)('test'), '\x1B[38;2;191;64;64mtest\x1B[0m')
	t.is(crayon.bgAnsi8(123)('test'), '\x1B[48;5;123mtest\x1B[0m')
	t.is(crayon.bgAnsi4(12)('test'), '\x1B[104mtest\x1B[0m')
	t.is(crayon.bgAnsi3(3)('test'), '\x1B[43mtest\x1B[0m')
	t.is(crayon.bgHex('#FF0000')('test'), '\x1B[48;2;255;0;0mtest\x1B[0m')
	t.is(crayon.bgHex('#FF0000', true)('test'), '\x1B[48;5;196mtest\x1B[0m')
	t.is(crayon.bgHsl(360, 50, 50)('test'), '\x1B[48;2;191;64;64mtest\x1B[0m')
})

test('literal functions', (t) => {
	t.is(crayon`{rgb(123,200,100) test}`, '\x1B[38;2;123;200;100mtest\x1B[0m')
	t.is(crayon`{bgRgb(123,200,100) test}`, '\x1B[48;2;123;200;100mtest\x1B[0m')
	t.is(crayon`{rgb(123,200,100,true) test}`, '\x1B[48;2;123;200;100mtest\x1B[0m')
	t.is(crayon`{hex('#FF0000') test}`, '\x1B[38;2;255;0;0mtest\x1B[0m')
	t.is(crayon`{hex(#FF0000) test}`, '\x1B[38;2;255;0;0mtest\x1B[0m')
})

test('hsl->8bit color conversion', (t) => {
	crayon.config.colorSupport.trueColor = false
	t.is(crayon.hsl(360, 50, 50)('test'), '\x1B[38;5;160mtest\x1B[0m')
	crayon.config.colorSupport.trueColor = true
})

test('rgb->8bit color conversion', (t) => {
	crayon.config.colorSupport.trueColor = false
	t.is(crayon.rgb(255, 127, 127)('test'), '\x1B[38;5;213mtest\x1B[0m')
	crayon.config.colorSupport.trueColor = true
})

test('rgb->4bit color conversion', (t) => {
	crayon.config.colorSupport.trueColor = false
	crayon.config.colorSupport.highColor = false
	t.is(crayon.rgb(255, 0, 255)('test'), '\x1B[35mtest\x1B[0m')
	crayon.config.colorSupport.highColor = true
	crayon.config.colorSupport.trueColor = true
})

test('8bit->4bit color conversion', (t) => {
	crayon.config.colorSupport.highColor = false
	t.is(crayon.ansi8(123)('test'), '\x1B[36mtest\x1B[0m')
	crayon.config.colorSupport.highColor = true
})

test('8bit->3bit color conversion', (t) => {
	crayon.config.colorSupport.highColor = false
	crayon.config.colorSupport.fourBitColor = false
	t.is(crayon.ansi8(232)('test'), '\x1B[30mtest\x1B[0m')
	t.is(crayon.ansi8(123)('test'), '\x1B[36mtest\x1B[0m')
	crayon.config.colorSupport.fourBitColor = true
	crayon.config.colorSupport.highColor = true
})

test('4bit->3bit color conversion', (t) => {
	crayon.config.colorSupport.fourBitColor = false
	t.is(crayon.ansi4(6)('test'), '\x1B[36mtest\x1B[0m')
	t.is(crayon.ansi4(13)('test'), '\x1B[35mtest\x1B[0m')
	crayon.config.colorSupport.fourBitColor = true
})

test('no style no overhead', (t) => {
	t.is(crayon, crayon.keyword('bad' as CrayonStyle))
	t.is(crayon, crayon.bgKeyword('bad' as CrayonStyle))
	crayon.config.colorSupport.threeBitColor = false
	t.is(crayon.ansi3(3)('hello'), 'hello')
	crayon.config.colorSupport.threeBitColor = false
})

test('error handling', (t) => {
	crayon.config.errors.throw = true

	const funcs = [
		crayon.hex,
		crayon.bgHex,
		crayon.rgb,
		crayon.bgRgb,
		crayon.hsl,
		crayon.bgHsl,
		crayon.ansi3,
		crayon.bgAnsi3,
		crayon.ansi4,
		crayon.bgAnsi4,
		crayon.ansi8,
		crayon.bgAnsi8,
	]

	const args = [
		[],
		[8],
		[16],
		[-1, 245, 799],
		[true, true, true],
		[false, false, false],
		['123', '133', '255'],
	]

	funcs.forEach((func: any) =>
		args.forEach((args) => {
			try {
				func(...args)
				t.fail()
			} catch (_err) {
				t.pass()
			}
		})
	)

	crayon.config.errors.throw = false
})

test('style optimizing', (t) => {
	crayon.config.optimizeStyles.chain = true
	const optimizedChain = crayon.keyword('red')(
		`red ${crayon.keyword('blue')(
			`blue ${crayon.keyword('bold')(`bold blue ${crayon.yellow('bold yellow')}`)}`
		)} ${crayon.yellow('yellow')} red`
	)

	crayon.config.optimizeStyles.chain = false
	const unoptimizedChain = crayon.keyword('red')(
		`red ${crayon.keyword('blue')(
			`blue ${crayon.keyword('bold')(`bold blue ${crayon.yellow('bold yellow')}`)}`
		)} ${crayon.yellow('yellow')} red`
	)

	if (optimizeStyles(unoptimizedChain) === optimizedChain) t.pass()

	crayon.config.optimizeStyles.literal = true
	const optimizedLiteral = crayon`{red red {bgGreen green {bold bold} not bold} red}`

	crayon.config.optimizeStyles.literal = false
	const unoptimizedLiteral = crayon`{red red {bgGreen green {bold bold} not bold} red}`

	if (optimizeStyles(unoptimizedLiteral) === optimizedLiteral) t.pass()
})
