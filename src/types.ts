export declare type Crayon<T = void> = Function &
	CrayonInstanceCall<T> &
	CrayonStyles<T> &
	CrayonExtension<T> &
	CrayonFunction<T> & {
		styleCache: string
		preserveCache: boolean

		config: {
			colorSupport: CrayonColorSupport
			optimizeStyles: {
				chain: boolean
				literal: boolean
			}
			errors: {
				throw: boolean
				log: boolean
			}
		}
	}

type CrayonInstanceCall<T> = (() => Crayon<T>) &
	((...args: unknown[]) => string)

type CrayonExtension<T = void> = {
	readonly [style in T extends string ? T : never]: ((
		...text: unknown[]
	) => string) &
		Crayon<T>
}

export type CrayonStyles<T = void> = {
	readonly [style in CrayonStyle]: ((...text: unknown[]) => string) & Crayon<T>
}

export interface CrayonFunction<T = void> {
	/** Generates new independent crayon instance based on current one */
	readonly clone: (clear: boolean, addCache?: string) => Crayon<T>
	/** Generates new independent crayon instance */
	readonly instance: (preserveCache: boolean, styleCache?: string) => Crayon<T>
	/**
	 *  Clears crayon instances cache and returns it
	 *  * If `this.preserveCache` is set to true it does not clear cache though it still returns it
	 */
	readonly clearCache: () => string
	/**
	 * @returns text with stripped ascii codes
	 * * It can be used to get true text length
	 * @example
	 * ```ts
	 * import crayon = require('crayon.js')
	 *
	 * const styledText = color.red('text')
	 * const strippedText = crayon.strip(styledText)
	 *
	 * console.log(styledText) // returns red colored word "text"
	 * console.log(strippedText) // returns raw "text" with no styling
	 * ```
	 */
	readonly strip: (text: string) => string
	/**
	 * keyword is any of the css color keywords from [bahamas10 json list](https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json)
	 * @example
	 * ```ts
	 * import crayon = require('crayon.js')
	 *
	 * const styledText = color.red('text')
	 * const strippedText = crayon.strip(styledText)
	 *
	 * console.log(styledText) // returns red colored word "text"
	 * console.log(strippedText) // returns raw "text" with no styling
	 * ```
	 */
	readonly keyword: (keyword: CrayonStyle | T) => Crayon<T>
	readonly bgKeyword: (keyword: CrayonStyle | T) => Crayon<T>
	/**
	 * Style text using HSL values
	 *  * hue - number from 0 to 360
	 *  * saturation, lightness - number from 0 to 100
	 */
	readonly hsl: (hue: number, saturation: number, lightness: number) => Crayon<T>
	/**
	 * Style text background using HSL values
	 *  * hue - number from 0 to 360
	 *  * saturation, lightness - number from 0 to 100
	 */
	readonly bgHsl: (
		hue: number,
		saturation: number,
		lightness: number
	) => Crayon<T>
	/**
	 * Style text using RGB
	 * * red, green, blue - number from 0 to 255
	 */
	readonly rgb: (red: number, green: number, blue: number) => Crayon<T>
	/**
	 * Style text background using RGB
	 * * red, green, blue - number from 0 to 255
	 */
	readonly bgRgb: (red: number, green: number, blue: number) => Crayon<T>
	/**
	 * Style text using HEX
	 *  * You can specify whether to explicitly color using 8bit color palette
	 */
	readonly hex: (hex: string, ansi8?: boolean) => Crayon<T>
	/**
	 * Style text background using HEX
	 *  * You can specify whether to explicitly color using 8bit color palette
	 */
	readonly bgHex: (hex: string, ansi8?: boolean) => Crayon<T>
	/**	Style text using 8bit (256) color palette */
	readonly ansi8: (code: number) => Crayon<T>
	/**	Style text background using 8bit (256) color palette */
	readonly bgAnsi8: (code: number) => Crayon<T>
	/**	Style text using 4bit (16) color palette */
	readonly ansi4: (code: number) => Crayon<T>
	/**	Style text background using 4bit (16) color palette */
	readonly bgAnsi4: (code: number) => Crayon<T>
	/**	Style text using 3bit (8) color palette */
	readonly ansi3: (code: number) => Crayon<T>
	/**	Style text background using 3bit (8) color palette */
	readonly bgAnsi3: (code: number) => Crayon<T>
}

export interface CrayonColorSupport {
	trueColor: boolean
	highColor: boolean
	fourBitColor: boolean
	threeBitColor: boolean
}

export type StyleObject = {
	[style in CrayonStyle]: string
}

/** Crayon styles (CSS Keywords + Basic 16 Colors + Attributes) */
export type CrayonStyle = FourBitColor | Attribute

export type ForegroundThreeBitColor =
	| 'black'
	| 'red'
	| 'green'
	| 'yellow'
	| 'blue'
	| 'magenta'
	| 'cyan'
	| 'white'

export type BackgroundThreeBitColor = `bg${Capitalize<ForegroundThreeBitColor>}`

export type FourBitColor = ForegroundFourBitColor | BackgroundFourBitColor

export type ForegroundFourBitColor =
	| ForegroundThreeBitColor
	| `light${Capitalize<ForegroundThreeBitColor>}`
export type BackgroundFourBitColor = `bg${Capitalize<ForegroundFourBitColor>}`

export type Attribute =
	| 'reset'
	| 'bold'
	| 'dim'
	| 'italic'
	| 'underline'
	| 'blink'
	| 'fastBlink'
	| 'invert'
	| 'hidden'
	| 'strikethrough'
	| 'boldOff'
	| 'doubleUnderline'
	| 'boldOrDimOff'
	| 'italicOff'
	| 'underlineOff'
	| 'blinkOff'
	| 'invertOff'
	| 'hiddenOff'
	| 'strikethroughOff'
