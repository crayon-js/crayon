[![deno github workflow](https://github.com/crayon-js/crayon/actions/workflows/deno.yml/badge.svg)](https://github.com/crayon-js/crayon/actions/workflows/deno.yml)
[![npm package publishing workflow](https://github.com/crayon-js/crayon/actions/workflows/node_publish.yml/badge.svg)](https://github.com/crayon-js/crayon/actions/workflows/node_publish.yml)
![coverage percentage of crayon](https://github.com/crayon-js/crayon/raw/main/docs/badges/coverage.svg)
[![doc.deno.land badge for crayon](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://deno.land/x/crayon)
![size of mod.ts](https://github.com/crayon-js/crayon/raw/main/docs/badges/size/mod.svg)

<img align="center" src="https://github.com/crayon-js/crayon/raw/main/docs/logo.svg" alt="Crayon logo: Totally not creppy humanized crayon staring and waving hand at you" height="256px" width="100%">

<h1 align="center">🖍️ Crayon</h1>

## 📚 About

Crayon is terminal styling module written in Typescript.

From the ground up its goals is to be fast, relatively lightweight and modular.

#### 🖍️ Crayon.js offers:

- ⚡ **High performance**
- 📦 No dependencies
- 🧑‍💻 Good code quality
- 🗑️ Modularity (no unnecessary code)
- 🧐 Familiar API (chalk-like)
- 🦄 Automatic color fallbacking
  - 🎨 Automatic color detection via `color_support` extension
- 🔗 Supported nesting & chaining
- 🪢 Not extending `String.prototype`
- 🌈 24bit (16.7m - truecolor) and 8bit (256 - highcolor) color support

## ⚙️ Usage

- On deno:

```ts
// Remember to replace "version" with semver version
import { crayon } from "https://deno.land/x/crayon@version/mod.ts";

console.log(crayon.red("its red!"));
```

- On node:

```ts
import { crayon } from "crayon.js";

console.log(crayon.red("its red!"));
```

## 🧩 Extensions

To add new functionality to Crayon you can use ready or create your own
extensions.

Crayon's extensions are stored in [src/extensions](./src/extensions/)

## 🤝 Contributing

**Crayon** is open for any contributions. <br /> If you feel like you can
enhance this project - please open an issue and/or pull request. <br /> Code
should be well document and easy to follow what's going on.

Since the start of development on **Crayon 3.0** this project follows
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.
<br /> If your pull request's code could introduce understandability trouble,
please add comments to it.

## 📝 Licensing

This project is available under **MIT** License conditions.
