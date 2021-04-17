import { CrayonStyle } from './types';
export declare const colorSupport: import("./types").ColorSupport;
export declare const functions: {
    keyword(k: CrayonStyle): CrayonStyle | undefined;
    ansi3(c: number, bg?: boolean | undefined): string;
    ansi4(c: number, bg?: boolean | undefined): string;
    ansi8(c: number, bg?: boolean | undefined): string;
    rgb(r: number, g: number, b: number, bg?: boolean | undefined): string;
    hsl(h: number, s: number, l: number, bg?: boolean | undefined): string;
    hex(hex: string, ansi8?: boolean | undefined, bg?: boolean | undefined): string;
    bgHex(hex: string, ansi8?: boolean | undefined): string;
};
