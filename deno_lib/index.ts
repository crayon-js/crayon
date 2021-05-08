import {
	addStyle,
	addStyleAlias,
	addStyleAliases,
	addStyleFunction,
	addStyles,
	colorSupport,
	functions,
	styles,
} from './styles.ts'
import { Crayon, CrayonStyle } from './types.ts'
import { errorConfig } from './util.ts'

/** @internal */
type func = (...args: any[]) => string | ''
/** @internal */
type funcs = {
	[name: string]: func
}

const config = new Proxy(
	{
		colorSupport,
		optimizeStyles: {
			chain: false,
			literal: false,
		},
		errors: errorConfig,
	} as Crayon['config'],
	{}
)

const optimizeStyles = (string: string): string =>
	string.replace(/(\x1b\[([0-9]|;|)+?m)+\x1b\[0m/, styles.reset) //TODO: improve that

const crayonPrototype: any = {
	styleCache: '',
	preserveCache: false,

	config,
	colorSupport,

	instance(preserveCache: boolean, styleCache?: string): Crayon {
		return buildCrayon(preserveCache, styleCache)
	},
	clone(clear: boolean, addCache?: string): Crayon {
		return buildCrayon(
			this.preserveCache,
			(clear ? this.clearCache() : this.styleCache) + (addCache || '')
		)
	},
	clearCache(): string {
		const cache = this.styleCache
		if (this.preserveCache) return cache
		this.styleCache = ''
		return cache
	},
	strip(text: string): string {
		return text.replace(/\x1b\[[0-9]([0-9])?([0-9])?m/gi, '')
	},
}

export const reloadStyles = () => {
	for (const value in styles) {
		Object.defineProperty(crayonPrototype, value, {
			configurable: true,
			get() {
				return this.clone(true, styles[value as CrayonStyle])
			},
		})
	}
}
reloadStyles()

export const reloadFunctions = () => {
	for (const name in functions) {
		if (name.startsWith('bg')) continue
		const bgName = `bg${name[0].toUpperCase() + name.slice(1)}`

		const func = (functions as funcs)[name]

		let needsSpecification = false
		const bgFunc =
			(functions as any)[bgName] ||
			(() => {
				needsSpecification = true
				return (functions as funcs)[name]
			})()

		Object.defineProperties(crayonPrototype, {
			[name]: {
				configurable: true,
				value(...args: unknown[]) {
					const style = func(...args)
					if (style !== '') return this.clone(true, style)
					return this
				},
			},
			[bgName]: {
				configurable: true,
				value(...args: unknown[]) {
					if (needsSpecification) args.push(true)
					const style = bgFunc(...args)
					if (style !== '') return this.clone(true, style)
					return this
				},
			},
		})
	}
}
reloadFunctions()

const buildCrayon = (preserveCache: boolean, styleCache?: string): Crayon => {
	const crayon = function (...args: unknown[]) {
		if (!args.length) return buildCrayon(true)

		if (Array.isArray((args[0] as any).raw)) {
			const returned = compileLiteral(...args)
			return crayon.config.optimizeStyles.literal
				? optimizeStyles(returned)
				: returned
		}

		const text = String(args.join(' '))
		const style = crayon.clearCache()
		if (!style) return text

		const returned =
			style + text.replace(resetRegex, styles.reset + style) + styles.reset
		return crayon.config.optimizeStyles.chain
			? optimizeStyles(returned)
			: returned
	} as Crayon

	Object.setPrototypeOf(crayon, crayonPrototype)
	crayon.preserveCache = !!preserveCache
	crayon.styleCache = styleCache || ''

	return crayon
}

const resetRegex = /\x1b\[0m/gi
const literalStyleRegex = /{([^\s]+\s)([^{}]+)}/
const literalFuncRegex = /(\w+)\((.*)\)/
const literalStringRegex = /^("|'|`)(.*)\1$/

const compileLiteral = (...texts: any[]): string => {
	const args = texts.slice(1) as string[]
	const baseText = [...texts[0]]

	let text = ''
	while (args.length || baseText.length) {
		if (baseText.length) text += baseText.shift()
		if (args.length) text += args.shift()
	}

	let matches = text.match(literalStyleRegex)

	while (matches?.length) {
		// Get value of given styles as one string
		const style = matches[1]
			.trimEnd()
			.split('.')
			.map((value) => {
				const style: string = styles[value as CrayonStyle]
				if (style) return style
				else {
					const match = value.match(literalFuncRegex)
					if (match?.length) {
						const name = match[1]
						// Format arguments to proper types
						const args = match[2].split(',').map((arg) => {
							const stringMatch = arg.match(literalStringRegex)
							if (stringMatch?.length) return stringMatch[2]
							const num = Number(arg)
							if (num) return num
							return arg === 'false' || arg === 'true' ? Boolean(arg) : arg
						})

						if (!name.startsWith('bg')) {
							const func = (functions as funcs)[name]
							if (func) return func(...args)
						} else {
							const nameWithoutBg =
								name[2].toLowerCase() + name.replace('bg', '').substr(1)
							const bgFunc =
								(functions as funcs)[name] ||
								(() => {
									args.push(true)
									return (functions as funcs)[nameWithoutBg]
								})()

							if (bgFunc) return bgFunc(...args)
						}
					}
				}
			})
			.join('')

		const matchedText = matches[2].split(styles.reset).join(styles.reset + style)
		text = text.replace(matches[0], style + matchedText + styles.reset)

		matches = text.match(literalStyleRegex)
	}

	return text
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
const crayonInstance = buildCrayon(false)

export {
	addStyleFunction,
	addStyleAliases,
	optimizeStyles,
	addStyleAlias,
	addStyles,
	addStyle,
	functions,
	styles,
}

export default crayonInstance
