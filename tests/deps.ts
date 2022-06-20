import { crayon } from "../src/crayon.ts";
import { isDeno } from "../src/util.ts";

import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.137.0/testing/asserts.ts";
export { assert, assertEquals, assertThrows };

let log = "";

export function flushLogOnUnload() {
  if (isDeno()) {
    addEventListener("unload", () => {
      console.log(log);
    });
  } else {
    // @ts-ignore Node compatibility
    process.on("exit", () => {
      console.log(log);
    });
  }
}

export function visualAssertEquals(
  actual: unknown,
  expected: unknown,
  msg?: string,
) {
  log += `a: ${actual}`;
  const strA = String(actual);
  if (strA.includes("\n")) log += "\n";
  else log += "\t".repeat(Math.round(5 - (crayon.strip(strA).length / 8)));
  log += `b: ${expected}\n`;
  assertEquals(actual, expected, msg);
}
