// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { hslToRgb } from "../src/conversions.ts";
import { emptyDir } from "./deps.ts";

const textDecoder = new TextDecoder();
const denoExec = Deno.execPath();

interface Badge {
  label: string;
  message: string;
  color: string;
}

async function generateBadge(
  path: string | URL,
  { label, message, color }: Badge,
): Promise<void> {
  const badge = await (await fetch(
    `https://img.shields.io/static/v1?label=${label}&message=${message}&color=${color}`,
  )).text();

  await Deno.writeTextFile(path, badge);
}

async function getTestCoverage(
  testArgs: string[] = [],
  coverageArgs: string[] = [],
): Promise<number> {
  await emptyDir("./coverage");

  const testChild = Deno.spawnChild(denoExec, {
    args: [
      "task",
      "test",
      "--coverage=./coverage",
      ...testArgs,
    ],
  });

  await testChild.output();

  const coverageChild = Deno.spawnChild(denoExec, {
    args: [
      "coverage",
      "./coverage",
      ...coverageArgs,
    ],
  });

  const stdout = textDecoder.decode((await coverageChild.output()).stdout);

  let coveredLines = 0;
  let allLines = 0;
  for (const match of stdout.matchAll(/\((?<covered>\d+)\/(?<all>\d+)\)/g)) {
    const { covered, all } = match.groups!;
    coveredLines += +covered;
    allLines += +all;
  }

  return (coveredLines / allLines) * 100;
}

/** Returns size in kibibytes and whether it has crayon in dependency */
async function getInfoSize(filePath: string): Promise<[number, boolean]> {
  const child = Deno.spawnChild(denoExec, {
    args: [
      "info",
      filePath,
      "--json",
    ],
  });

  const stdout = textDecoder.decode((await child.output()).stdout);

  interface Module {
    size: number;
    local: string;
  }

  const modules = JSON.parse(stdout).modules as Module[];
  let combinedSize = 0;
  let hasCrayonAsDependency = false;
  for (const { size, local } of modules) {
    combinedSize += size;
    hasCrayonAsDependency ||= local.includes("mod.ts");
  }

  return [combinedSize / 1024, hasCrayonAsDependency];
}

const coverage = await getTestCoverage();
generateBadge("./docs/badges/coverage.svg", {
  label: "coverage",
  message: coverage.toFixed(2),
  color: hslToRgb(coverage * 1.2, 50, 50)
    .map((value) => value.toString(16))
    .join(""),
});

const [crayonSize] = await getInfoSize("mod.ts");
await emptyDir("./docs/badges/size");
generateBadge("./docs/badges/size/mod.svg", {
  label: "raw size",
  message: crayonSize.toFixed(2) + "KiB",
  color: "4c76ae",
});

for await (const { name } of Deno.readDir("./src/extensions")) {
  if (!name.endsWith(".ts")) continue;

  let [size, depends] = await getInfoSize(`./src/extensions/${name}`);
  if (depends) size -= crayonSize;

  generateBadge(`./docs/badges/size/${name.replace(".ts", ".svg")}`, {
    label: "raw size",
    message: size.toFixed(2) + "KiB",
    color: "4c76ae",
  });
}
