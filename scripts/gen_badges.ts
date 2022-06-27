import { hslToRgb } from "../src/conversions.ts";
import { emptyDir } from "./deps.ts";

const textDecoder = new TextDecoder();

async function generateBadge(
  label: string,
  message: string,
  color: string,
) {
  return await (await fetch(
    `https://img.shields.io/static/v1?label=${label}&message=${message}&color=${color}`,
  )).text();
}

async function coverageBadge() {
  const taskTest = await Deno.spawn(Deno.execPath(), {
    args: [
      "task",
      "test",
      "--coverage=coverage",
    ],
    stdin: "null",
    stdout: "piped",
    stderr: "piped",
  });

  if (!taskTest.status.success) {
    return generateBadge(
      "coverage",
      "unknown",
      "red",
    );
  }

  const coverage = await Deno.spawn(Deno.execPath(), {
    args: [
      "coverage",
      "coverage/",
    ],
    stdin: "null",
    stdout: "piped",
    stderr: "piped",
  });

  if (!taskTest.status.success) {
    return generateBadge(
      "coverage",
      "unknown",
      "red",
    );
  }

  const coveragePercentages = [
    ...await textDecoder.decode(
      await coverage.stdout,
    ).matchAll(/(\d|\.)+%/g),
  ].flat().filter((_, i) => i % 2 === 0);

  // @ts-expect-error typescript having it's not-very-well typed built-ins
  const averagePercent = coveragePercentages.reduce((p, n, i) => {
    if (i === 1) return p.replace("%", "");
    return +p + +n.replace("%", "");
  }) / coveragePercentages.length;

  return generateBadge(
    "coverage",
    `${averagePercent.toFixed(2)}%`,
    hslToRgb(
      averagePercent * 1.2,
      50,
      50,
    ).map((x) => x.toString(16)).join(""),
  );
}

async function sizeBadge() {
  const info = await Deno.spawn(Deno.execPath(), {
    args: [
      "info",
      "mod.ts",
      "--json",
    ],
    stdin: "null",
    stdout: "piped",
    stderr: "piped",
  });

  if (!info.status) {
    return generateBadge(
      "raw size",
      "unknown",
      "red",
    );
  }

  let json: { modules: { size: number }[] };
  try {
    json = JSON.parse(await textDecoder.decode(info.stdout));
  } catch {
    return generateBadge(
      "raw size",
      "unknown",
      "red",
    );
  }

  const size = json.modules.reduce((p, n) => ({
    size: p.size + n.size,
  })).size;

  return generateBadge("raw size", `${(size / 1024).toFixed(2)}KB`, "567bad");
}

await emptyDir("badges");
Deno.writeTextFile("badges/coverage.svg", await coverageBadge());
Deno.writeTextFile("badges/size.svg", await sizeBadge());
