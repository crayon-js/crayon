export declare type MainCrayon = CrayonInstanceCall & Crayon
export declare type Crayon = {
	readonly [style in CrayonStyle]: Crayon
} &
	CrayonColorFunction &
	CrayonTextCall &
	{
		readonly [style in CrayonStyle]: (...text: unknown[]) => string
	} &
	CrayonMiscFunction &
	CrayonInstance

type CrayonInstanceCall = () => Crayon
type CrayonTextCall = (...text: unknown[]) => string

/** @internal */
export type CrayonPrototype = CrayonMiscFunction &
	CrayonColorFunction &
	CrayonInstance
export interface CrayonInstance {
	/** Generates new independent crayon based on current one */
	clone: (clear: boolean, addCache?: string) => MainCrayon
	/** Generates new independent crayon */
	instance: (preserveCache: boolean, styleCache?: string) => MainCrayon
	/** Internal object which holds used styles */
	styleCache: string
	preserveCache: boolean
	/** Object which stores information about supported color palette, can be overwritten */
	colorSupport: ColorSupport
	/** Crayon's config settings object, global by default */
	config: CrayonConfig
}

export interface CrayonConfig {
	optimizeStyles: {
		chain: boolean
		literal: boolean
	}
	error: {
		throw: boolean
		log: boolean
	}
}

export interface CrayonMiscFunction {
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
	readonly keyword: (keyword: CrayonStyle) => Crayon
}

export interface CrayonColorFunction {
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

export type StyleObject = {
	[name: string]: CrayonStyle
}

/** Crayon styles (CSS Keywords + Basic 16 Colors + Attributes) */
export type CrayonStyle = FourBitColor | Attribute | ColorKeyword

/** CSS Color Keywords [bahamas10 json list](https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json) */
export type ColorKeyword = ForegroundColorKeyword | BackgroundColorKeyword
export type ForegroundColorKeyword =
	| 'aliceBlue'
	| 'antiqueWhite'
	| 'aqua'
	| 'aquamarine'
	| 'azure'
	| 'beige'
	| 'bisque'
	| 'blanchedalMond'
	| 'blueViolet'
	| 'brown'
	| 'burlyWood'
	| 'cadetBlue'
	| 'chartreuse'
	| 'chocolate'
	| 'coral'
	| 'cornFlowerBlue'
	| 'cornsilk'
	| 'crimson'
	| 'darkBlue'
	| 'darkCyan'
	| 'darkGoldenRod'
	| 'darkGreen'
	| 'darkGray'
	| 'darkGrey'
	| 'darkKhaki'
	| 'darkMagenta'
	| 'darkOliveGreen'
	| 'darkOrange'
	| 'darkOrchid'
	| 'darkRed'
	| 'darkSalmon'
	| 'darkSeaGreen'
	| 'darkSlateBlue'
	| 'darkSlateGray'
	| 'darkSlateGrey'
	| 'darkTurquoise'
	| 'darkViolet'
	| 'deepPink'
	| 'deepSkyBlue'
	| 'dimGray'
	| 'dimGrey'
	| 'dodgerBlue'
	| 'fireBrick'
	| 'floralWhite'
	| 'forestGreen'
	| 'fuchsia'
	| 'gainsboro'
	| 'ghostWhite'
	| 'goldenRod'
	| 'gold'
	| 'gray'
	| 'greenYellow'
	| 'grey'
	| 'honeyDew'
	| 'hotPink'
	| 'indianRed'
	| 'indigo'
	| 'ivory'
	| 'khaki'
	| 'lavenderBlush'
	| 'lavender'
	| 'lawnGreen'
	| 'lemonChiffon'
	| 'lightCoral'
	| 'lightGoldenRodYellow'
	| 'lightGray'
	| 'lightGrey'
	| 'lightPink'
	| 'lightSalmon'
	| 'lightSeaGreen'
	| 'lightSkyBlue'
	| 'lightSlateGray'
	| 'lightSlateGrey'
	| 'lightSteelBlue'
	| 'lime'
	| 'limeGreen'
	| 'linen'
	| 'maroon'
	| 'mediumAquamarine'
	| 'mediumBlue'
	| 'mediumOrchid'
	| 'mediumPurple'
	| 'mediumSeaGreen'
	| 'mediumSlateBlue'
	| 'mediumSpringGreen'
	| 'mediumTurquoise'
	| 'mediumVioletRed'
	| 'midnightBlue'
	| 'mintCream'
	| 'mistyrose'
	| 'moccasin'
	| 'navajoWhite'
	| 'navy'
	| 'oldLace'
	| 'olive'
	| 'olivedRab'
	| 'orange'
	| 'orangeRed'
	| 'orchid'
	| 'paleGoldenRod'
	| 'paleGreen'
	| 'paleTurquoise'
	| 'paleVioletRed'
	| 'papayaWhip'
	| 'peachPuff'
	| 'peru'
	| 'pink'
	| 'plum'
	| 'powderBlue'
	| 'purple'
	| 'rebeccaPurple'
	| 'rosyBrown'
	| 'royalBlue'
	| 'saddleBrown'
	| 'salmon'
	| 'sandyBrown'
	| 'seaGreen'
	| 'seaShell'
	| 'sienna'
	| 'silver'
	| 'skyBlue'
	| 'slateBlue'
	| 'slateGray'
	| 'slateGrey'
	| 'snow'
	| 'springGreen'
	| 'steelBlue'
	| 'tan'
	| 'teal'
	| 'thistle'
	| 'tomato'
	| 'turquoise'
	| 'violet'
	| 'wheat'
	| 'whiteSmoke'
	| 'yellowGreen'

export type BackgroundColorKeyword = `bg${Capitalize<ForegroundColorKeyword>}`

export type ForegroundThreeBitColor =
	| 'black'
	| 'red'
	| 'green'
	| 'yellow'
	| 'blue'
	| 'magenta'
	| 'cyan'
	| 'white'

export type BackgroundThreeBitColor = `bg${Capitalize<ForegroundColorKeyword>}`

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
