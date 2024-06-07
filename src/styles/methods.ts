// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { ColorSupport, prototype } from "../crayon.ts";
import { ansi4ToAnsi3, ansi8ToAnsi4, hslToRgb, rgbToAnsi8 } from "./conversions.ts";

/** Generate StyleCode from 3bit (8) color pallete */
export function ansi3(bg: boolean, code: number): string {
  if (code > 7 || code < 0) {
    throw new Error("ansi3 function code has to be within 0 and 7");
  }

  if (prototype.$colorSupport < ColorSupport.ThreeBit) {
    return "";
  }

  return `\x1b[${(bg ? 40 : 30) + ~~code}m`;
}

/** Generate StyleCode from 4bit (16) color pallete */
export function ansi4(bg: boolean, code: number): string {
  if (code > 15 || code < 0) {
    throw new Error("ansi4 function code has to be within 0 and 15");
  }

  if (prototype.$colorSupport < ColorSupport.FourBit) {
    return ansi3(bg, ansi4ToAnsi3(code));
  }

  return `\x1b[${((bg ? 10 : 0) + (code > 7 ? 82 : 30)) + ~~code}m`;
}

/** Generate StyleCode from 8bit (256) color pallete */
export function ansi8(bg: boolean, code: number): string {
  if (code > 255 || code < 0) {
    throw new Error("ansi8 function code has to be within 0 and 255");
  }

  if (prototype.$colorSupport < ColorSupport.HighColor) {
    return ansi4(bg, ansi8ToAnsi4(code));
  }

  return `\x1b[${bg ? 48 : 38};5;${~~code}m`;
}

/** Generate StyleCode from RGB values - 24bit (16.7m) color pallete */
export function rgb(bg: boolean, r: number, g: number, b: number): string {
  if (Math.max(r, g, b) > 255 || Math.min(r, g, b) < 0) {
    throw new Error(
      "rgb function's r, g and b parameters have to have values between 0 and 255",
    );
  }

  if (prototype.$colorSupport < ColorSupport.TrueColor) {
    return ansi8(bg, rgbToAnsi8(r, g, b));
  }

  return `\x1b[${bg ? 48 : 38};2;${~~r};${~~g};${~~b}m`;
}

/** Generate StyleCode from HSL values - 24bit (16.7m) color pallete */
export function hsl(bg: boolean, h: number, s: number, l: number): string {
  if (h > 360 || Math.max(s, l) > 100 || Math.min(h, s, l) < 0) {
    throw new Error(
      "hsl function's h parameter can have values between 0 and 360, s and l parameters have to have values between 0 and 100",
    );
  }
  return rgb(bg, ...hslToRgb(h, s, l));
}

/**
 * Generate StyleCode from HEX value - 24bit (16.7m) color pallete
 * @example
 * ```ts
 * hex(0xFF3060);
 * ```
 */
export function hex(bg: boolean, value: number): string {
  if (value > 0xFFFFFF || value < 0) {
    const hexString = value.toString(16);
    throw new Error(
      `Invalid HEX value: ${hexString} – expected hexadecimal number that doesn't exceed 0xFFFFFF and is higher or equal to zero`,
    );
  }

  return rgb(bg, 0xff & (value >> 16), 0xff & (value >> 8), 0xff & value);
}

export default {
  ansi3,
  ansi4,
  ansi8,
  rgb,
  hsl,
  hex,
};
