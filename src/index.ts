import { colorSupport, functions, styles } from './styles'
import { MainCrayon, CrayonStyle, CrayonConfig } from './types'
import { errorConfig } from './util'

const config = new Proxy(
	{
		optimizeStyles: {
			chain: false,
			literal: false,
		},
		error: errorConfig,
	} as CrayonConfig,
	{}
)

const optimizeStyles = (string: string): string =>
	string.replace(/(\x1b\[([0-9]|;|)+?m)+\x1b\[0m/, styles.reset) //TODO: improve that

const crayonPrototype: any = {
	styleCache: '',
	preserveCache: false,

	config,
	colorSupport,

	instance(preserveCache: boolean, styleCache?: string): MainCrayon {
		return buildCrayon(preserveCache, styleCache)
	},
	clone(clear: boolean, addCache?: string): MainCrayon {
		return buildCrayon(
			this.preserveCache,
			(clear ? this.clearCache() : this.styleCache) + addCache || ''
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

for (const value in styles) {
	Object.defineProperty(crayonPrototype, value, {
		get() {
			return this.clone(true, styles[value as CrayonStyle])
		},
	})
}

for (const name in functions) {
	if (name.startsWith('bg')) continue
	const bgName = `bg${name[0].toUpperCase() + name.slice(1)}`

	const func = (functions as any)[name]
	let needsSpecification = false
	const bgFunc =
		(functions as any)[bgName] ||
		(() => {
			needsSpecification = true
			return (functions as any)[name]
		})()

	Object.defineProperties(crayonPrototype, {
		[name]: {
			value(...args: unknown[]) {
				const style = func(...args)
				if (style) return this.clone(true, style)
				return this
			},
		},
		[bgName]: {
			value(...args: unknown[]) {
				if (needsSpecification) args.push(true)
				const style = bgFunc(...args)
				if (style) return this.clone(true, style)
				return this
			},
		},
	})
}

const buildCrayon = (
	preserveCache: boolean,
	styleCache?: string
): MainCrayon => {
	const crayon = function (...args: unknown[]) {
		if (!args.length) return buildCrayon(true)

		if (Array.isArray((args[0] as any).raw)) {
			const returned = compileLiteral(...args)
			return crayon.config.optimizeStyles ? optimizeStyles(returned) : returned
		}

		const text = String(args.join(' '))
		const style = crayon.clearCache()
		if (!style) return text

		const returned =
			style + text.replace(resetRegex, styles.reset + style) + styles.reset
		return crayon.config.optimizeStyles.chain
			? optimizeStyles(returned)
			: returned
	} as MainCrayon

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
	while (args.length || baseText.length)
		text += (baseText.shift() || '') + (args.shift() || '')

	let matches = text.match(literalStyleRegex)

	while (matches?.length) {
		// Get value of given styles as one string
		const style = matches[1]
			.trimEnd()
			.split('.')
			.map((value) => {
				const style: string = styles[value]
				if (style) return style
				else {
					const match = value.match(literalFuncRegex)
					if (match?.length) {
						const name = match[1]
						// Format arguments to proper types
						const args = match[2].split(',').map((arg) => {
							const stringMatch = arg.match(literalStringRegex)
							if (stringMatch?.length) return stringMatch[2]
							return Number(arg) || arg
						})

						if (!name.startsWith('bg')) {
							const func = (functions as any)[name]
							if (func) return func(...args)
						} else {
							const bgName = `bg${name[0].toUpperCase() + name.slice(1)}`
							const func = (functions as any)[bgName] || (functions as any)[name]
							if (func) return func(...args, true)
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

export = crayonInstance
