import { ansi4ToAnsi3, ansi8ToAnsi4, hslToRgb, rgbToAnsi8 } from './conversions'
import { config, reloadFunctions, reloadStyles } from './index'
import { CrayonStyle, StyleObject } from './types'
import { clamp, crayonError } from './util'

/** @internal */
export const fourBitColors = {
	black: '\x1b[30m',
	lightBlack: '\x1b[90m',
	red: '\x1b[31m',
	lightRed: '\x1b[91m',
	green: '\x1b[32m',
	lightGreen: '\x1b[92m',
	yellow: '\x1b[33m',
	lightYellow: '\x1b[93m',
	blue: '\x1b[34m',
	lightBlue: '\x1b[94m',
	magenta: '\x1b[35m',
	lightMagenta: '\x1b[95m',
	cyan: '\x1b[36m',
	lightCyan: '\x1b[96m',
	white: '\x1b[37m',
	lightWhite: '\x1b[97m',
}

for (const color in fourBitColors) {
	const colorAscii = (fourBitColors as any)[color]

	const matches = /[0-9][0-9]/.exec(colorAscii)
	if (!matches) continue

	const capitalized = color[0].toUpperCase() + color.slice(1)

	const colorCode = matches[0]
	Reflect.set(
		fourBitColors,
		`bg${capitalized}`,
		colorAscii.replace(colorCode, String(parseInt(colorCode) + 10))
	)
}

/** @internal */
export const attributes = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	italic: '\x1b[3m',
	underline: '\x1b[4m',
	blink: '\x1b[5m',
	fastBlink: '\x1b[6m',
	invert: '\x1b[7m',
	hidden: '\x1b[8m',
	strikethrough: '\x1b[9m',
	boldOff: '\x1b[21m',
	doubleUnderline: '\x1b[21m',
	boldOrDimOff: '\x1b[22m',
	italicOff: '\x1b[23m',
	underlineOff: '\x1b[24m',
	blinkOff: '\x1b[25m',
	invertOff: '\x1b[26m',
	hiddenOff: '\x1b[27m',
	strikethroughOff: '\x1b[28m',
}

export const functions = {
	keyword(k: CrayonStyle) {
		const style = styles[k]
		if (style) return style
		crayonError('Invalid keyword given in keyword function')
		return ''
	},
	ansi3(c: number, bg?: boolean) {
		if (typeof c !== 'number' || c > 7 || c < 0)
			crayonError('Invalid usage of ansi3 function, syntax: 0-7')
		if (!config.colorSupport.threeBitColor) return ''
		return `\x1b[${(bg ? 40 : 30) + clamp(c, 0, 7)}m`
	},
	ansi4(c: number, bg?: boolean) {
		if (typeof c !== 'number' || c > 15 || c < 0)
			crayonError('Invalid usage of ansi4 function, syntax: 0-15')
		if (!config.colorSupport.fourBitColor)
			return functions.ansi3(ansi4ToAnsi3(c), bg)
		return `\x1b[${clamp(c, 0, 15) + (bg ? 10 : 0) + (c > 7 ? 82 : 30)}m`
	},
	ansi8(c: number, bg?: boolean) {
		if (typeof c !== 'number' || c > 255 || c < 0)
			crayonError('Invalid usage of ansi8 function, syntax: 0-255')
		if (!config.colorSupport.highColor)
			return functions.ansi4(ansi8ToAnsi4(c), bg)
		return `\x1b[${bg ? 48 : 38};5;${clamp(c, 0, 255)}m`
	},
	rgb(r: number, g: number, b: number, bg?: boolean): string {
		if (
			typeof r !== 'number' ||
			typeof g !== 'number' ||
			typeof b !== 'number' ||
			r > 255 ||
			r < 0 ||
			g > 255 ||
			g < 0 ||
			b > 255 ||
			b < 0
		)
			crayonError(
				'Invalid usage of rgb function, syntax: r: 0-255, g: 0-255, b: 0-255'
			)
		if (!config.colorSupport.trueColor)
			return functions.ansi8(rgbToAnsi8(r, g, b), bg)
		return `\x1b[${bg ? 48 : 38};2;${r};${g};${b}m`
	},
	hsl(h: number, s: number, l: number, bg?: boolean): string {
		if (
			typeof h !== 'number' ||
			typeof s !== 'number' ||
			typeof l !== 'number' ||
			h > 360 ||
			h < 0 ||
			s > 100 ||
			s < 0 ||
			l > 100 ||
			l < 0
		)
			crayonError(
				'Incorrect usage of hsl function, syntax: h: 0-360, s: 0-100, l: 0-100'
			)
		const rgb = hslToRgb(h, s, l)
		if (!config.colorSupport.trueColor)
			return functions.ansi8(rgbToAnsi8(...rgb), bg)
		return functions.rgb(...rgb, bg)
	},
	hex(hex: string, ansi8?: boolean, bg?: boolean): string {
		if (/#[0-F]{6}/.test(hex)) {
			hex = hex.slice(1)
			const chunks = hex.match(/.{2}/g) as [string, string, string]
			const rgb = chunks.map((v) => parseInt(v, 16)) as [number, number, number]
			return ansi8
				? functions.ansi8(rgbToAnsi8(...rgb), bg)
				: functions.rgb(...rgb, bg)
		}
		crayonError('Incorrect usage of hex function, syntax: "#[0-F]{6}"')
		return ''
	},
	bgHex(hex: string, ansi8?: boolean): string {
		return functions.hex(hex, ansi8, true)
	},
}

export const styles = {} as StyleObject

Object.assign(styles, attributes, fourBitColors)

export const addStyleFunction = (
	name: string,
	func: (...any: any[]) => string
): boolean => {
	const status = Reflect.set(functions, name, func)
	if (status) reloadFunctions()
	return status
}

export const addStyleFunctions = (funcs: {
	[name: string]: (...any: any[]) => string
}): boolean => {
	let status = false

	for (const name in funcs) {
		const func = funcs[name]
		status ||= Reflect.set(functions, name, func)
	}

	if (status) reloadStyles()
	return status
}

export const addStyleAlias = (
	alias: string,
	aliased: CrayonStyle | string
): boolean => {
	const style = styles[aliased as CrayonStyle]

	if (!style) {
		crayonError(`Could not find style "${aliased}"`)
		return false
	}

	const status = Reflect.set(styles, alias, style)
	if (status) reloadStyles()
	return status
}

export const addStyleAliases = (aliases: {
	[name: string]: CrayonStyle | string
}): boolean => {
	let status = false

	for (const alias in aliases) {
		const aliased = aliases[alias]
		const style = styles[aliased as CrayonStyle]

		if (!style) crayonError(`Could not find style "${aliased}"`)

		status ||= Reflect.set(styles, alias, style)
	}

	if (status) reloadStyles()
	return status
}

export const addStyle = (name: string, value: string): boolean => {
	const status = Reflect.set(styles, name, value)
	if (status) return reloadStyles(), true
	return crayonError(`Failed adding ${name} style`)
}

export const addStyles = (styleObject: { [name: string]: string }): boolean => {
	try {
		Object.assign(styles, styleObject)
		reloadStyles()
		return true
	} catch (err) {
		return crayonError(`Failed adding styles:\n${err}`)
	}
}
