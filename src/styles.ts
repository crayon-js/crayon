import {
	AttributesObject,
	ColorKeyword,
	ColorKeywordsObject,
	FourBitColor,
	FourBitColorsObject,
	StylesObject,
} from './types.ts'

/* 
    https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
*/
export const cssColorKeywords = {
	aliceBlue: '\x1b[38;2;240;248;255m',
	antiqueWhite: '\x1b[38;2;250;235;215m',
	aqua: '\x1b[38;2;0;255;255m',
	aquamarine: '\x1b[38;2;127;255;212m',
	azure: '\x1b[38;2;240;255;255m',
	beige: '\x1b[38;2;245;245;220m',
	bisque: '\x1b[38;2;255;228;196m',
	blanchedalMond: '\x1b[38;2;255;235;205m',
	blueViolet: '\x1b[38;2;138;43;226m',
	brown: '\x1b[38;2;165;42;42m',
	burlyWood: '\x1b[38;2;222;184;135m',
	cadetBlue: '\x1b[38;2;95;158;160m',
	chartreuse: '\x1b[38;2;127;255;0m',
	chocolate: '\x1b[38;2;210;105;30m',
	coral: '\x1b[38;2;255;127;80m',
	cornFlowerBlue: '\x1b[38;2;100;149;237m',
	cornsilk: '\x1b[38;2;255;248;220m',
	crimson: '\x1b[38;2;220;20;60m',
	darkBlue: '\x1b[38;2;0;0;139m',
	darkCyan: '\x1b[38;2;0;139;139m',
	darkGoldenRod: '\x1b[38;2;184;134;11m',
	darkGreen: '\x1b[38;2;0;100;0m',
	darkGray: '\x1b[38;2;169;169;169m',
	darkGrey: '\x1b[38;2;169;169;169m',
	darkKhaki: '\x1b[38;2;189;183;107m',
	darkMagenta: '\x1b[38;2;139;0;139m',
	darkOliveGreen: '\x1b[38;2;85;107;47m',
	darkOrange: '\x1b[38;2;255;140;0m',
	darkOrchid: '\x1b[38;2;153;50;204m',
	darkRed: '\x1b[38;2;139;0;0m',
	darkSalmon: '\x1b[38;2;233;150;122m',
	darkSeaGreen: '\x1b[38;2;143;188;143m',
	darkSlateBlue: '\x1b[38;2;72;61;139m',
	darkSlateGray: '\x1b[38;2;47;79;79m',
	darkSlateGrey: '\x1b[38;2;47;79;79m',
	darkTurquoise: '\x1b[38;2;0;206;209m',
	darkViolet: '\x1b[38;2;148;0;211m',
	deepPink: '\x1b[38;2;255;20;147m',
	deepSkyBlue: '\x1b[38;2;0;191;255m',
	dimGray: '\x1b[38;2;105;105;105m',
	dimGrey: '\x1b[38;2;105;105;105m',
	dodgerBlue: '\x1b[38;2;30;144;255m',
	fireBrick: '\x1b[38;2;178;34;34m',
	floralWhite: '\x1b[38;2;255;250;240m',
	forestGreen: '\x1b[38;2;34;139;34m',
	fuchsia: '\x1b[38;2;255;0;255m',
	gainsboro: '\x1b[38;2;220;220;220m',
	ghostWhite: '\x1b[38;2;248;248;255m',
	goldenRod: '\x1b[38;2;218;165;32m',
	gold: '\x1b[38;2;255;215;0m',
	gray: '\x1b[38;2;128;128;128m',
	greenYellow: '\x1b[38;2;173;255;47m',
	grey: '\x1b[38;2;128;128;128m',
	honeyDew: '\x1b[38;2;240;255;240m',
	hotPink: '\x1b[38;2;255;105;180m',
	indianRed: '\x1b[38;2;205;92;92m',
	indigo: '\x1b[38;2;75;0;130m',
	ivory: '\x1b[38;2;255;255;240m',
	khaki: '\x1b[38;2;240;230;140m',
	lavenderBlush: '\x1b[38;2;255;240;245m',
	lavender: '\x1b[38;2;230;230;250m',
	lawnGreen: '\x1b[38;2;124;252;0m',
	lemonChiffon: '\x1b[38;2;255;250;205m',
	lightCoral: '\x1b[38;2;240;128;128m',
	lightGoldenRodYellow: '\x1b[38;2;250;250;210m',
	lightGray: '\x1b[38;2;211;211;211m',
	lightGrey: '\x1b[38;2;211;211;211m',
	lightPink: '\x1b[38;2;255;182;193m',
	lightSalmon: '\x1b[38;2;255;160;122m',
	lightSeaGreen: '\x1b[38;2;32;178;170m',
	lightSkyBlue: '\x1b[38;2;135;206;250m',
	lightSlateGray: '\x1b[38;2;119;136;153m',
	lightSlateGrey: '\x1b[38;2;119;136;153m',
	lightSteelBlue: '\x1b[38;2;176;196;222m',
	lime: '\x1b[38;2;0;255;0m',
	limeGreen: '\x1b[38;2;50;205;50m',
	linen: '\x1b[38;2;250;240;230m',
	maroon: '\x1b[38;2;128;0;0m',
	mediumAquamarine: '\x1b[38;2;102;205;170m',
	mediumBlue: '\x1b[38;2;0;0;205m',
	mediumOrchid: '\x1b[38;2;186;85;211m',
	mediumPurple: '\x1b[38;2;147;112;219m',
	mediumSeaGreen: '\x1b[38;2;60;179;113m',
	mediumSlateBlue: '\x1b[38;2;123;104;238m',
	mediumSpringGreen: '\x1b[38;2;0;250;154m',
	mediumTurquoise: '\x1b[38;2;72;209;204m',
	mediumVioletRed: '\x1b[38;2;199;21;133m',
	midnightBlue: '\x1b[38;2;25;25;112m',
	mintCream: '\x1b[38;2;245;255;250m',
	mistyrose: '\x1b[38;2;255;228;225m',
	moccasin: '\x1b[38;2;255;228;181m',
	navajoWhite: '\x1b[38;2;255;222;173m',
	navy: '\x1b[38;2;0;0;128m',
	oldLace: '\x1b[38;2;253;245;230m',
	olive: '\x1b[38;2;128;128;0m',
	olivedRab: '\x1b[38;2;107;142;35m',
	orange: '\x1b[38;2;255;165;0m',
	orangeRed: '\x1b[38;2;255;69;0m',
	orchid: '\x1b[38;2;218;112;214m',
	paleGoldenRod: '\x1b[38;2;238;232;170m',
	paleGreen: '\x1b[38;2;152;251;152m',
	paleTurquoise: '\x1b[38;2;175;238;238m',
	paleVioletRed: '\x1b[38;2;219;112;147m',
	papayaWhip: '\x1b[38;2;255;239;213m',
	peachPuff: '\x1b[38;2;255;218;185m',
	peru: '\x1b[38;2;205;133;63m',
	pink: '\x1b[38;2;255;192;203m',
	plum: '\x1b[38;2;221;160;221m',
	powderBlue: '\x1b[38;2;176;224;230m',
	purple: '\x1b[38;2;128;0;128m',
	rebeccaPurple: '\x1b[38;2;102;51;153m',
	rosyBrown: '\x1b[38;2;188;143;143m',
	royalBlue: '\x1b[38;2;65;105;225m',
	saddleBrown: '\x1b[38;2;139;69;19m',
	salmon: '\x1b[38;2;250;128;114m',
	sandyBrown: '\x1b[38;2;244;164;96m',
	seaGreen: '\x1b[38;2;46;139;87m',
	seaShell: '\x1b[38;2;255;245;238m',
	sienna: '\x1b[38;2;160;82;45m',
	silver: '\x1b[38;2;192;192;192m',
	skyBlue: '\x1b[38;2;135;206;235m',
	slateBlue: '\x1b[38;2;106;90;205m',
	slateGray: '\x1b[38;2;112;128;144m',
	slateGrey: '\x1b[38;2;112;128;144m',
	snow: '\x1b[38;2;255;250;250m',
	springGreen: '\x1b[38;2;0;255;127m',
	steelBlue: '\x1b[38;2;70;130;180m',
	tan: '\x1b[38;2;210;180;140m',
	teal: '\x1b[38;2;0;128;128m',
	thistle: '\x1b[38;2;216;191;216m',
	tomato: '\x1b[38;2;255;99;71m',
	turquoise: '\x1b[38;2;64;224;208m',
	violet: '\x1b[38;2;238;130;238m',
	wheat: '\x1b[38;2;245;222;179m',
	whiteSmoke: '\x1b[38;2;245;245;245m',
	yellowGreen: '\x1b[38;2;154;205;50m',
}

export const colorKeywords = cssColorKeywords as ColorKeywordsObject

for (const color in colorKeywords) {
	const colorAscii: string = colorKeywords[color as ColorKeyword] || ''

	const matches = /\[38/.exec(colorAscii)
	if (!matches) continue

	const capitalized = color[0].toUpperCase() + color.slice(1)
	const colorCode = matches[0]

	colorKeywords[`bg${capitalized}` as ColorKeyword] = colorAscii.replace(
		colorCode,
		`[${parseInt(colorCode.replace('[', '')) + 10}`
	)
}

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
} as FourBitColorsObject

for (const color in fourBitColors) {
	const colorAscii = fourBitColors[color as FourBitColor] || ''

	const matches = /[0-9][0-9]/.exec(colorAscii)
	if (!matches) continue

	const capitalized = color[0].toUpperCase() + color.slice(1)

	const colorCode = matches[0]
	fourBitColors[`bg${capitalized}` as FourBitColor] = colorAscii.replace(
		colorCode,
		String(parseInt(colorCode) + 10)
	)
}

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
} as AttributesObject

export const styles = {} as StylesObject
Object.assign(styles, colorKeywords, fourBitColors, attributes)
