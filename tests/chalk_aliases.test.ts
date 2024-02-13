// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { chalkAliases, crayon } from "../src/extensions/chalk_aliases.ts";
import { assertEquals } from "./deps.ts";
import { getNoColor, Style } from "../mod.ts";

if (getNoColor()) {
  console.error(
    "\nThis test is supposed to be run without NO_COLOR env variable.\n",
  );
  Deno.exit(1);
}

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
