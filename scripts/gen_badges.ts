// Copyright 2022 Im-Beast. All rights reserved. MIT license.
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

  const textSdout = await textDecoder.decode(await coverage.stdout);
  let coveredLines = 0;
  let allLines = 0;

  for (
    const [output] of textSdout.matchAll(/\d+\/\d+/g)
  ) {
    const split = output.split("/").map(Number);
    coveredLines += split[0];
    allLines += split[1];
  }

  const coveragePercent = (coveredLines / allLines) * 100;

  return generateBadge(
    "coverage",
    `${coveragePercent.toFixed(2)}%`,
    hslToRgb(
      coveragePercent * 1.2,
      50,
      50,
    ).map((x) => x.toString(16)).join(""),
  );
}

async function sizeBadge(filePath: string) {
  const info = await Deno.spawn(Deno.execPath(), {
    args: [
      "info",
      filePath,
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

  return generateBadge("raw size", `${(size / 1024).toFixed(2)}KB`, "4c76ae");
}

await emptyDir("docs/badges");
Deno.writeTextFile("docs/badges/coverage.svg", await coverageBadge());

await emptyDir("docs/badges/size");
Deno.writeTextFile("docs/badges/size/mod.svg", await sizeBadge("mod.ts"));

for await (const file of Deno.readDir("src/extensions")) {
  if (!file.name.endsWith(".ts")) continue;

  Deno.writeTextFile(
    `docs/badges/size/${file.name.replace(".ts", "")}.svg`,
    await sizeBadge(`src/extensions/${file.name}`),
  );
}
