// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { assertEquals } from "./deps.ts";
import { crayon, cssKeywords } from "../src/extensions/css_keywords.ts";

Deno.test("Extension: Css Keywords", () => {
  for (const [style, code] of cssKeywords.entries()) {
    assertEquals(crayon[style].styleBuffer, code);
  }
});
