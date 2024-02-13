// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { createGraph } from "https://deno.land/x/deno_graph@0.65.3/mod.ts";
import { generateBadge } from "./gen_badge.ts";

// Returns size in kibibytes and whether it has crayon in dependency
async function getInfoSize(filePath: string): Promise<[number, boolean]> {
  const graph = await createGraph(import.meta.resolve("../" + filePath));

  const modules = graph.modules;
  let combinedSize = 0;
  let hasCrayonAsDependency = false;
  for (const { specifier, size } of modules) {
    // [Local doesn't work via deno_graph module](https://github.com/denoland/deno_graph/issues/17)
    const local = specifier.replace(import.meta.resolve("../"), "");
    combinedSize += size ?? 0;
    hasCrayonAsDependency ||= local!.includes("mod.ts");
  }

  return [combinedSize / 1024, hasCrayonAsDependency];
}

if (import.meta.main) {
  const [crayonSize] = await getInfoSize("mod.ts");
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
}
