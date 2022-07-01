import { crayon, prototype } from "../mod.ts";
import { getColorSupport } from "../src/extensions/color_support.ts";
import { assertEquals } from "./deps.ts";

function resetEnv(key: string, value: string): void {
  if (typeof value !== "string") {
    Deno.env.delete(key);
    return;
  }
  Deno.env.set(key, value);
}

Deno.test("Extension: Color support", async (t) => {
  await t.step("Crayon behaviour", () => {
    assertEquals(crayon.ansi3(5)("Hi"), "\x1b[35mHi\x1b[0m\x1b[0m");

    prototype.colorSupport = {
      trueColor: false,
      highColor: false,
      fourBitColor: false,
      threeBitColor: false,
    };

    assertEquals(crayon.ansi3(5)("Hi"), "Hi");

    prototype.colorSupport = {
      trueColor: true,
      highColor: true,
      fourBitColor: true,
      threeBitColor: true,
    };

    assertEquals(crayon.ansi3(5)("Hi"), "\x1b[35mHi\x1b[0m\x1b[0m");
  });

  await t.step("COLOTERM", async () => {
    const colorTerm = Deno.env.get("COLORTERM")!;
    Deno.env.set("COLORTERM", "truecolor");

    assertEquals(await getColorSupport({ forcePermissions: true }), {
      trueColor: true,
      highColor: true,
      fourBitColor: true,
      threeBitColor: true,
    });

    Deno.env.set("COLORTERM", "");
    assertEquals(await getColorSupport({ forcePermissions: true }), {
      trueColor: false,
      highColor: false,
      fourBitColor: true,
      threeBitColor: true,
    });

    resetEnv("COLORTERM", colorTerm);
  });

  await t.step("NO_COLOR", async () => {
    const colorTerm = Deno.env.get("COLORTERM")!;

    Deno.env.set("COLORTERM", "truecolor");
    Object.defineProperty(globalThis.Deno, "noColor", { value: true });

    assertEquals(await getColorSupport({ forcePermissions: true }), {
      trueColor: false,
      highColor: false,
      fourBitColor: false,
      threeBitColor: false,
    });

    resetEnv("COLORTERM", colorTerm);
    Object.defineProperty(globalThis.Deno, "noColor", { value: false });
  });

  await t.step("TERM", async () => {
    const term = Deno.env.get("TERM")!;
    Deno.env.set("TERM", "xterm-256");

    const colorTerm = Deno.env.get("COLORTERM")!;
    Deno.env.delete("COLORTERM");

    assertEquals(await getColorSupport({ forcePermissions: true }), {
      trueColor: false,
      highColor: true,
      fourBitColor: true,
      threeBitColor: true,
    });

    resetEnv("TERM", term);
    resetEnv("COLORTERM", colorTerm);
  });

  await t.step("CI", async () => {
    const ci = Deno.env.get("CI")!;
    Deno.env.set("CI", "");

    const term = Deno.env.get("TERM")!;
    Deno.env.delete("TERM");

    const colorTerm = Deno.env.get("COLORTERM")!;
    Deno.env.delete("COLORTERM");

    for (
      const ciEnv of [
        "TRAVIS",
        "CIRCLECI",
        "GITHUB_ACTIONS",
        "GITLAB_CI",
        "BUILDKITE",
        "DRONE",
        "APPVEYOR",
      ]
    ) {
      Deno.env.set(ciEnv, "");

      assertEquals(await getColorSupport({ forcePermissions: true }), {
        trueColor: false,
        highColor: false,
        fourBitColor: true,
        threeBitColor: true,
      });

      Deno.env.delete(ciEnv);
    }

    resetEnv("CI", ci);
    resetEnv("TERM", term);
    resetEnv("COLORTERM", colorTerm);
  });

  await t.step("Windows 10+/14931+", async () => {
    const ci = Deno.env.get("CI")!;
    Deno.env.delete("CI");

    const term = Deno.env.get("TERM")!;
    Deno.env.delete("TERM");

    const colorTerm = Deno.env.get("COLORTERM")!;
    Deno.env.delete("COLORTERM");

    const { build } = Deno;
    Object.defineProperty(globalThis.Deno, "build", {
      value: {
        os: "windows",
      },
    });

    const { osRelease } = globalThis.Deno;
    Object.defineProperty(globalThis.Deno, "osRelease", {
      value() {
        return "10.14931";
      },
    });

    assertEquals(await getColorSupport({ forcePermissions: true }), {
      trueColor: true,
      highColor: true,
      fourBitColor: true,
      threeBitColor: true,
    });

    Object.defineProperty(globalThis.Deno, "build", {
      value: build,
    });

    Object.defineProperty(globalThis.Deno, "osRelease", {
      value: osRelease,
    });

    resetEnv("CI", ci);
    resetEnv("TERM", term);
    resetEnv("COLORTERM", colorTerm);
  });
});
