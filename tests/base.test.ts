// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { assertEquals } from "@std/assert";
import { env, test } from "@beast/compat";

import crayon, { buildCrayon, ColorSupport } from "../main.ts";

const NO_COLOR = !!(env("NO_COLOR") && env("NO_COLOR") !== "0");

test("Color support", async (t) => {
  const otherCrayon = buildCrayon<typeof crayon>("", false);
  // Crayon should default to TrueColor
  await t.step("Default values", () => {
    const DEFAULT_VALUE = NO_COLOR ? ColorSupport.NoColor : ColorSupport.TrueColor;
    assertEquals(crayon.colorSupport, DEFAULT_VALUE);
    assertEquals(otherCrayon.colorSupport, DEFAULT_VALUE);
  });

  // Changing color support should affect all built crayons
  await t.step.ignoreIf(NO_COLOR)("Modifying color support", () => {
    crayon.colorSupport = ColorSupport.FourBit;
    assertEquals(crayon.colorSupport, ColorSupport.FourBit);
    assertEquals(otherCrayon.colorSupport, ColorSupport.FourBit);

    crayon.colorSupport = ColorSupport.HighColor;
    assertEquals(crayon.colorSupport, ColorSupport.HighColor);
    assertEquals(otherCrayon.colorSupport, ColorSupport.HighColor);

    crayon.colorSupport = ColorSupport.TrueColor;
    assertEquals(crayon.colorSupport, ColorSupport.TrueColor);
    assertEquals(otherCrayon.colorSupport, ColorSupport.TrueColor);
  });

  // This test should only run when NO_COLOR is set
  //
  // If ColorSupport is set to NoColor all crayons should be the same
  // and should not style the text in any way.
  await t.step.ignoreIf(!NO_COLOR)("NO_COLOR", () => {
    assertEquals(crayon.colorSupport, ColorSupport.NoColor);
    assertEquals(otherCrayon.colorSupport, ColorSupport.NoColor);

    assertEquals(crayon("test"), "test");
    assertEquals(otherCrayon("test"), "test");

    assertEquals(crayon.red("test"), "test");
    assertEquals(otherCrayon.red("test"), "test");

    assertEquals(crayon.bgRed("test"), "test");
    assertEquals(otherCrayon.bgRed("test"), "test");

    assertEquals(crayon.bold("test"), "test");
    assertEquals(otherCrayon.bold("test"), "test");

    assertEquals(crayon.rgb(1, 1, 1), crayon);
    assertEquals(otherCrayon.rgb(1, 1, 1), crayon);

    assertEquals(crayon.bold.red.bgBlue, crayon);
  });
});

