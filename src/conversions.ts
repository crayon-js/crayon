// Copyright 2022 Im-Beast. All rights reserved. MIT license.
/**
 * Converts 4Bit (16) ANSI color representation to 3Bit (8) ANSI
 */
export function ansi4ToAnsi3(code: number): number {
  return code % 8;
}

/**
 * Converts RGB color representation to 4Bit (16) ANSI
 *
 * This is slightly modified rgb.ansi16 conversion from https://github.com/Qix-/color-convert/blob/master/conversions.js
 */
export function rgbToAnsi4(r: number, g: number, b: number): number {
  const value = Math.round(Math.max(r, g, b) / 64);
  return !value ? 0 : (
    ((value >= 3 ? 8 : 0) + (Math.round(b / 255) << 2)) |
    (Math.round(g / 255) << 1) |
    Math.round(r / 255)
  );
}

/**
 * Converts RGB color representation to 8Bit (256) ANSI
 *
 * This is slightly modified rgb.ansi256 conversion from https://github.com/Qix-/color-convert/blob/master/conversions.js
 */
export function rgbToAnsi8(r: number, g: number, b: number): number {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return r >> 4 === g >> 4 && g >> 4 === b >> 4
    ? r < 8 ? 16 : r > 248 ? 231 : Math.round(((r - 8) / 247) * 24) + 232
    : 16 +
      36 * Math.round((r / 255) * 5) +
      6 * Math.round((g / 255) * 5) +
      Math.round((b / 255) * 5);
}

// TODO: Use direct conversion (ansi8->ansi4) instead of going ansi8->rgb->ansi4
/**
 * Converts 8Bit (256) ANSI color representation to 4Bit (16) ANSI
 *
 * This is slightly modified ansi256.rgb conversion from https://github.com/Qix-/color-convert/blob/master/conversions.js
 */
export const ansi8ToAnsi4 = (code: number): number => {
  if (code >= 232) {
    const grayness = (code - 232) * 10 + 8;
    return rgbToAnsi4(grayness, grayness, grayness);
  }

  code -= 16;

  const rem = code % 36;
  const r = (Math.floor(code / 36) / 5) * 255;
  const g = (Math.floor(rem / 6) / 5) * 255;
  const b = ((rem % 6) / 5) * 255;

  return rgbToAnsi4(r, g, b);
};

/**
 * Converts HSL color representation to RGB
 *
 * Used algorithm from https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number,
): [number, number, number] {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (number: number) => {
    const k = (number + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };

  return [f(0), f(8), f(4)];
}
