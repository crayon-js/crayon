// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import {
  buildCrayon,
  colorSupport,
  Crayon,
  crayon,
  getNoColor,
  isDeno,
  isNode,
  mapPrototypeFuncs,
  mapPrototypeStyles,
  replace,
  StyleCode,
} from "../mod.ts";

import {
  assert,
  assertEquals,
  flushLogOnUnload,
  visualAssertEquals,
} from "./deps.ts";

if (getNoColor()) {
  console.error("\nThis test doesn't support NO_COLOR\n");
  Deno.exit(1);
}

flushLogOnUnload();

Deno.test("Config", async (t) => {
  await t.step("Default values (NO_COLOR support)", () => {
    const noColor = getNoColor();
    const hasColor = !noColor || noColor == "0" ? true : false;

    assertEquals(
      crayon.colorSupport,
      {
        noColor: !hasColor,
        trueColor: hasColor,
        highColor: hasColor,
        fourBitColor: hasColor,
        threeBitColor: hasColor,
      },
    );
  });

  await t.step("Property and object assignment", () => {
    const old = crayon.colorSupport;

    crayon.colorSupport = {
      fourBitColor: false,
      highColor: false,
      threeBitColor: false,
      trueColor: false,
    };

    // Make sure that object doesn't loose reference, just properties change value
    assertEquals(old, crayon.colorSupport);
    assertEquals(colorSupport, crayon.colorSupport);
    assertEquals(crayon.colorSupport, {
      noColor: old.noColor,
      trueColor: false,
      highColor: false,
      fourBitColor: false,
      threeBitColor: false,
    });

    crayon.colorSupport.fourBitColor = true;
    assertEquals(crayon.colorSupport.fourBitColor, true);
    assertEquals(crayon.colorSupport, {
      noColor: old.noColor,
      trueColor: false,
      highColor: false,
      fourBitColor: true,
      threeBitColor: false,
    });
    visualAssertEquals(colorSupport, crayon.colorSupport);

    crayon.colorSupport = {
      trueColor: true,
      highColor: true,
      fourBitColor: true,
      threeBitColor: true,
    };
    visualAssertEquals(colorSupport, crayon.colorSupport);
  });
});

Deno.test("Chaining", async (t) => {
  await t.step("Support multiple arguments", () => {
    visualAssertEquals(
      crayon.red("hello", "world"),
      "\x1b[31mhello world\x1b[0m\x1b[0m",
    );
  });

  await t.step("Caching", () => {
    const cache = crayon.bgRgb(75, 30, 15).red.bold.italic.underline;
    const firstRun = cache("Hello world");

    visualAssertEquals(
      firstRun,
      "\x1b[48;2;75;30;15m\x1b[31m\x1b[1m\x1b[3m\x1b[4mHello world\x1b[0m\x1b[0m",
    );

    for (let i = 0; i < 10; ++i) {
      assertEquals(cache("Hello world"), firstRun);
    }
  });

  await t.step("Styling", async (t2) => {
    await t2.step("Pure crayon doesn't apply styling", () => {
      visualAssertEquals(crayon("Hello"), "Hello");
    });

    await t2.step("Cast arguments to string", () => {
      visualAssertEquals(
        crayon(0, {}, false),
        "0 [object Object] false",
      );
    });

    await t2.step("Style order", () => {
      visualAssertEquals(
        crayon.red.green("Hello"),
        "\x1b[31m\x1b[32mHello\x1b[0m\x1b[0m",
      );
      visualAssertEquals(
        crayon.bgRed.bgGreen("Hello"),
        "\x1b[41m\x1b[42mHello\x1b[0m\x1b[0m",
      );
    });

    await t2.step("Basic styling", () => {
      visualAssertEquals(crayon.red("Red"), "\x1b[31mRed\x1b[0m\x1b[0m");
      visualAssertEquals(crayon.bold("Bold"), "\x1b[1mBold\x1b[0m\x1b[0m");
      visualAssertEquals(
        crayon.red.bold("Red Bold"),
        "\x1b[31m\x1b[1mRed Bold\x1b[0m\x1b[0m",
      );
      visualAssertEquals(
        crayon.rgb(230, 100, 15).bgRgb(15, 70, 25)("Rainbow"),
        "\x1b[38;2;230;100;15m\x1b[48;2;15;70;25mRainbow\x1b[0m\x1b[0m",
      );
    });

    await t2.step("Nesting styles", () => {
      visualAssertEquals(
        crayon.bgBlue.red("Hello", crayon.yellow("how are"), "you"),
        "\x1b[44m\x1b[31mHello \x1b[33mhow are\x1b[0m\x1b[44m\x1b[31m you\x1b[0m\x1b[0m",
      );

      visualAssertEquals(
        crayon.blue(
          `uno ${
            crayon.red(
              `dos ${
                crayon.lightGreen(`tres ${crayon.cyan("quatro")} tres`)
              } dos`,
            )
          } uno`,
        ),
        "\x1b[34muno \x1b[31mdos \x1b[92mtres \x1b[36mquatro\x1b[0m\x1b[92m tres\x1b[0m\x1b[31m dos\x1b[0m\x1b[34m uno\x1b[0m\x1b[0m",
      );
    });
  });
});

