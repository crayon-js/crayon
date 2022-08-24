<h1 align="center">🖍️ Crayon Literal Templates 📄</h1>

![size of literal.ts](https://github.com/crayon-js/crayon/raw/main/docs/badges/size/literal.svg)

## 📚 About

Literal templates is an extension for Crayon that adds support for styling using
ES6 Literal Templates.

## ⚙️ Usage

- On deno:

```ts
// Remember to replace "version" with semver version
import { crayon } from "https://deno.land/x/crayon@version/mod.ts";
import "https://deno.land/x/crayon@version/src/extensions/literal.ts";

console.log(
  crayon`{red I'm red! {blue I'm blue!} {bgBlue.bold I'm kind of both! But also bold!}}`,
);
```

- On node:

```ts
import { crayon, prototype } from "crayon.js";
import { compileLiteral } from "@crayon.js/literal";
prototype.literal = compileLiteral;

console.log(
  crayon`{red I'm red! {blue I'm blue!} {bgBlue.bold I'm kind of both! But also bold!}}`,
);
```

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
