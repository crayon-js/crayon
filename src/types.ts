export declare type MainCrayon = CrayonInstanceCall & Crayon
export declare type Crayon = {
	readonly [style in CrayonStyle]: Crayon
} &
	CrayonColorFunction &
	{
		readonly /** This is some test */
		[style in CrayonStyle]: (text: unknown) => string
	} &
	CrayonMiscFunction & {
		/** Internal object which holds all functions */
		$functions: CrayonColorFunction & CrayonMiscFunction
		/** Internal object which holds used styles */
		$styleCache: StyleCache
		/** Object which stores information about supported color palette, can be overwritten */
		colorSupport: ColorSupport
	}

export type CrayonInstanceCall = () => Crayon

export type CrayonMiscFunction = {
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
	readonly keyword: (keyword: ColorKeyword | CrayonStyle) => Crayon
}

export type CrayonColorFunction = {
	/**
	 * Style text using HSL values
	 *  * hue - number from 0 to 360
	 *  * saturation, lightness - number from 0 to 100
	 */
	readonly hsl: (hue: number, saturation: number, lightness: number) => Crayon
	/**
	 * Style text background using HSL values
	 *  * hue - number from 0 to 360
	 *  * saturation, lightness - number from 0 to 100
	 */
	readonly bgHsl: (hue: number, saturation: number, lightness: number) => Crayon
	/**
	 * Style text using RGB
	 * * red, green, blue - number from 0 to 255
	 */
	readonly rgb: (red: number, green: number, blue: number) => Crayon
	/**
	 * Style text background using RGB
	 * * red, green, blue - number from 0 to 255
	 */
	readonly bgRgb: (red: number, green: number, blue: number) => Crayon
	/**
	 * Style text using HEX
	 *  * You can specify whether to explicitly color using 8bit color palette
	 */
	readonly hex: (hex: string, ansi8?: boolean) => Crayon
	/**
	 * Style text background using HEX
	 *  * You can specify whether to explicitly color using 8bit color palette
	 */
	readonly bgHex: (hex: string, ansi8?: boolean) => Crayon
	/**	Style text using 8bit (256) color palette */
	readonly ansi8: (code: number) => Crayon
	/**	Style text background using 8bit (256) color palette */
	readonly bgAnsi8: (code: number) => Crayon
	/**	Style text using 4bit (16) color palette */
	readonly ansi4: (code: number) => Crayon
	/**	Style text background using 4bit (16) color palette */
	readonly bgAnsi4: (code: number) => Crayon
	/**	Style text using 3bit (8) color palette */
	readonly ansi3: (code: number) => Crayon
	/**	Style text background using 3bit (8) color palette */
	readonly bgAnsi3: (code: number) => Crayon
}

export interface StyleCache {
	value: string
	preserve: boolean
	reset: () => string
}

/**
 * Detected terminal color support, can be modified to override settings
 */
export interface ColorSupport {
	/** 24bit (16.7m) color palette */
	trueColor: boolean
	/** 8bit (256) color palette */
	highColor: boolean
	/** 4bit (16) color palette */
	fourBitColor: boolean
	/** 3bit (8) color palette */
	threeBitColor: boolean
}

/** Crayon styles (CSS Keywords + Basic 16 Colors + Attributes) */
export type CrayonStyle = FourBitColor | Attribute | ColorKeyword

export type StylesObject = {
	[name in CrayonStyle]: string
}

export type AttributesObject = {
	[name in Attribute]: string
}

export type FourBitColorsObject = {
	[name in FourBitColor]?: string
}

export type ColorKeywordsObject = {
	[name in ColorKeyword]?: string
}

/** CSS Color Keywords [bahamas10 json list](https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json) */
export type ColorKeyword = ForegroundColorKeyword | BackgroundColorKeyword
import { cssColorKeywords } from './styles'
export type ForegroundColorKeyword = keyof typeof cssColorKeywords
export type BackgroundColorKeyword = `bg${Capitalize<ForegroundColorKeyword>}`

export type ThreeBitForegroundColor =
	| 'black'
	| 'red'
	| 'green'
	| 'yellow'
	| 'blue'
	| 'magenta'
	| 'cyan'
	| 'white'

export type ThreeBitBackgroundColor = `bg${Capitalize<ThreeBitForegroundColor>}`

export type FourBitColor = FourBitForegroundColors | FourBitBackgroundColors

export type FourBitForegroundColors =
	| ThreeBitForegroundColor
	| `light${Capitalize<ThreeBitForegroundColor>}`

export type FourBitBackgroundColors =
	| ThreeBitBackgroundColor
	| `light${Capitalize<ThreeBitBackgroundColor>}`

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
