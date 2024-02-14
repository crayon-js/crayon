import { buildCrayon, ColorSupport, crayon, prototype } from "./crayon.ts";

export function extendStyle(name: string, code: string) {
  const attributes: PropertyDescriptor = {
    configurable: true,
  };

  if (prototype.$colorSupport === ColorSupport.NoColor) {
    attributes.value = crayon;
  } else {
    attributes.get = function (this: Crayon) {
      const prepareCrayon = () => {
        const builtCrayon = buildCrayon(
          this.styleBuffer + code,
          this.usesFunc,
        );

        // Instead of building crayon every time property gets accessed
        // simply replace getter with built crayon instance
        Object.defineProperty(this, name, {
          configurable: true,
          value: builtCrayon,
        });
        return builtCrayon;
      };

      const preparedCrayon = prepareCrayon();

      // Don't cache crayon when it uses function:
      // This is done to prevent memory leaks or cpu overhead
      // caused when function has many different output possibilities
      if (!preparedCrayon.usesFunc) {
        preparedCrayon.reprepareCache = prepareCrayon;
        prototype.$cachedCrayons.push(preparedCrayon);
      }

      return preparedCrayon;
    };
  }

  Object.defineProperty(prototype, name, attributes);
}

interface CrayonStyleMethod {
  // deno-lint-ignore no-explicit-any
  (...args: any[]): unknown;
}

function NO_STYLE_CRAYON() {
  return crayon;
}

export function extendMethod(
  name: string,
  func: CrayonStyleMethod,
  noBgVariant = false,
) {
  if (noBgVariant) {
    Object.defineProperty(prototype, name, {
      value: prototype.$colorSupport === ColorSupport.NoColor
        ? NO_STYLE_CRAYON
        : function (this: Crayon, ...args: unknown[]) {
          return buildCrayon(
            this.styleBuffer + func(...args),
            true,
          );
        },
    });
    return;
  }

  Object.defineProperty(prototype, name, {
    value: prototype.$colorSupport === ColorSupport.NoColor
      ? NO_STYLE_CRAYON
      : function (this: Crayon, ...args: unknown[]) {
        return buildCrayon(
          this.styleBuffer + func(false, ...args),
          true,
        );
      },
  });

  const bgName = `bg$${name[0].toUpperCase()}${name.slice(1)}`;
  Object.defineProperty(prototype, bgName, {
    value: prototype.$colorSupport === ColorSupport.NoColor
      ? NO_STYLE_CRAYON
      : function (this: Crayon, ...args: unknown[]) {
        return buildCrayon(
          this.styleBuffer + func(true, ...args),
          true,
        );
      },
  });
}

export function extendObject(
  styles: Record<
    string,
    | string
    | CrayonStyleMethod
    | [CrayonStyleMethod, hasBgVariant: boolean]
  >,
) {
  for (const [name, code] of Object.entries(styles)) {
    if (typeof code === "string") {
      extendStyle(name, code);
    } else if (typeof code === "function") {
      extendMethod(name, code);
    } else {
      extendMethod(name, code[0], code[1]);
    }
  }
}
