import { getColorSupport } from './support'
import { styles } from './styles'
import { ColorKeyword, Crayon, MainCrayon, CrayonStyle } from './types'
import { ansi8ToAnsi4, hslToRgb, rgbToAnsi4, rgbToAnsi8 } from './conversions'
import { clamp, crayonError } from './util'

const colorSupport = new Proxy(getColorSupport(), {})

class StyleCache {
	value: string
	preserve: boolean

	constructor(preserve?: boolean, value?: string) {
		this.preserve = preserve || false
		this.value = value || ''
	}

	reset(): string {
		if (this.preserve) return this.value

		const temp = this.value
		this.value = ''
		return temp
	}
}

const buildCrayon = (
	preserveCache?: boolean,
	styleCache?: string
): MainCrayon => {
	const crayon: MainCrayon = (() => {}) as any
	const proxy = new Proxy<MainCrayon>(crayon, crayonHandler)

	crayon.colorSupport = colorSupport
	crayon.$styleCache = new StyleCache(preserveCache, styleCache)
	crayon.$functions = {
		strip: (text: string): string =>
			text.replace(/\x1b\[[0-9]([0-9])?([0-9])?m/gi, ''),
		keyword: (keyword: ColorKeyword | CrayonStyle) => {
			const style = styles[keyword]
			style && (crayon.$styleCache.value += style)
			return proxy
		},
		hsl: (hue: number, saturation: number, lightness: number) =>
			crayon.$functions.rgb(...hslToRgb(hue, saturation, lightness)),
		bgHsl: (hue: number, saturation: number, lightness: number) =>
			crayon.$functions.bgRgb(...hslToRgb(hue, saturation, lightness)),
		rgb: (red: number, green: number, blue: number): Crayon => {
			if (crayon.colorSupport.trueColor) {
				crayon.$styleCache.value += `\x1b[38;2;${red};${green};${blue}m`
				return proxy
			} else if (crayon.colorSupport.highColor)
				return crayon.$functions.ansi8(rgbToAnsi8(red, green, blue))
			else return crayon.$functions.ansi4(rgbToAnsi4(red, green, blue))
		},
		bgRgb: (red: number, green: number, blue: number): Crayon => {
			if (crayon.colorSupport.trueColor) {
				crayon.$styleCache.value += `\x1b[48;2;${red};${green};${blue}m`
				return proxy
			} else if (crayon.colorSupport.highColor)
				return crayon.$functions.bgAnsi8(rgbToAnsi8(red, green, blue))
			else return crayon.$functions.bgAnsi4(rgbToAnsi4(red, green, blue))
		},
		hex: (hex: string, ansi8?: boolean) => {
			if (/#[0-F]{6}/.test(hex)) {
				hex = hex.slice(1)
				const chunks = hex.match(/.{2}/g) as string[]
				const r = parseInt(chunks[0], 16),
					g = parseInt(chunks[1], 16),
					b = parseInt(chunks[2], 16)
				return ansi8
					? crayon.$functions.ansi8(rgbToAnsi8(r, g, b))
					: crayon.$functions.rgb(r, g, b)
			}
			crayonError(`Incorrect usage of hex function`)
			return proxy
		},
		bgHex: (hex: string, ansi8?: boolean) => {
			if (/#[0-F]{6}/.test(hex)) {
				hex = hex.slice(1)
				const chunks = hex.match(/.{2}/g) as string[]
				const r = parseInt(chunks[0], 16),
					g = parseInt(chunks[1], 16),
					b = parseInt(chunks[2], 16)
				return ansi8
					? crayon.$functions.bgAnsi8(rgbToAnsi8(r, g, b))
					: crayon.$functions.bgRgb(r, g, b)
			}
			crayonError(`Incorrect usage of bgHex function`)
			return proxy
		},
		ansi8: (code: number) => {
			if (crayon.colorSupport.highColor)
				crayon.$styleCache.value += `\x1b[38;5;${clamp(code, 0, 255)}m`
			else crayon.$functions.ansi4(ansi8ToAnsi4(code))

			return proxy
		},
		bgAnsi8: (code: number) => {
			if (crayon.colorSupport.highColor)
				crayon.$styleCache.value += `\x1b[48;5;${clamp(code, 0, 255)}m`
			else crayon.$functions.bgAnsi4(ansi8ToAnsi4(code))

			return proxy
		},
		ansi4: (code: number) => {
			code = clamp(crayon.colorSupport.fourBitColor ? code : code % 8, 0, 15)
			crayon.$styleCache.value += `\x1b[${code + (code > 8 ? 80 : 30)}m`
			return proxy
		},
		bgAnsi4: (code: number) => {
			code = clamp(crayon.colorSupport.fourBitColor ? code : code % 8, 0, 15)
			crayon.$styleCache.value += `\x1b[${code + (code > 8 ? 90 : 40)}m`
			return proxy
		},
		ansi3: (code: number) => {
			crayon.$styleCache.value += `\x1b[${clamp(code + 30, 30, 37)}m`
			return proxy
		},
		bgAnsi3: (code: number) => {
			crayon.$styleCache.value += `\x1b[${clamp(code + 40, 40, 47)}m`
			return proxy
		},
	}

	return proxy
}

const literalStyleRegex = /{(\w+)((.|\s)*?)}/
const compileLiteral = (...texts: string[]): string => {
	const fullText = texts.join('')

	let returned = fullText
	let matches = returned.match(literalStyleRegex)
	let style = ''

	if (matches?.length) {
		const styleMatch = matches[1]
		style ||= styles[styleMatch.trim() as CrayonStyle]

		const text = style + matches[2] + styles.reset
		returned = fullText.replace(matches[0], text)
	}

	return literalStyleRegex.test(returned)
		? compileLiteral(style, returned)
		: returned
}

const crayonHandler: ProxyHandler<Crayon> = {
	apply: (target: Crayon, _, args) => {
		if (!args.length) return buildCrayon()
		const [text] = args

		if (literalStyleRegex.test(text)) return compileLiteral(text)
		else return target.$styleCache.reset() + text + styles.reset
	},
	get(target: Crayon, prop: keyof Crayon, receiver: Crayon) {
		const targeted =
			Reflect.get(target, prop, receiver) ||
			Reflect.get(target.$functions, prop, receiver)
		if (targeted) return targeted

		const style = Reflect.get(styles, prop)
		style && (target.$styleCache.value += style)

		return buildCrayon(target.$styleCache.preserve, target.$styleCache.reset())
	},
}

/**
 *
 * Main Crayon object used to chain styles:
 * * call as function after chaining with given argument to get styled string
 *
 * @example
 * ```ts
 * import crayon = require('crayon.js')
 *
 * crayon.red.bgBlue.bold('🖍️ crayon')
 * ```
 *
 * * call as function at the beginning without arguments to receive new Crayon object which can be used to cache styling
 * @example
 * ```ts
 * import crayon = require('crayon.js')
 *
 * const warning = crayon().bgRed.keyword('orange').italic
 *
 * console.log(warning('THIS IS REALLY WARNY'))
 * console.log(warning('something failed'))
 * ```
 */
const crayon = buildCrayon(false)

export = crayon