// These tests only test functionality for terminals that support at least 4 colors
test.ignoreIf(NO_COLOR)("Colored tests", async (t) => {
  await t.step("Styling", async (t) => {
    await t.step("Basic", () => {
      assertEquals(crayon.red("test"), "\x1b[31mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.green("test"), "\x1b[32mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.blue("test"), "\x1b[34mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.cyan("test"), "\x1b[36mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.magenta("test"), "\x1b[35mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.yellow("test"), "\x1b[33mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.black("test"), "\x1b[30mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.white("test"), "\x1b[37mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.lightRed("test"), "\x1b[91mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.lightGreen("test"), "\x1b[92mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.lightBlue("test"), "\x1b[94mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.lightCyan("test"), "\x1b[96mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.lightMagenta("test"), "\x1b[95mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.lightYellow("test"), "\x1b[93mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.lightBlack("test"), "\x1b[90mtest\x1b[0m\x1b[0m");

      assertEquals(crayon.bgRed("test"), "\x1b[41mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgGreen("test"), "\x1b[42mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgBlue("test"), "\x1b[44mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgCyan("test"), "\x1b[46mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgMagenta("test"), "\x1b[45mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgYellow("test"), "\x1b[43mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgBlack("test"), "\x1b[40mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgWhite("test"), "\x1b[47mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgLightRed("test"), "\x1b[101mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgLightGreen("test"), "\x1b[102mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgLightBlue("test"), "\x1b[104mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgLightCyan("test"), "\x1b[106mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgLightMagenta("test"), "\x1b[105mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgLightYellow("test"), "\x1b[103mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bgLightBlack("test"), "\x1b[100mtest\x1b[0m\x1b[0m");

      assertEquals(crayon.bgRed("test"), "\x1b[41mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.bold("test"), "\x1b[1mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.dim("test"), "\x1b[2mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.italic("test"), "\x1b[3mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.underline("test"), "\x1b[4mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.blink("test"), "\x1b[5mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.fastBlink("test"), "\x1b[6mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.invert("test"), "\x1b[7mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.hidden("test"), "\x1b[8mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.strikethrough("test"), "\x1b[9mtest\x1b[0m\x1b[0m");
    });

    await t.step("Chaining", () => {
      assertEquals(crayon.red.bold("test"), "\x1b[31m\x1b[1mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.red.bgRed.bold("test"), "\x1b[31m\x1b[41m\x1b[1mtest\x1b[0m\x1b[0m");
      assertEquals(
        crayon.red.bgRed.bold.underline("test"),
        "\x1b[31m\x1b[41m\x1b[1m\x1b[4mtest\x1b[0m\x1b[0m",
      );
      assertEquals(
        crayon.blue.bgRgb(255, 0, 5).bold("test"),
        "\x1b[34m\x1b[48;2;255;0;5m\x1b[1mtest\x1b[0m\x1b[0m",
      );
    });

    await t.step("Nesting", () => {
      assertEquals(
        crayon.yellow(`Hello ${crayon.bold("pretty")} world`),
        "\x1b[33mHello \x1b[1mpretty\x1b[0m\x1b[33m world\x1b[0m\x1b[0m",
      );
      assertEquals(
        crayon.rgb(0, 0, 255)(`Hello ${crayon.rgb(255, 255, 0)("pretty")} world`),
        "\x1b[38;2;0;0;255mHello \x1b[38;2;255;255;0mpretty\x1b[0m\x1b[38;2;0;0;255m world\x1b[0m\x1b[0m",
      );
    });
  });

  await t.step("Color conversion", async (t) => {
    await t.step("HSL -> 8BIT", () => {
      crayon.colorSupport = ColorSupport.HighColor;
      assertEquals(crayon.hsl(0, 100, 100)("test"), "\x1b[38;5;231mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.hsl(60, 100, 50)("test"), "\x1b[38;5;226mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.hsl(120, 100, 50)("test"), "\x1b[38;5;46mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.hsl(180, 100, 50)("test"), "\x1b[38;5;51mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.hsl(240, 100, 50)("test"), "\x1b[38;5;21mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.hsl(300, 100, 50)("test"), "\x1b[38;5;201mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.hsl(360, 100, 50)("test"), "\x1b[38;5;196mtest\x1b[0m\x1b[0m");
      crayon.colorSupport = ColorSupport.TrueColor;
    });

    await t.step("RGB -> 8BIT", () => {
      crayon.colorSupport = ColorSupport.HighColor;
      assertEquals(crayon.rgb(255, 0, 0)("test"), "\x1b[38;5;196mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(255, 255, 0)("test"), "\x1b[38;5;226mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(127, 255, 63)("test"), "\x1b[38;5;119mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 255, 0)("test"), "\x1b[38;5;46mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 255, 127)("test"), "\x1b[38;5;48mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(63, 255, 127)("test"), "\x1b[38;5;84mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 255, 255)("test"), "\x1b[38;5;51mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 127, 255)("test"), "\x1b[38;5;33mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 0, 255)("test"), "\x1b[38;5;21mtest\x1b[0m\x1b[0m");
      crayon.colorSupport = ColorSupport.TrueColor;
    });

    await t.step("RGB -> 4BIT", () => {
      crayon.colorSupport = ColorSupport.FourBit;
      assertEquals(crayon.rgb(255, 0, 0)("test"), "\x1b[91mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(255, 255, 0)("test"), "\x1b[93mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(127, 255, 63)("test"), "\x1b[92mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 255, 0)("test"), "\x1b[92mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 255, 127)("test"), "\x1b[92mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(63, 255, 127)("test"), "\x1b[92mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 255, 255)("test"), "\x1b[96mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 127, 255)("test"), "\x1b[94mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.rgb(0, 0, 255)("test"), "\x1b[94mtest\x1b[0m\x1b[0m");
      crayon.colorSupport = ColorSupport.TrueColor;
    });

    await t.step("8BIT -> 4BIT", () => {
      crayon.colorSupport = ColorSupport.FourBit;
      assertEquals(crayon.ansi8(255)("test"), "\x1b[97mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(239)("test"), "\x1b[30mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(231)("test"), "\x1b[97mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(226)("test"), "\x1b[93mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(196)("test"), "\x1b[91mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(123)("test"), "\x1b[96mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(21)("test"), "\x1b[94mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(37)("test"), "\x1b[36mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(0)("test"), "\x1b[30mtest\x1b[0m\x1b[0m");
      crayon.colorSupport = ColorSupport.TrueColor;
    });

    await t.step("8BIT -> 3BIT", () => {
      crayon.colorSupport = ColorSupport.ThreeBit;
      assertEquals(crayon.ansi8(255)("test"), "\x1b[37mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(239)("test"), "\x1b[30mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(231)("test"), "\x1b[37mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(226)("test"), "\x1b[33mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(196)("test"), "\x1b[31mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(123)("test"), "\x1b[36mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(21)("test"), "\x1b[34mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(37)("test"), "\x1b[36mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi8(0)("test"), "\x1b[30mtest\x1b[0m\x1b[0m");
      crayon.colorSupport = ColorSupport.TrueColor;
    });

    await t.step("4BIT -> 3BIT", () => {
      crayon.colorSupport = ColorSupport.ThreeBit;
      assertEquals(crayon.ansi4(15)("test"), "\x1b[37mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi4(7)("test"), "\x1b[37mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi4(0)("test"), "\x1b[30mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi4(1)("test"), "\x1b[31mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi4(2)("test"), "\x1b[32mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi4(3)("test"), "\x1b[33mtest\x1b[0m\x1b[0m");
      assertEquals(crayon.ansi4(4)("test"), "\x1b[34mtest\x1b[0m\x1b[0m");
      crayon.colorSupport = ColorSupport.TrueColor;
    });
  });

  await t.step("Extensions", () => {
    const obj = {
      dynamic: () => "\x1b[32m\x1b[1m",
      static: "\x1b[31m",
      variantFn: (bg: boolean, a: number) => `\x1b[${(bg ? 40 : 30) + a}m`,
    };

    const extended = crayon.use(obj);

    assertEquals(extended.dynamic("hello"), "\x1b[32m\x1b[1mhello\x1b[0m\x1b[0m");
    assertEquals(extended.static("hello"), "\x1b[31mhello\x1b[0m\x1b[0m");
    assertEquals(extended.variantFn(1)("hello"), "\x1b[31mhello\x1b[0m\x1b[0m");
    assertEquals(extended.variantFn(2)("hello"), "\x1b[32mhello\x1b[0m\x1b[0m");
    assertEquals(extended.bgVariantFn(1)("hello"), "\x1b[41mhello\x1b[0m\x1b[0m");
    assertEquals(extended.bgVariantFn(2)("hello"), "\x1b[42mhello\x1b[0m\x1b[0m");
  });
});
