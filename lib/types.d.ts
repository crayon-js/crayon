export declare interface Crayon extends Function, CrayonInstanceCall, CrayonStyles, CrayonFunction {
    styleCache: string;
    preserveCache: boolean;
    config: {
        colorSupport: CrayonColorSupport;
        optimizeStyles: {
            chain: boolean;
            literal: boolean;
        };
        errors: {
            throw: boolean;
            log: boolean;
        };
    };
}
declare type CrayonInstanceCall = (() => Crayon) & ((...args: unknown[]) => string);
declare type CrayonStyles = {
    readonly [style in CrayonStyle]: ((...text: unknown[]) => string) & Crayon;
};
export interface CrayonFunction {
    /** Generates new independent crayon instance based on current one */
    readonly clone: (clear: boolean, addCache?: string) => Crayon;
    /** Generates new independent crayon instance */
    readonly instance: (preserveCache: boolean, styleCache?: string) => Crayon;
    /**
     *  Clears crayon instances cache and returns it
     *  * If `this.preserveCache` is set to true it does not clear cache though it still returns it
     */
    readonly clearCache: () => string;
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
    readonly strip: (text: string) => string;
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
    readonly keyword: (keyword: CrayonStyle) => Crayon;
    readonly bgKeyword: (keyword: CrayonStyle) => Crayon;
    /**
     * Style text using HSL values
     *  * hue - number from 0 to 360
     *  * saturation, lightness - number from 0 to 100
     */
    readonly hsl: (hue: number, saturation: number, lightness: number) => Crayon;
    /**
     * Style text background using HSL values
     *  * hue - number from 0 to 360
     *  * saturation, lightness - number from 0 to 100
     */
    readonly bgHsl: (hue: number, saturation: number, lightness: number) => Crayon;
    /**
     * Style text using RGB
     * * red, green, blue - number from 0 to 255
     */
    readonly rgb: (red: number, green: number, blue: number) => Crayon;
    /**
     * Style text background using RGB
     * * red, green, blue - number from 0 to 255
     */
    readonly bgRgb: (red: number, green: number, blue: number) => Crayon;
    /**
     * Style text using HEX
     *  * You can specify whether to explicitly color using 8bit color palette
     */
    readonly hex: (hex: string, ansi8?: boolean) => Crayon;
    /**
     * Style text background using HEX
     *  * You can specify whether to explicitly color using 8bit color palette
     */
    readonly bgHex: (hex: string, ansi8?: boolean) => Crayon;
    /**	Style text using 8bit (256) color palette */
    readonly ansi8: (code: number) => Crayon;
    /**	Style text background using 8bit (256) color palette */
    readonly bgAnsi8: (code: number) => Crayon;
    /**	Style text using 4bit (16) color palette */
    readonly ansi4: (code: number) => Crayon;
    /**	Style text background using 4bit (16) color palette */
    readonly bgAnsi4: (code: number) => Crayon;
    /**	Style text using 3bit (8) color palette */
    readonly ansi3: (code: number) => Crayon;
    /**	Style text background using 3bit (8) color palette */
    readonly bgAnsi3: (code: number) => Crayon;
}
export interface CrayonColorSupport {
    trueColor: boolean;
    highColor: boolean;
    fourBitColor: boolean;
    threeBitColor: boolean;
}
export declare type StyleObject = {
    [style in CrayonStyle]: string;
};
/** Crayon styles (CSS Keywords + Basic 16 Colors + Attributes) */
export declare type CrayonStyle = FourBitColor | Attribute | ColorKeyword;
/** CSS Color Keywords [bahamas10 json list](https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json) */
export declare type ColorKeyword = ForegroundColorKeyword | BackgroundColorKeyword;
export declare type ForegroundColorKeyword = 'aliceBlue' | 'antiqueWhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalMond' | 'blueViolet' | 'brown' | 'burlyWood' | 'cadetBlue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornFlowerBlue' | 'cornsilk' | 'crimson' | 'darkBlue' | 'darkCyan' | 'darkGoldenRod' | 'darkGreen' | 'darkGray' | 'darkGrey' | 'darkKhaki' | 'darkMagenta' | 'darkOliveGreen' | 'darkOrange' | 'darkOrchid' | 'darkRed' | 'darkSalmon' | 'darkSeaGreen' | 'darkSlateBlue' | 'darkSlateGray' | 'darkSlateGrey' | 'darkTurquoise' | 'darkViolet' | 'deepPink' | 'deepSkyBlue' | 'dimGray' | 'dimGrey' | 'dodgerBlue' | 'fireBrick' | 'floralWhite' | 'forestGreen' | 'fuchsia' | 'gainsboro' | 'ghostWhite' | 'goldenRod' | 'gold' | 'gray' | 'greenYellow' | 'grey' | 'honeyDew' | 'hotPink' | 'indianRed' | 'indigo' | 'ivory' | 'khaki' | 'lavenderBlush' | 'lavender' | 'lawnGreen' | 'lemonChiffon' | 'lightCoral' | 'lightGoldenRodYellow' | 'lightGray' | 'lightGrey' | 'lightPink' | 'lightSalmon' | 'lightSeaGreen' | 'lightSkyBlue' | 'lightSlateGray' | 'lightSlateGrey' | 'lightSteelBlue' | 'lime' | 'limeGreen' | 'linen' | 'maroon' | 'mediumAquamarine' | 'mediumBlue' | 'mediumOrchid' | 'mediumPurple' | 'mediumSeaGreen' | 'mediumSlateBlue' | 'mediumSpringGreen' | 'mediumTurquoise' | 'mediumVioletRed' | 'midnightBlue' | 'mintCream' | 'mistyrose' | 'moccasin' | 'navajoWhite' | 'navy' | 'oldLace' | 'olive' | 'olivedRab' | 'orange' | 'orangeRed' | 'orchid' | 'paleGoldenRod' | 'paleGreen' | 'paleTurquoise' | 'paleVioletRed' | 'papayaWhip' | 'peachPuff' | 'peru' | 'pink' | 'plum' | 'powderBlue' | 'purple' | 'rebeccaPurple' | 'rosyBrown' | 'royalBlue' | 'saddleBrown' | 'salmon' | 'sandyBrown' | 'seaGreen' | 'seaShell' | 'sienna' | 'silver' | 'skyBlue' | 'slateBlue' | 'slateGray' | 'slateGrey' | 'snow' | 'springGreen' | 'steelBlue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whiteSmoke' | 'yellowGreen';
export declare type BackgroundColorKeyword = `bg${Capitalize<ForegroundColorKeyword>}`;
export declare type ForegroundThreeBitColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';
export declare type BackgroundThreeBitColor = `bg${Capitalize<ForegroundColorKeyword>}`;
export declare type FourBitColor = ForegroundFourBitColor | BackgroundFourBitColor;
export declare type ForegroundFourBitColor = ForegroundThreeBitColor | `light${Capitalize<ForegroundThreeBitColor>}`;
export declare type BackgroundFourBitColor = `bg${Capitalize<ForegroundFourBitColor>}`;
export declare type Attribute = 'reset' | 'bold' | 'dim' | 'italic' | 'underline' | 'blink' | 'fastBlink' | 'invert' | 'hidden' | 'strikethrough' | 'boldOff' | 'doubleUnderline' | 'boldOrDimOff' | 'italicOff' | 'underlineOff' | 'blinkOff' | 'invertOff' | 'hiddenOff' | 'strikethroughOff';
export {};
