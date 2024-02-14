import { extendObject } from "./extend.ts";
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

extendObject(attributes);
extendObject(fourBitColors);
extendObject({
  ansi3,
  ansi4,
  ansi8,
  rgb,
  hsl,
  hex,
  keyword,
});

type BaseStyles = { [K in Style]: Crayon };
declare global {
  interface Crayon extends BaseStyles {
    ansi3(code: number): string;
    ansi4(code: number): string;
    ansi8(code: number): string;
    rgb(r: number, g: number, b: number): string;
    hsl(h: number, s: number, l: number): string;
    hex(hex: string): string;
    keyword(name: string): string | undefined;
  }
}
