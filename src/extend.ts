import { buildCrayon, ColorSupport, crayon, prototype } from "./crayon.ts";

type DynamicStyleCode = () => string;

function prepareCrayon(crayon: Crayon, code: string) {
  return buildCrayon(
    crayon.styleBuffer + code,
    crayon.usesFunc,
  );
}

export function extendStyle(
  name: string,
  code: string | DynamicStyleCode,
): void {
  const attributes: PropertyDescriptor = {
    configurable: true,
  };

  if (prototype.$colorSupport === ColorSupport.NoColor) {
    attributes.value = crayon;
  } else if (typeof code === "string") {
    attributes.get = function (this: Crayon) {
      const prepared = prepareCrayon(this, code);

      // Don't cache crayon when it uses function:
      // This is done to prevent memory leaks or cpu overhead
      // caused when function has many different output possibilities
      if (prepared.usesFunc) {
        return prepared;
      }

      // Instead of building crayon every time property gets accessed
      // simply replace getter with built crayon instance
      Object.defineProperty(this, name, {
        configurable: true,
        value: prepared,
      });

      // We don't need to handle recaching with static style codes
      // since it can't change over time
      return prepared;
    };
  } else {
    attributes.get = function (this: Crayon) {
      const prepared = prepareCrayon(this, code());

      if (prepared.usesFunc) {
        return prepared;
      }

      Object.defineProperty(this, name, {
        configurable: true,
        value: prepared,
      });

      prepared.recache = code;
      prototype.$cachedCrayons.push(prepared);

      return prepared;
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
): void {
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

  const bgName = `bg${name[0].toUpperCase()}${name.slice(1)}`;
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

export function extendMethods(
  methods: Record<
    string,
    CrayonStyleMethod | [CrayonStyleMethod, noBgVariant: true]
  >,
): void {
  for (const [name, method] of Object.entries(methods)) {
    if (typeof method === "function") {
      extendMethod(name, method);
    } else {
      extendMethod(name, method[0], method[1]);
    }
  }
}

export function extendStyles(
  styles: Record<string, string | DynamicStyleCode>,
): void {
  for (const [name, style] of Object.entries(styles)) {
    extendStyle(name, style);
  }
}
