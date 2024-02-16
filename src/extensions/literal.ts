// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { ColorSupport, crayon, prototype } from "../crayon.ts";
import { replace, replaceAll } from "../util.ts";
import type { Style } from "../styles.ts";

const literalStyleRegex = /{([^\s]+)\s([^{}]+)}/;

/** Compile string to its proper type */
function compileType(string: string): string | number | boolean {
  if (string === "false") return false;
  if (string === "true") return true;

  switch (string[0]) {
    case '"':
    case "'":
    case "`":
      return string.slice(1, -1);
    default:
      return Number(string);
  }
}

export function compileStyleCall(call: string): string {
  let methodName = "";
  let intermediate = "";
  const args = [];

  loop: for (let i = 0; i < call.length; i++) {
    const char = call[i];
    switch (char) {
      case ")":
        break loop;
      case "(":
        methodName = intermediate;
        intermediate = "";
        continue;
      case ",":
        args.push(compileType(intermediate));
        intermediate = "";
        continue;
      default:
        intermediate += char;
    }
  }

  const method = crayon[methodName as Style] as unknown as (
    ...args: unknown[]
  ) => Crayon;
  return method(...args).styleBuffer;
}

export function compileStyle(style: string): string {
  if (style.endsWith(")")) {
    return compileStyleCall(style);
  }

  return crayon[style as Style].styleBuffer;
}

/** Implementation for Crayon's `prototype.literal` call when using ES6 Literal Templates */
export function compileLiteral(
  callSite: TemplateStringsArray,
  ...substitutions: unknown[]
): string {
  let text = "";
  for (let i = 0; i < callSite.length; ++i) {
    text += callSite[i];
    text += substitutions[i] ?? "";
  }

  if (prototype.$colorSupport === ColorSupport.NoColor) return text;

  let matches = text.match(literalStyleRegex);
  while (matches?.length) {
    const matchedStyles = matches[1].split(".");

    let styleBuffer = "";
    for (const style of matchedStyles) {
      styleBuffer += compileStyle(style);
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

prototype.literal = compileLiteral;
