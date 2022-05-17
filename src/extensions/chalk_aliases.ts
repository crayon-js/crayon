// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { ansi8, attributes, BaseColors, colors, StyleCode } from "../styles.ts";
import {
  buildCrayon,
  Crayon,
  mapPrototypeFuncs,
  mapPrototypeStyles,
} from "../crayon.ts";

type BaseChalkColors = BaseColors | "gray" | "grey";
export type ChalkKeywords =
  | BaseChalkColors
  | `bg${Capitalize<BaseChalkColors>}`
  | `bright${Capitalize<BaseChalkColors>}`
  | `bgBright${Capitalize<BaseChalkColors>}`
  | "inverse"
  | "inverseOff";

export const chalkAliases = new Map<ChalkKeywords, StyleCode>([
  ["gray", colors.get("lightBlack")!],
  ["bgGray", colors.get("bgLightBlack")!],
  ["grey", colors.get("lightBlack")!],
  ["bgGrey", colors.get("bgLightBlack")!],
  ["inverse", attributes.get("invert")!],
  ["inverseOff", attributes.get("invertOff")!],
]);

for (const [name, code] of colors.entries()) {
  if (name.slice(0, 5).toLowerCase() !== "light") continue;
  chalkAliases.set(
    (name[0] === "L" ? "Bright" : "bright") + name.slice(5) as ChalkKeywords,
    code,
  );
}

type Ansi8Func = typeof ansi8;
export function ansi256(...args: Parameters<Ansi8Func>): ReturnType<Ansi8Func> {
  return ansi8(...args);
}

mapPrototypeStyles(chalkAliases);
mapPrototypeFuncs(ansi256);
type ChalkAliasedCrayon = Crayon<ChalkKeywords, {
  ansi256: ChalkAliasedCrayon["ansi8"];
  bgAnsi256: ChalkAliasedCrayon["bgAnsi8"];
}>;
export const crayon = buildCrayon<ChalkAliasedCrayon>();
