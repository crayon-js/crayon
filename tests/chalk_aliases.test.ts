// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { chalkAliases, crayon } from "../src/extensions/chalk_aliases.ts";
import { Style } from "../src/styles.ts";
import { assertEquals } from "./deps.ts";

Deno.test("Extension: Chalk aliases", () => {
  for (const [alias] of chalkAliases.entries()) {
    const lightAlias = alias.replace("bright", "light") as Style;

    assertEquals(
      crayon[alias].styleBuffer,
      crayon[lightAlias].styleBuffer,
    );
  }

  for (let i = 0; i < 256; ++i) {
    assertEquals(crayon.ansi256(i).styleBuffer, crayon.ansi8(i).styleBuffer);
  }

  assertEquals(crayon.gray.styleBuffer, crayon.grey.styleBuffer);
  assertEquals(crayon.gray.styleBuffer, crayon.lightBlack.styleBuffer);

  assertEquals(crayon.bgGray.styleBuffer, crayon.bgGrey.styleBuffer);
  assertEquals(crayon.bgGray.styleBuffer, crayon.bgLightBlack.styleBuffer);
});
