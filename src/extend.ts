// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import crayon, { buildCrayon, ColorSupport, type Crayon, prototype } from "./crayon.ts";
import { capitalize } from "./utils/capitalize.ts";

function prepareCrayon(crayon: Crayon, code: string) {
  return buildCrayon(crayon.styleBuffer + code, crayon.hasMethods);
}

export enum CrayonStyleMethodType {
  Static,
  /** Method, where first attribute determines whether it will return background (true) or foreground (false) style. */
  Variant,
}

export type CrayonStyleMethod<
  A extends unknown[] = unknown[],
  O extends boolean = false,
  Type extends CrayonStyleMethodType = CrayonStyleMethodType,
> = O extends false ? (...args: A) => string
  : { fn(...args: A): string; type: Type };

type DynamicStyleCode = () => string;
export type CrayonStyleCode =
  /**
   * Method, which returns a style ANSI code.
   * The reason for it being a method is that it can change depending on the terminal support
   */
  | DynamicStyleCode
  | string;

export type CrayonStyle =
  | CrayonStyleCode
  // deno-lint-ignore no-explicit-any
  | CrayonStyleMethod<any, any>;

function NO_STYLE_CRAYON() {
  return crayon;
}

function createCrayonMethod<P extends unknown[], A extends unknown[]>(
  { fn }: CrayonStyleMethod<[...P, ...A], true>,
  ...prependArgs: P
) {
  return prototype.$colorSupport === ColorSupport.NoColor
    ? NO_STYLE_CRAYON
    : function (this: Crayon, ...args: A) {
      return buildCrayon(this.styleBuffer + fn(...prependArgs, ...args), true);
    };
}

function extendMethod<T extends unknown[]>(
  name: string,
  method: CrayonStyleMethod<T, true, CrayonStyleMethodType>,
): void {
  switch (method.type) {
    case CrayonStyleMethodType.Static:
      Object.defineProperty(prototype, name, { value: createCrayonMethod(method) });
      break;
    case CrayonStyleMethodType.Variant: {
      Object.defineProperties(prototype, {
        [name]: { value: createCrayonMethod(method, false) },
        [`bg${capitalize(name)}`]: {
          value: createCrayonMethod(method, true),
        },
      });
      break;
    }
  }
}

function extendStyle(name: string, style: CrayonStyleCode): void {
  if (prototype.$colorSupport === ColorSupport.NoColor) {
    Object.defineProperty(prototype, name, { value: crayon });
  } else if (typeof style === "string") {
    Object.defineProperty(prototype, name, {
      get(this: Crayon) {
        const prepared = prepareCrayon(this, style);

        // Don't cache crayon when it uses function.
        // This is done to prevent memory leaks or cpu overhead
        // caused when function has many different output possibilities.
        if (prepared.hasMethods) {
          return prepared;
        }

        // Instead of building crayon every time property gets accessed
        // simply replace getter with built crayon instance.
        Object.defineProperty(this, name, {
          configurable: true,
          value: prepared,
        });

        // We don't need to handle recaching with static style codes
        // since it can't change over time.
        return prepared;
      },
    });
  } else {
    Object.defineProperty(prototype, name, {
      get(this: Crayon) {
        const prepared = prepareCrayon(this, style());

        if (prepared.hasMethods) {
          return prepared;
        }

        Object.defineProperty(this, name, {
          configurable: true,
          value: prepared,
        });

        // When we deal with dynamic styles we need to cache them.
        // Because they can change over time, we need to keep track of
        // what needs to be re-run when color support changes.
        prototype.$recache.push([this, name, style]);

        return prepared;
      },
    });
  }
}

export type CrayonExtension<K extends string = string, V extends CrayonStyle = CrayonStyle> =
  Record<K, V>;

type NormalizedExtensionValue<T> = T extends CrayonStyleCode ? string
  : T extends (...args: [infer _Bg, ...infer Args]) => string
    ? CrayonStyleMethod<Args, true, CrayonStyleMethodType.Variant>
  : T;

export type NormalizedCrayonExtension<T> = { [K in keyof T]: NormalizedExtensionValue<T[K]> };

export function extend<T extends CrayonExtension>(
  extension: T,
): Crayon<NormalizedCrayonExtension<T>> {
  for (const [name, style] of Object.entries(extension)) {
    switch (typeof style) {
      case "function":
        if (style.length === 0) {
          extendStyle(name, style());
        } else {
          extendMethod(name, { fn: style, type: CrayonStyleMethodType.Variant });
        }
        break;
      case "object":
        extendMethod(name, style);
        break;
      default:
        extendStyle(name, style);
        break;
    }
  }

  return crayon as Crayon<NormalizedCrayonExtension<T>>;
}
