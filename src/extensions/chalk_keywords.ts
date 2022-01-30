import { ansi8, attributes, BaseColors, colors, StyleCode } from "../styles.ts";
import { mapPrototypeFuncs, mapPrototypeStyles } from "../crayon.ts";

const lightRegex = /[Ll]ight/;

export type BaseChalkColors = BaseColors | "gray" | "grey";

export type ChalkKeywords =
  | BaseChalkColors
  | `bg${Capitalize<BaseChalkColors>}`
  | `bright${Capitalize<BaseChalkColors>}`
  | `bgBright${Capitalize<BaseChalkColors>}`
  | "inverse"
  | "inverseOff";

export const chalkKeywords = new Map<ChalkKeywords, StyleCode>([
  ["gray", colors.get("lightBlack")!],
  ["bgGray", colors.get("bgLightBlack")!],
  ["grey", colors.get("lightBlack")!],
  ["bgGrey", colors.get("bgLightBlack")!],
  ["inverse", attributes.get("invert")!],
  ["inverseOff", attributes.get("invertOff")!],
]);

for (const [name, code] of colors.entries()) {
  const match = name.match(lightRegex);
  if (!match) continue;

  const brightCasing = name.includes("light") ? "bright" : "Bright";
  const aliasName = name.replace(match[0], brightCasing);
  chalkKeywords.set(aliasName as ChalkKeywords, code);
}

type Ansi8Func = typeof ansi8;
export function ansi256(...args: Parameters<Ansi8Func>): ReturnType<Ansi8Func> {
  return ansi8(...args);
}

mapPrototypeStyles(chalkKeywords);
mapPrototypeFuncs(ansi256);