Deno.test("Color conversions", async (t) => {
  await t.step("hsl -> 8bit", () => {
    crayon.colorSupport.trueColor = false;

    visualAssertEquals(
      crayon.hsl(360, 50, 50)("test"),
      "\x1b[38;5;167mtest\x1b[0m\x1b[0m",
    );

    crayon.colorSupport.trueColor = true;
  });

  await t.step("rgb -> 8bit", () => {
    crayon.colorSupport.trueColor = false;

    visualAssertEquals(
      crayon.rgb(255, 127, 127)("test"),
      "\x1b[38;5;210mtest\x1b[0m\x1b[0m",
    );
    visualAssertEquals(
      crayon.rgb(8, 15, 15)("test"),
      "\x1b[38;5;232mtest\x1b[0m\x1b[0m",
    );
    visualAssertEquals(
      crayon.rgb(7, 15, 15)("test"),
      "\x1b[38;5;16mtest\x1b[0m\x1b[0m",
    );
    visualAssertEquals(
      crayon.rgb(249, 249, 249)("test"),
      "\x1b[38;5;231mtest\x1b[0m\x1b[0m",
    );

    crayon.colorSupport.trueColor = true;
  });

  await t.step("rgb -> 4bit", () => {
    crayon.colorSupport.trueColor = false;
    crayon.colorSupport.highColor = false;

    visualAssertEquals(
      crayon.rgb(255, 0, 255)("test"),
      "\x1b[95mtest\x1b[0m\x1b[0m",
    );
    visualAssertEquals(
      crayon.rgb(128, 0, 0)("test"),
      "\x1b[31mtest\x1b[0m\x1b[0m",
    );

    crayon.colorSupport.highColor = true;
    crayon.colorSupport.trueColor = true;
  });

  await t.step("8bit -> 4bit", () => {
    crayon.colorSupport.highColor = false;

    visualAssertEquals(
      crayon.ansi8(123)("test"),
      "\x1b[96mtest\x1b[0m\x1b[0m",
    );

    crayon.colorSupport.highColor = true;
  });

  await t.step("8bit -> 3bit", () => {
    crayon.colorSupport.highColor = false;
    crayon.colorSupport.fourBitColor = false;

    visualAssertEquals(
      crayon.ansi8(232)("test"),
      "\x1b[30mtest\x1b[0m\x1b[0m",
    );
    visualAssertEquals(
      crayon.ansi8(123)("test"),
      "\x1b[36mtest\x1b[0m\x1b[0m",
    );

    crayon.colorSupport.fourBitColor = true;
    crayon.colorSupport.highColor = true;
  });

  await t.step("4bit -> 3bit", () => {
    crayon.colorSupport.fourBitColor = false;

    visualAssertEquals(crayon.ansi4(6)("test"), "\x1b[36mtest\x1b[0m\x1b[0m");
    visualAssertEquals(
      crayon.ansi4(13)("test"),
      "\x1b[35mtest\x1b[0m\x1b[0m",
    );

    crayon.colorSupport.fourBitColor = true;
  });
});

