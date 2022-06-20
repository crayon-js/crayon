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

  assertEquals(crayon.gray.styleBuffer, crayon.grey.styleBuffer);
  assertEquals(crayon.gray.styleBuffer, crayon.lightBlack.styleBuffer);

  assertEquals(crayon.bgGray.styleBuffer, crayon.bgGrey.styleBuffer);
  assertEquals(crayon.bgGray.styleBuffer, crayon.bgLightBlack.styleBuffer);
});
