<!-- TODO: Add coverage badge -->

[![deno github workflow](https://github.com/crayon-js/crayon/actions/workflows/deno.yml/badge.svg)](https://github.com/crayon-js/crayon/actions/workflows/deno.yml)

<img align="center" src="https://github.com/crayon-js/crayon/raw/main/docs/logo.svg" alt="Crayon logo: Totally not creppy humanized crayon staring and waving hand at you" height="256px" width="100%">

<h1 align="center">🖍️ Crayon</h1>

## 📚 About

Crayon is a terminal styling module written in TypeScript.\
From the ground up its goals are to be fast, relatively lightweight and modular.

#### 🖍️ Crayon.js offers:

- ⚡ **Great performance**
- 📦 No dependencies
- 🗑️ Modularity (use what you need)
- 🧐 Familiar API (chalk-like)
- 🦄 Built-in color fallbacking
  - 🎨 Automatic color detection via `@crayon/color-support` extension package
- 🔗 Support for nesting & chaining styles
- 🪢 Not extending `String.prototype`
- 🌈 24bit (16.7mln - truecolor) and 8bit (256 - highcolor) color support

## ⚙️ Usage

```ts
import crayon from "@crayon/crayon";

console.log(crayon.red("its red!"));
```

<!-- TODO: Change this after restructuring repos
## 🧩 Extensions

To add new functionality to Crayon you can use ready or create your own extensions.\
Crayon's extensions are stored in [src/extensions](./src/extensions/)
-->

## 🤝 Contributing

**Crayon** is open for any contributions. <br /> If you feel like you can enhance this project -
please open an issue and/or pull request. <br /> Code should be well document and easy to follow
what's going on.

Since the start of development on **Crayon 4.0** this project follows
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.
<br /> If your pull request's code could introduce understandability trouble, please add comments to
it.

## 📝 Licensing

This project is available under **MIT** License conditions.
