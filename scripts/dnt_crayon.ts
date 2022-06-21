// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { build, emptyDir } from "https://deno.land/x/dnt@0.23.0/mod.ts";

const entryPoint = "./mod.ts";
const outDir = "./node_crayon";

await emptyDir(outDir);

const version = Deno.args[0];

await build({
  scriptModule: false,
  entryPoints: [entryPoint],
  outDir,
  test: true,
  testPattern: "tests/crayon.test.ts",
  shims: {
    deno: "dev",
  },
  package: {
    name: "crayon.js",
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
});

Deno.copyFileSync("LICENSE.md", `${outDir}/LICENSE.md`);
Deno.copyFileSync("README.md", `${outDir}/README.md`);
