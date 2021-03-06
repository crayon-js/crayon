[![deno github workflow](https://github.com/crayon-js/crayon/actions/workflows/deno.yml/badge.svg)](https://github.com/crayon-js/crayon/actions/workflows/deno.yml)
[![npm package publishing workflow](https://github.com/crayon-js/crayon/actions/workflows/node_publish.yml/badge.svg)](https://github.com/crayon-js/crayon/actions/workflows/node_publish.yml)
![coverage percentage of crayon](https://github.com/crayon-js/crayon/raw/main/docs/badges/coverage.svg)
[![doc.deno.land badge for crayon](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://deno.land/x/crayon)
![size of mod.ts](https://github.com/crayon-js/crayon/raw/main/docs/badges/size/mod.svg)

<img align="center" src="https://github.com/crayon-js/crayon/raw/main/docs/logo.svg" alt="Crayon logo: Totally not creppy humanized crayon staring and waving hand at you" height="256px" width="100%">

<h1 align="center">ποΈ Crayon</h1>

## π About

Crayon is terminal styling module written in Typescript.

From the ground up its goals is to be fast, relatively lightweight and modular.

#### ποΈ Crayon.js offers:

- β‘ **High performance**
- π¦ No dependencies
- π§βπ» Good code quality
- ποΈ Modularity (no unnecessary code)
- π§ Familiar API (chalk-like)
- π¦ Automatic color fallbacking
  - π¨ Automatic color detection via `color_support` extension
- π Supported nesting & chaining
- πͺ’ Not extending `String.prototype`
- π 24bit (16.7m -Β truecolor) and 8bit (256 - highcolor) color support

## βοΈ Usage

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

## π§© Extensions

To add new functionality to Crayon you can use ready or create your own
extensions.

Crayon's extensions are stored in [src/extensions](./src/extensions/)

## π€ Contributing

**Crayon** is open for any contributions. <br /> If you feel like you can
enhance this project - please open an issue and/or pull request. <br /> Code
should be well document and easy to follow what's going on.

Since the start of development on **Crayon 3.0** this project follows
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.
<br /> If your pull request's code could introduce understandability trouble,
please add comments to it.

## π Licensing

This project is available under **MIT** License conditions.
