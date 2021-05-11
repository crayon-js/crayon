import { CrayonStyle, StyleObject } from './types';
export declare const functions: {
    keyword(k: CrayonStyle): string;
    ansi3(c: number, bg?: boolean | undefined): string;
    ansi4(c: number, bg?: boolean | undefined): string;
    ansi8(c: number, bg?: boolean | undefined): string;
    rgb(r: number, g: number, b: number, bg?: boolean | undefined): string;
    hsl(h: number, s: number, l: number, bg?: boolean | undefined): string;
    hex(hex: string, ansi8?: boolean | undefined, bg?: boolean | undefined): string;
    bgHex(hex: string, ansi8?: boolean | undefined): string;
};
export declare const styles: StyleObject;
export declare const addStyleFunction: (name: string, func: (...any: any[]) => string) => boolean;
export declare const addStyleAlias: (alias: string, aliased: CrayonStyle | string) => boolean;
export declare const addStyleAliases: (aliases: {
    [name: string]: string;
}) => boolean;
export declare const addStyle: (name: string, value: string) => boolean;
export declare const addStyles: (styleObject: {
    [name: string]: string;
}) => boolean;
