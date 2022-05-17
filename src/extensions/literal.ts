// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { colorSupport, functions, prototype, styles } from "../crayon.ts";
import { replace, replaceAll } from "../util.ts";

const literalStyleRegex = /{([^\s]+)\s([^{}]+)}/;
const literalFuncRegex = /(\w+)\((.*)\)/;

export function compileLiteral(
  callSite: readonly string[],
  ...substitutions: unknown[]
): string {
  // Faster alternative to `String.raw`
  let text = "";
  for (let i = 0; i < callSite.length; ++i) {
    text += callSite[i];
    text += substitutions[i] ?? "";
  }

  if (colorSupport.noColor) return text;

  let matches = text.match(literalStyleRegex);
  while (matches?.length) {
    const matchedStyles = matches[1].split(".");

    let styleBuffer = "";
    for (const style of matchedStyles) {
      const code = styles.get(style);
      if (code) {
        styleBuffer += code;
      } else {
        const match = style.match(literalFuncRegex);
        if (!match?.length) continue;
        let name = match[1];
        const isBg = name.startsWith("bg");
        if (isBg) name = name.slice(2).toLowerCase();
        const args = match[2].split(",").map(compileType);

        const func = functions.get(name);
        if (func) styleBuffer += func(...args, isBg);
      }
    }

    const matchedText = replaceAll(
      matches[2],
      "\x1b[0m",
      "\x1b[0m" + styleBuffer,
    );
    text = replace(text, matches[0], styleBuffer + matchedText + "\x1b[0m");

    matches = text.match(literalStyleRegex);
  }

  return text;
}

export function compileType(string: string): string | number | boolean {
  if (string === "false" || string === "true") return Boolean(string);
  else if (!isNaN(string as unknown as number)) return Number(string);
  else return string.replace(/('|"|`)(.+)(\1)/, "$2");
}

prototype.literal = compileLiteral;
