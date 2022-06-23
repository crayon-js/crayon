import { crayon } from "../src/crayon.ts";
import { isDeno } from "../src/util.ts";

import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.137.0/testing/asserts.ts";
export { assert, assertEquals, assertThrows };

let log = "";

/**
 * Flush `log` to a `console` on:
 * - deno - `unload` window event
 * - node - `exit` process event
 */
export function flushLogOnUnload(): void {
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

/**
 *  Add `actual` and `expected` side-by-side to the `log` string.
 *
 * Then compare them using `assertEquals`.
 */
export function visualAssertEquals(
  actual: unknown,
  expected: unknown,
  msg?: string,
): void {
  log += `a: ${actual}`;
  const strA = String(actual);
  if (strA.includes("\n")) log += "\n";
  else log += "\t".repeat(Math.round(5 - (crayon.strip(strA).length / 8)));
  log += `b: ${expected}\n`;
  assertEquals(actual, expected, msg);
}
