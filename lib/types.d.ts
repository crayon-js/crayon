/**
 * S - Styles extension (literal type)
 * F - Functions extension (literal type)
 * O - Object extension
 */
export declare type Crayon<S = void, F = void, O = void> = Function & CrayonInstanceCall<S, F, O> & CrayonStyles<S, F, O> & CrayonStyleExtension<S, F, O> & CrayonFunctionExtension<S, F, O> & CrayonFunction<S, F, O> & O & {
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
};
declare type CrayonInstanceCall<S, F, O> = (() => Crayon<S, F, O>) & ((...args: unknown[]) => string);
declare type CrayonStyleExtension<S, F, O> = {
    readonly [style in S extends string ? S : never]: ((...text: unknown[]) => string) & Crayon<S, F, O>;
};
declare type CrayonFunctionExtension<S, F, O> = {
    readonly [func in F extends string ? F : never]: (...args: any[]) => Crayon<S, F, O>;
};
export declare type CrayonStyles<S, F, O> = {
    readonly [style in CrayonStyle]: ((...text: unknown[]) => string) & Crayon<S, F, O>;
};
export interface CrayonFunction<S, F, O> {
    /** Generates new independent crayon instance based on current one */
    readonly clone: (clear: boolean, addCache?: string) => Crayon<S, F, O>;
    /** Generates new independent crayon instance */
    readonly instance: (preserveCache: boolean, styleCache?: string) => Crayon<S, F, O>;
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
    readonly keyword: (keyword: CrayonStyle | S) => Crayon<S, F, O>;
    readonly bgKeyword: (keyword: CrayonStyle | S) => Crayon<S, F, O>;
    /**
     * Style text using HSL values
     *  * hue - number from 0 to 360
     *  * saturation, lightness - number from 0 to 100
     */
    readonly hsl: (hue: number, saturation: number, lightness: number) => Crayon<S, F, O>;
    /**
     * Style text background using HSL values
     *  * hue - number from 0 to 360
     *  * saturation, lightness - number from 0 to 100
     */
    readonly bgHsl: (hue: number, saturation: number, lightness: number) => Crayon<S, F, O>;
    /**
     * Style text using RGB
     * * red, green, blue - number from 0 to 255
     */
    readonly rgb: (red: number, green: number, blue: number) => Crayon<S, F, O>;
    /**
     * Style text background using RGB
     * * red, green, blue - number from 0 to 255
     */
    readonly bgRgb: (red: number, green: number, blue: number) => Crayon<S, F, O>;
    /**
     * Style text using HEX
     *  * You can specify whether to explicitly color using 8bit color palette
     */
    readonly hex: (hex: string, ansi8?: boolean) => Crayon<S, F, O>;
    /**
     * Style text background using HEX
     *  * You can specify whether to explicitly color using 8bit color palette
     */
    readonly bgHex: (hex: string, ansi8?: boolean) => Crayon<S, F, O>;
    /**	Style text using 8bit (256) color palette */
    readonly ansi8: (code: number) => Crayon<S, F, O>;
    /**	Style text background using 8bit (256) color palette */
    readonly bgAnsi8: (code: number) => Crayon<S, F, O>;
    /**	Style text using 4bit (16) color palette */
    readonly ansi4: (code: number) => Crayon<S, F, O>;
    /**	Style text background using 4bit (16) color palette */
    readonly bgAnsi4: (code: number) => Crayon<S, F, O>;
    /**	Style text using 3bit (8) color palette */
    readonly ansi3: (code: number) => Crayon<S, F, O>;
    /**	Style text background using 3bit (8) color palette */
    readonly bgAnsi3: (code: number) => Crayon<S, F, O>;
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
export declare type CrayonStyle = FourBitColor | Attribute;
export declare type ForegroundThreeBitColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';
export declare type BackgroundThreeBitColor = `bg${Capitalize<ForegroundThreeBitColor>}`;
export declare type FourBitColor = ForegroundFourBitColor | BackgroundFourBitColor;
export declare type ForegroundFourBitColor = ForegroundThreeBitColor | `light${Capitalize<ForegroundThreeBitColor>}`;
export declare type BackgroundFourBitColor = `bg${Capitalize<ForegroundFourBitColor>}`;
export declare type Attribute = 'reset' | 'bold' | 'dim' | 'italic' | 'underline' | 'blink' | 'fastBlink' | 'invert' | 'hidden' | 'strikethrough' | 'boldOff' | 'doubleUnderline' | 'boldOrDimOff' | 'italicOff' | 'underlineOff' | 'blinkOff' | 'invertOff' | 'hiddenOff' | 'strikethroughOff';
export {};
