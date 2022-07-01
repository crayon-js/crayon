<h1 align="center">🖍️ Crayon Color Support 🎨</h1>

> ⚠️ This module requires `--unstable` because it uses `Deno.osRelease()` and
> `Deno.spawnChild()`

## 📚 About

Color support is an extension for Crayon which allows you to detect color
support of users terminal, this allows Crayon to properly display colors even
for terminals that don't support all bells and whistles.

## ⚙️ Usage

- On deno:

```ts
// Remember to replace "version" with semver version
import { crayon, prototype } from "https://deno.land/x/crayon@version/mod.ts";
import { getColorSupport } from "https://deno.land/x/crayon@version/src/extensions/color_support.ts";

// By default all options are set to false, this means that if no explicit permissions (env, run) are set it'll return no terminal color support
prototype.colorSupport = getColorSupport({
  forcePermissions: false, // Whether to force-ask permissions, when user denies permission access error is thrown
  requestPermissions: false, // When needed, ask user for "env" and "run", when user denies permission access module continues working
  revokePermissions: false, // Whether to revoke "env" and/or "run" permissions after colorSupport gets returned
});

console.log(crayon.rgb(230, 135, 100)("Hi!"));
```

- On node:

```ts
import { crayon, prototype } from "crayon.js";
import { getColorSupport } from "@crayon.js/color-support";

// By default all options are set to false, this means that if no explicit permissions (env, run) are set it'll return no terminal color support
prototype.colorSupport = getColorSupport({
  forcePermissions: false, // Whether to force-ask permissions, when user denies permission access error is thrown
  requestPermissions: false, // When needed, ask user for "env" and "run", when user denies permission access module continues working
  revokePermissions: false, // Whether to revoke "env" and/or "run" permissions after colorSupport gets returned
});

console.log(crayon.rgb(230, 135, 100)("Hi!"));
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