Deno.test("Utility functions", async (t) => {
  await t.step("Strip", () => {
    visualAssertEquals(
      crayon.strip(
        crayon.rgb(123, 253, 123).bgHex(0xff12dd).bold.underline.italic(
          "Bueno",
        ),
      ),
      "Bueno",
    );
  });

  await t.step("Optimize", () => {
    const styledText = crayon.rgb(123, 253, 123).hex(0x33ff80).bgRgb(
      12,
      33,
      65,
    )
      .bgHex(
        0xff12dd,
      ).red.bgBlue.bold.underline.italic(
        "Bueno",
      );

    assert(
      crayon.optimize(styledText).length < styledText.length,
    );

    visualAssertEquals(
      crayon.optimize(styledText),
      "\x1b[31m\x1b[44m\x1b[1m\x1b[4m\x1b[3mBueno\x1b[0m",
    );
  });

  await t.step("Replace", () => {
    assertEquals(
      replace("this is example test", "example", "working"),
      "this is working test",
    );

    assertEquals(
      replace("a b c", " ", ""),
      "ab c",
    );
  });

  await t.step("Get NoColor", () => {
    if (isDeno()) {
      assertEquals(getNoColor(), Deno.noColor);
    } else if (isNode()) {
      // @ts-ignore Node compatibility
      globalThis.process.env.NO_COLOR = 1;
      assertEquals(getNoColor(), true);
      // @ts-ignore Node compatibility
      globalThis.process.env = {};
      assertEquals(getNoColor(), false);
    }
  });
});

Deno.test("Extending", () => {
  mapPrototypeStyles(
    new Map([
      ["test", "\x1b[97m"],
      ["test2", "\x1b[98m"],
    ]),
    new Map([
      ["test3", "\x1b[99m"],
    ]),
  );

  function testFunc(bg: boolean): StyleCode {
    return `\x1b[${90 + +bg}m`;
  }

  function testFunc2(welcoming: "hello" | "hi", bg: boolean): string {
    return `\x1b[${92 + +bg}m` + welcoming;
  }

  mapPrototypeFuncs(testFunc, testFunc2);

  type ExtendedCrayon = Crayon<"test" | "test2" | "test3", {
    testFunc(): ExtendedCrayon;
    bgTestFunc(): ExtendedCrayon;
    testFunc2(welcoming: "hi" | "hello"): ExtendedCrayon;
    bgTestFunc2(welcoming: "hi" | "hello"): ExtendedCrayon;
  }>;

  const extendedCrayon = buildCrayon<ExtendedCrayon>();

  // If typing would break this type should throw an error while type checking
  type TypeTest = [
    ExtendedCrayon["red"]["bgBlue"],
    ExtendedCrayon["test"]["red"],
    ExtendedCrayon["test2"]["blue"],
    ExtendedCrayon["test3"]["bgYellow"],
    ExtendedCrayon["testFunc"]["apply"],
    ExtendedCrayon["testFunc2"]["apply"],
    ReturnType<ExtendedCrayon["testFunc"]>["red"],
    ReturnType<ExtendedCrayon["bgTestFunc"]>["red"],
    ReturnType<ExtendedCrayon["testFunc2"]>["red"],
    ReturnType<ExtendedCrayon["bgTestFunc2"]>["red"],
  ];

  visualAssertEquals(
    extendedCrayon.red.bgBlue("Hello"),
    "\x1b[31m\x1b[44mHello\x1b[0m\x1b[0m",
  );

  visualAssertEquals(
    extendedCrayon.test("Hello"),
    "\x1b[97mHello\x1b[0m\x1b[0m",
  );

  visualAssertEquals(
    extendedCrayon.test2("Hello"),
    "\x1b[98mHello\x1b[0m\x1b[0m",
  );

  visualAssertEquals(
    extendedCrayon.test3("Hello"),
    "\x1b[99mHello\x1b[0m\x1b[0m",
  );

  visualAssertEquals(
    extendedCrayon.testFunc()("Hello"),
    "\x1b[90mHello\x1b[0m\x1b[0m",
  );

  visualAssertEquals(
    extendedCrayon.bgTestFunc()("Hello"),
    "\x1b[91mHello\x1b[0m\x1b[0m",
  );

  visualAssertEquals(
    extendedCrayon.testFunc2("hello")("Hi"),
    "\x1b[92mhelloHi\x1b[0m\x1b[0m",
  );

  visualAssertEquals(
    extendedCrayon.bgTestFunc2("hi")("Hello"),
    "\x1b[93mhiHello\x1b[0m\x1b[0m",
  );

  visualAssertEquals(
    extendedCrayon.test.test2.test3.testFunc().bgTestFunc().testFunc2("hello")
      .bgTestFunc2("hi")("Hello"),
    "\x1b[97m\x1b[98m\x1b[99m\x1b[90m\x1b[91m\x1b[92mhello\x1b[93mhiHello\x1b[0m\x1b[0m",
  );
});
