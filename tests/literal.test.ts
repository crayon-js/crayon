// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { crayon, getNoColor } from "../mod.ts";
import { assertThrows, flushLogOnUnload, visualAssertEquals } from "./deps.ts";

if (getNoColor()) {
  console.error(
    "\nThis test is supposed to be run without NO_COLOR env variable.\n",
  );
  Deno.exit(1);
}

flushLogOnUnload();

Deno.test("Extension: Literal Templating ", async (t) => {
  await t.step("Throw when extension isn't imported", () => {
    assertThrows(() => crayon`henlo`);
  });

  await import("../src/extensions/literal.ts");

  await t.step("Support substitutions", () => {
    visualAssertEquals(
      crayon`{bgRed Hello ${2 + 2} is four, {blue how are you ${"Jeff"}?}}`,
      "\x1b[41mHello 4 is four, \x1b[34mhow are you Jeff?\x1b[0m\x1b[41m\x1b[0m",
    );
  });

  await t.step("Support multiple styles", () => {
    visualAssertEquals(
      crayon`{bgBlue.red hello}`,
      "\x1b[44m\x1b[31mhello\x1b[0m",
    );
  });

  await t.step("Support functions", () => {
    visualAssertEquals(
      crayon`{rgb(40,120,80) hello}`,
      "\x1b[38;2;40;120;80mhello\x1b[0m",
    );
    visualAssertEquals(
      crayon`{rgb(40,120,80).bgHex(0xff3080) hello}`,
      "\x1b[38;2;40;120;80m\x1b[48;2;255;48;128mhello\x1b[0m",
    );
    visualAssertEquals(
      crayon`{keyword("yellow") yellow}`,
      "\x1b[33myellow\x1b[0m",
    );
  });

  await t.step("Basic styling", () => {
    visualAssertEquals(crayon`{red Red}`, "\x1b[31mRed\x1b[0m");
    visualAssertEquals(crayon`{bold Bold}`, "\x1b[1mBold\x1b[0m");
    visualAssertEquals(
      crayon`{red.bold Red Bold}`,
      "\x1b[31m\x1b[1mRed Bold\x1b[0m",
    );
    visualAssertEquals(
      crayon`{rgb(230,100,15).bgRgb(15,70,25) How are you?}`,
      "\x1b[38;2;230;100;15m\x1b[48;2;15;70;25mHow are you?\x1b[0m",
    );
  });

  await t.step("Nesting styling", () => {
    visualAssertEquals(
      crayon`{bgBlue.red Hello {yellow how are} you}`,
      "\x1b[44m\x1b[31mHello \x1b[33mhow are\x1b[0m\x1b[44m\x1b[31m you\x1b[0m",
    );

    visualAssertEquals(
      crayon`{blue uno {red dos {lightGreen tres {cyan quatro} tres} dos} uno}`,
      "\x1b[34muno \x1b[31mdos \x1b[92mtres \x1b[36mquatro\x1b[0m\x1b[34m\x1b[31m\x1b[92m tres\x1b[0m\x1b[34m\x1b[31m dos\x1b[0m\x1b[34m uno\x1b[0m",
    );

    visualAssertEquals(
      crayon.bgYellow(
        "Hello" +
          crayon.bgHex(
            0xff0302,
          ).rgb(222, 10, 123)(
            `${crayon.bold("C")}${crayon.italic(`o l o r s`)}`,
          ) +
          crayon.bold.italic("I really enjoy you."),
      ),
      "\x1b[43mHello\x1b[48;2;255;3;2m\x1b[38;2;222;10;123m\x1b[1mC\x1b[0m\x1b[48;2;255;3;2m\x1b[38;2;222;10;123m\x1b[3mo l o r s\x1b[0m\x1b[48;2;255;3;2m\x1b[38;2;222;10;123m\x1b[0m\x1b[43m\x1b[1m\x1b[3mI really enjoy you.\x1b[0m\x1b[43m\x1b[0m\x1b[0m",
    );
  });

  await t.step("Multiline template literal", () => {
    visualAssertEquals(
      crayon`{red 
    Test multiline literal
    {bold bold {blue blue}}}`,
      "\x1b[31m\n    Test multiline literal\n    \x1b[1mbold \x1b[34mblue\x1b[0m\x1b[31m\x1b[1m\x1b[0m\x1b[31m\x1b[0m",
    );
  });
});
