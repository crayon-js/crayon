// Copyright 2022 Im-Beast. All rights reserved. MIT license.

import { build, emptyDir } from "./deps.ts";

const entryPoint = "./src/extensions/css_keywords.ts";
const outDir = "./node_css_keywords";

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
Deno.copyFileSync(entryPoint.replace(".ts", ".md"), `${outDir}/README.md`);
