// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { crayon, cssKeywords } from "../src/extensions/css_keywords.ts";
import { assertEquals } from "./deps.ts";
import { getNoColor } from "../mod.ts";

if (getNoColor()) {
  console.error(
    "\nThis test is supposed to be run without NO_COLOR env variable.\n",
  );
  Deno.exit(1);
}

Deno.test("Extension: Css Keywords", () => {
  for (const [style, code] of cssKeywords.entries()) {
    assertEquals(
      crayon[style].styleBuffer,
      typeof code === "function" ? code() : code,
    );
  }
});
