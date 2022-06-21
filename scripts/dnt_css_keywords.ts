// Copyright 2022 Im-Beast. All rights reserved. MIT license.

// FIXME: error: Uncaught (in promise) "Error stripping prefix of /home/mateusz/Documents/Projects/crayon/src/extensions/css_keywords.ts with base /home/mateusz/Documents/Projects/crayon/tests

import { build, emptyDir } from "https://deno.land/x/dnt@0.23.0/mod.ts";

const entryPoint = "./src/extensions/css_keywords.ts";
const outDir = "./node_css_keywords";

const local = await Deno.readTextFile(entryPoint);
const remote = await (await fetch(
  `https://deno.land/x/crayon/${entryPoint}`,
)).text();

if (local === remote) Deno.exit(0);

await emptyDir(outDir);

const version = Deno.args[0];

await build({
  scriptModule: false,
  entryPoints: [entryPoint],
  outDir,
  test: true,
  testPattern: "tests/css_keywords.test.ts",
  shims: {
    deno: "dev",
  },
  package: {
    name: "@crayon.js/keywords",
    version,
    description: "Terminal styling done light and fast.",
    license: "MIT",
    private: false,
    author: {
      "name": "Im-Beast",
      "url": "https://im-beast.github.io",
    },
    repository: {
      type: "git",
      url: "https://github.com/crayon-js/crayon.git",
    },
    bugs: {
      url: "https://github.com/crayon-js/crayon/issues",
    },
    keywords: [
      "css",
      "keywords",
      "typescript",
      "ts",
      "color",
      "colour",
      "styling",
      "formatting",
      "style",
      "ansi",
      "rgb",
      "256",
      "hsl",
      "terminal",
      "console",
      "cli",
      "cmd",
      "tty",
      "text",
      "log",
    ],
  },
  mappings: {
    "./mod.ts": {
      name: "crayon.js",
      version: `^${version}`,
    },
  },
});

Deno.copyFileSync("LICENSE.md", `${outDir}/LICENSE.md`);
Deno.copyFileSync("README.md", `${outDir}/README.md`);
