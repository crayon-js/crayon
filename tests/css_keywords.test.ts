// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { assertEquals } from "https://deno.land/std@0.137.0/testing/asserts.ts";
import { crayon, cssKeywords } from "../src/extensions/css_keywords.ts";

Deno.test("Extension: Chalk aliases", () => {
  for (const [style, code] of cssKeywords.entries()) {
    assertEquals(crayon[style].styleBuffer, code);
  }
});
