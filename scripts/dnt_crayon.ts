// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { build, emptyDir } from "https://deno.land/x/dnt@0.23.0/mod.ts";

await emptyDir("./node");

await build({
  scriptModule: false,
  entryPoints: ["./mod.ts"],
  outDir: "./node",
  shims: {
    deno: "dev",
  },
  package: {
    name: "crayon.js",
    version: Deno.args[0],
    description: "Terminal styling done light and fast.",
    license: "MIT",
    private: false,
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

Deno.copyFileSync("LICENSE.md", "node/LICENSE.md");
Deno.copyFileSync("README.md", "node/README.md");
