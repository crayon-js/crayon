import { hslToRgb } from "../src/conversions.ts";
import { generateBadge } from "./gen_badge.ts";
import { prototype } from "../src/crayon.ts";

const textDecoder = new TextDecoder();

async function getTestCoverage(): Promise<number> {
  const testChild = new Deno.Command(Deno.execPath(), {
    args: [
      "task",
      "test",
    ],
  });

  await testChild.output();

  const coverageChild = new Deno.Command(Deno.execPath(), {
    args: [
      "coverage",
      "./coverage",
    ],
  });

  const stdout = textDecoder.decode((await coverageChild.output()).stdout);

  // ...
  // ---------------------------------
  // All files   |     83.2 |   90.5 |
  // ---------------------------------

  const lines = stdout.split("\n");
  const summary = lines.at(-3);
  if (!summary) {
    throw new Error("No coverage summary found");
  }

  const summaryColumns = summary.split("|");
  const linePercentage = summaryColumns.at(2)?.trim();
  if (!linePercentage) {
    throw new Error("No line percentage column found");
  }

  return Number(prototype.strip(linePercentage));
}

if (import.meta.main) {
  const coverage = await getTestCoverage();
  generateBadge("./docs/badges/coverage.svg", {
    label: "coverage",
    message: coverage.toFixed(2) + "%",
    color: hslToRgb(coverage * 1.2, 50, 50)
      .map((value) => value.toString(16))
      .join(""),
  });
}
