// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { capitalize } from "../utils/capitalize.ts";
import { ansi3, ansi4 } from "./methods.ts";

const threeBitColorNames = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
] as const;
type ThreeBitColor = typeof threeBitColorNames[number];

export type FourBitColor =
  | ThreeBitColor
  | `bg${Capitalize<ThreeBitColor>}`
  | `light${Capitalize<ThreeBitColor>}`
  | `bgLight${Capitalize<ThreeBitColor>}`;

const fourBitColors: Partial<Record<FourBitColor, string>> = {};

for (const [i, color] of threeBitColorNames.entries()) {
  const capitalizedColor = capitalize(color);
  fourBitColors[color] = ansi3(false, i);
  fourBitColors[`bg${capitalizedColor}`] = ansi3(true, i);
  fourBitColors[`light${capitalizedColor}`] = ansi4(false, i + 8);
  fourBitColors[`bgLight${capitalizedColor}`] = ansi4(true, i + 8);
}

export default fourBitColors as Record<FourBitColor, string>;
