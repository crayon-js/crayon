import { extendMethods, extendStyles } from "./extend.ts";
import {
  ansi3,
  ansi4,
  ansi8,
  attributes,
  fourBitColors,
  hex,
  hsl,
  keyword,
  rgb,
  type Style,
} from "./styles.ts";

extendStyles(attributes);
extendStyles(fourBitColors);
extendMethods({
  ansi3,
  ansi4,
  ansi8,
  rgb,
  hsl,
  hex,
  keyword: [keyword, false],
});

type BaseStyles = { [K in Style]: Crayon };
declare global {
  interface Crayon extends BaseStyles {
    ansi3(code: number): Crayon;
    bgAnsi3(code: number): Crayon;
    ansi4(code: number): Crayon;
    bgAnsi4(code: number): Crayon;
    ansi8(code: number): Crayon;
    bgAnsi8(code: number): Crayon;
    rgb(r: number, g: number, b: number): Crayon;
    bgRgb(r: number, g: number, b: number): Crayon;
    hsl(h: number, s: number, l: number): Crayon;
    bgHsl(h: number, s: number, l: number): Crayon;
    hex(hex: number): Crayon;
    bgHex(hex: number): Crayon;
    keyword(name: string): Crayon | undefined;
  }
}
