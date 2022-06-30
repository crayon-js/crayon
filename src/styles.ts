// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import {
  ansi4ToAnsi3,
  ansi8ToAnsi4,
  hslToRgb,
  rgbToAnsi8,
} from "./conversions.ts";
import { colorSupport, styles } from "./crayon.ts";
import { GetMapKeys } from "./util.ts";

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
export const colors = new Map<Color, () => StyleCode>();

// Generate colors from baseColors
for (const [i, color] of baseColors.entries()) {
  const capitalized = color[0].toUpperCase() + color.slice(1) as Capitalize<
    typeof color
  >;

  colors.set(color, () => ansi3(i, false));
  colors.set(`bg${capitalized}`, () => ansi3(i, true));
  colors.set(`light${capitalized}`, () => ansi4(i + 8, false));
  colors.set(`bgLight${capitalized}`, () => ansi4(i + 8, true));
}

/** Map containing all supported attributes */
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

/** All supported attributes */
export type Attribute = GetMapKeys<typeof attributes>;

/** Every possible style */
export type Style = Attribute | Color;

/**
 * Retrieve style using string
 * @param style - map key
 */
export function keyword(style: Style): StyleCode;
export function keyword(style: string): StyleCode;
export function keyword(style: string): StyleCode {
  const code = styles.get(style);
  if (!code) {
    throw new Error(`Style "${style}" doesn't exist`);
  }
  return typeof code === "function" ? code() : code;
}

/** Generate StyleCode from 3bit (8) color pallete */
export function ansi3(code: number, bg?: boolean): StyleCode {
  if (code > 7 || code < 0) {
    throw new Error("ansi3 function code has to be within 0 and 7");
  }
  if (!colorSupport.threeBitColor) return "";
  return `\x1b[${(bg ? 40 : 30) + ~~code}m`;
}

/** Generate StyleCode from 4bit (16) color pallete */
export function ansi4(code: number, bg?: boolean): StyleCode {
  if (code > 15 || code < 0) {
    throw new Error("ansi4 function code has to be within 0 and 15");
  }
  if (!colorSupport.fourBitColor) return ansi3(ansi4ToAnsi3(code), bg);
  return `\x1b[${((bg ? 10 : 0) + (code > 7 ? 82 : 30)) + ~~code}m`;
}

/** Generate StyleCode from 8bit (256) color pallete */
export function ansi8(code: number, bg?: boolean): StyleCode {
  if (code > 255 || code < 0) {
    throw new Error("ansi8 function code has to be within 0 and 255");
  }
  if (!colorSupport.highColor) return ansi4(ansi8ToAnsi4(code), bg);
  return `\x1b[${bg ? 48 : 38};5;${~~code}m`;
}

/** Generate StyleCode from RGB values - 24bit (16.7m) color pallete */
export function rgb(r: number, g: number, b: number, bg?: boolean): StyleCode {
  if (Math.max(r, g, b) > 255 || Math.min(r, g, b) < 0) {
    throw new Error(
      "rgb function's r, g and b parameters have to have values between 0 and 255",
    );
  }
  if (!colorSupport.trueColor) return ansi8(rgbToAnsi8(r, g, b), bg);
  return `\x1b[${bg ? 48 : 38};2;${~~r};${~~g};${~~b}m`;
}

/** Generate StyleCode from HSL values - 24bit (16.7m) color pallete */
export function hsl(h: number, s: number, l: number, bg?: boolean): StyleCode {
  if (h > 360 || Math.max(s, l) > 100 || Math.min(h, s, l) < 0) {
    throw new Error(
      "hsl function's h parameter can have values between 0 and 360, s and l parameters have to have values between 0 and 100",
    );
  }
  return rgb(...hslToRgb(h, s, l), bg);
}

/**
 * Generate StyleCode from HEX value - 24bit (16.7m) color pallete
 * @example
 * ```ts
 * hex(0xFF3060); // <- this is faster
 * hex("#FF3060");
 * ```
 */
export function hex(value: string | number, bg?: boolean): StyleCode {
  let hexNum: number = value as number;

  if (typeof value !== "number" && (isNaN(hexNum) || value === "")) {
    hexNum = parseInt(value.slice(1), 16);
    if (isNaN(hexNum) || value.slice(1) === "") {
      throw new Error(
        `Invalid HEX value: "${value}": expected string - "#ABCDEF" / "#abcdef" or number - 0xABCDEF`,
      );
    }
  }

  if (hexNum > 0xFFFFFF || hexNum < 0) {
    throw new Error(
      `Invalid HEX value: 0x${
        value.toString(16)
      }: expected hexadecimal number that doesn't exceed 0xFFFFFF and is higher or equal to zero`,
    );
  }

  return rgb(0xff & (hexNum >> 16), 0xff & (hexNum >> 8), 0xff & hexNum, bg);
}
