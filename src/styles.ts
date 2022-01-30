import {
  ansi4ToAnsi3,
  ansi8ToAnsi4,
  hslToRgb,
  rgbToAnsi8,
} from "./conversions.ts";
import { colorSupport } from "./crayon.ts";
import { clamp, GetMapKeys } from "./util.ts";

/** ANSI escape code */
export type StyleCode =
  | ""
  | `\x1b[${number}m`
  | `\x1b[${number};5;${number}m`
  | `\x1b[${number};2;${number};${number};${number}m`;

/** Colors used to generate all 4bit colors */
const baseColors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
] as const;
export type BaseColors = typeof baseColors[number];

/** Names for all 4bit colors */
export type Color =
  | BaseColors
  | `bg${Capitalize<BaseColors>}`
  | `light${Capitalize<BaseColors>}`
  | `bgLight${Capitalize<BaseColors>}`;

/** Map containing all 4bit colors */
export const colors = new Map<Color, StyleCode>();
for (const [i, color] of baseColors.entries()) {
  const capitalized = color[0].toUpperCase() + color.slice(1) as Capitalize<
    typeof color
  >;

  colors.set(color, `\x1b[${30 + i}m`);
  colors.set(`bg${capitalized}`, `\x1b[${40 + i}m`);
  colors.set(`light${capitalized}`, `\x1b[${90 + i}m`);
  colors.set(`bgLight${capitalized}`, `\x1b[${100 + i}m`);
}

/** Map containing attributes */
export const attributes = new Map(
  [
    ["reset", "\x1b[0m"],
    ["bold", "\x1b[1m"],
    ["dim", "\x1b[2m"],
    ["italic", "\x1b[3m"],
    ["underline", "\x1b[4m"],
    ["blink", "\x1b[5m"],
    ["fastBlink", "\x1b[6m"],
    ["invert", "\x1b[7m"],
    ["hidden", "\x1b[8m"],
    ["strikethrough", "\x1b[9m"],
    ["boldOff", "\x1b[21m"],
    ["doubleUnderline", "\x1b[21m"],
    ["boldOrDimOff", "\x1b[22m"],
    ["italicOff", "\x1b[23m"],
    ["underlineOff", "\x1b[24m"],
    ["blinkOff", "\x1b[25m"],
    ["invertOff", "\x1b[26m"],
    ["hiddenOff", "\x1b[27m"],
    ["strikethroughOff", "\x1b[28m"],
  ] as const,
);

/** Names for all supported attributes */
export type Attribute = GetMapKeys<typeof attributes>;

export type Style = Attribute | Color;

export function keyword(style: Style): string {
  return (colors.get(style as Color) ?? attributes.get(style as Attribute))!;
}

export function ansi3(code: number, bg?: boolean): string {
  if (colorSupport.threeBitColor) return "";
  return `\x1b[${bg ? 40 : 30 + clamp(code, 0, 7)}m`;
}

export function ansi4(code: number, bg?: boolean): string {
  if (colorSupport.fourBitColor) return ansi3(ansi4ToAnsi3(code), bg);
  return `\x1b[${bg ? 10 : 0 + code > 7 ? 82 : 30 + clamp(code, 0, 15)}m`;
}

export function ansi8(code: number, bg?: boolean): string {
  if (colorSupport.highColor) return ansi4(ansi8ToAnsi4(code), bg);
  return `\x1b[${bg ? 48 : 38};5;${clamp(code, 0, 255)}m`;
}

export function rgb(r: number, g: number, b: number, bg?: boolean): string {
  if (!colorSupport.trueColor) return ansi8(rgbToAnsi8(r, g, b), bg);
  return `\x1b[${bg ? 48 : 38};2;${r};${g};${b}m`;
}

export function hsl(h: number, s: number, l: number, bg?: boolean): string {
  return rgb(...hslToRgb(h, s, l), bg);
}

export function hex(value: string | number, bg?: boolean): string {
  if (typeof value === "number") {
    return rgb(0xff & (value >> 16), 0xff & (value >> 8), 0xff & value, bg);
  }

  if (/(#?)([0-F]|[0-f]){6}/.test(value)) {
    const chunks = value.replace("#", "").match(/.{2}/g);
    return rgb(
      ...chunks!.map((v) => parseInt(v, 16)) as [number, number, number],
      bg,
    );
  }

  throw new Error(
    `Invalid HEX value: "${value}", e.g. expected string - "#ABCDEF" or number - 0xABCDEF`,
  );
}
