// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import {
  ansi3,
  ansi4,
  ansi8,
  attributes,
  colors,
  hex,
  hsl,
  keyword,
  rgb,
  Style,
  StyleCode,
} from "./styles.ts";
import { getNoColor, isNode, replaceAll } from "./util.ts";

if (isNode()) {
  // @ts-ignore Node compatibility
  globalThis.CustomEvent = Event;
}

const eventTarget = new EventTarget();

const hasColor = !getNoColor();

export interface ColorSupport {
  readonly noColor?: boolean;
  trueColor: boolean;
  highColor: boolean;
  fourBitColor: boolean;
  threeBitColor: boolean;
}

/** An object that expresses how well terminal supports displaying colors */
export const colorSupport: ColorSupport = {
  noColor: !hasColor,
  trueColor: hasColor,
  highColor: hasColor,
  fourBitColor: hasColor,
  threeBitColor: hasColor,
};

export type CrayonStyleFunction = (
  // deno-lint-ignore no-explicit-any
  ...args: any[]
) => StyleCode | string | undefined;

/** Map containing all style functions used by crayon */
export const functions = new Map<string, CrayonStyleFunction>();
/** Map containing all styles used by crayon */
export const styles = new Map<string, StyleCode | (() => StyleCode)>();

interface CrayonPrototype {
  colorSupport: ColorSupport;
  strip(text: string): string;
  optimize(text: string): string;
  literal(...text: unknown[]): string;
}

/** Object, which gets set as the prototype of every generated crayon instance in `generateCrayon()` function */
export const prototype: CrayonPrototype = {
  get colorSupport(): ColorSupport {
    return colorSupport;
  },
  set colorSupport(value: ColorSupport) {
    // Keep colorSupport object reference so it doesn't break things
    Object.assign(colorSupport, value);
    // Tell crayon to refresh all initialized styles
    eventTarget.dispatchEvent(new CustomEvent("update"));
  },
  strip(text: string): string {
    return text.replaceAll(/\x1b\[([0-9]|;)+m/gi, "");
  },
  optimize(text: string): string {
    let $text = text;
    let lenDiff = 0;
    do {
      text = $text
        .replaceAll(
          /\x1b\[([0-9]|;)+m\x1b\[0m/gi,
          "\x1b[0m",
        )
        .replaceAll(
          /(\x1b\[4([0-9]|;)+m)((\x1b\[([0-9]|;)+m)*(\x1b\[4([0-9]|;)+m))/gi,
          "$3",
        ).replaceAll(
          /(\x1b\[3([0-9]|;)+m)((\x1b\[([0-9]|;)+m)*(\x1b\[3([0-9]|;)+m))/gi,
          "$3",
        );

      lenDiff = text.length - $text.length;
      $text = text;
    } while (lenDiff !== 0);
    return text;
  },
  literal(): string {
    throw new Error(
      "You need to import extension for literal template support to be able to use it",
    );
  },
};

/** Crayon type which can be easily extended
 * `C` - literal string type for extending styles
 * `O` - object which expands
 */
export type Crayon<
  C extends string = never,
  O extends Record<string, unknown> = Record<never, never>,
> =
  & ((single: unknown, ...many: unknown[]) => string)
  & typeof prototype
  & {
    styleBuffer: string;
    usesFunc: boolean;
    keyword(style: Style): Crayon<C, O>;
    keyword(style: string): Crayon<C, O>;
    ansi3(code: number): Crayon<C, O>;
    bgAnsi3(code: number): Crayon<C, O>;
    ansi4(code: number): Crayon<C, O>;
    bgAnsi4(code: number): Crayon<C, O>;
    ansi8(code: number): Crayon<C, O>;
    bgAnsi8(code: number): Crayon<C, O>;
    rgb(r: number, g: number, b: number): Crayon<C, O>;
    bgRgb(r: number, g: number, b: number): Crayon<C, O>;
    hsl(h: number, s: number, l: number): Crayon<C, O>;
    bgHsl(h: number, s: number, l: number): Crayon<C, O>;
    hex(hex: string | number): Crayon<C, O>;
    bgHex(hex: string | number): Crayon<C, O>;
  }
  & {
    [style in Style | C]: Crayon<C, O>;
  }
  & O;

export function buildCrayon<T extends Crayon = Crayon>(
  styleBuffer = "",
  usesFunc = false,
): T {
  function crayon(
    this: T,
    single: unknown & { raw?: boolean },
    ...many: unknown[]
  ): T | string {
    if (single?.raw) return prototype.literal(single, ...many);

    // Improve performance when only one parameter is given
    const text = many.length ? `${single} ${many?.join(" ")}` : `${single}`;
    if (!styleBuffer) return text;

    return styleBuffer +
      replaceAll(text, "\x1b[0m\x1b[0m", "\x1b[0m" + styleBuffer) +
      "\x1b[0m\x1b[0m";
  }

  crayon.styleBuffer = styleBuffer;
  crayon.usesFunc = usesFunc;

  return Object.setPrototypeOf(crayon, prototype);
}

/**
 * 🖍️ Crayon object that's used for styling
 *  - Call the last property as a function with arguments to get styled string
 *
 * @example
 * ```ts
 * import { crayon } from ...;
 *
 * const info = crayon.bgBlue.white;
 *
 * console.log(
 *  info("You can cache styles like that!"),
 *  crayon.bgMagenta.black("You can also", "pass multiple arguments!")
 * );
 * ```
 *
 * When `extensions/literal.ts` is imported literal template styling is possible
 *
 * @example
 * ```ts
 * import { crayon } from ...;
 * import ".../src/extensions/literal.ts";
 *
 * console.log(
 *  crayon`{red This text is red {green this is green} and again red}`,
 *  crayon`{rgb(230,30,20) I love colors by the way}`
 * );
 * ```
 */
export const crayon = buildCrayon();

/**
 * Map given style function to `name` and `bgName` keys in `prototype`
 * When `only` is set to true only `name` key is set and no additional parameters are added when calling function
 *
 * @param name – name of the function
 * @param func – function which gets mapped
 * @param noBgSpecifier – whether to not map bgName func (also won't call additional false argument)
 */
function mapFunc(
  name: string,
  func: CrayonStyleFunction,
  noBgSpecifier = false,
): void {
  functions.set(name, func);

  if (noBgSpecifier) {
    Object.defineProperty(prototype, name, {
      value: colorSupport.noColor
        ? function () {
          return crayon;
        }
        : function (this: Crayon, ...args: unknown[]) {
          return buildCrayon(this.styleBuffer + (func(...args) ?? ""), true);
        },
    });
    return;
  }

  Object.defineProperty(prototype, name, {
    value: colorSupport.noColor
      ? function () {
        return crayon;
      }
      : function (this: Crayon, ...args: unknown[]) {
        return buildCrayon(
          this.styleBuffer + (func(...args, false) ?? ""),
          true,
        );
      },
  });

  const bgName = `bg${name[0].toUpperCase() + name.slice(1)}`;
  Object.defineProperty(prototype, bgName, {
    value: colorSupport.noColor
      ? function () {
        return crayon;
      }
      : function (this: Crayon, ...args: unknown[]) {
        return buildCrayon(
          this.styleBuffer + (func(...args, true) ?? ""),
          true,
        );
      },
  });
}

/**
 * Uses `mapFunc` on every given function
 *  - `func.name` will be considered as `name` parameter
 *
 * @param funcs – functions which will get mapped
 */
export function mapPrototypeFuncs(...funcs: CrayonStyleFunction[]): void;
/**
 * Uses `mapFunc` on every given function
 *  - map key will be used as `name` parameter
 *
 * @param maps – map which functions will get mapped
 */
export function mapPrototypeFuncs(
  ...maps: Map<string, CrayonStyleFunction>[]
): void;
export function mapPrototypeFuncs(
  ...iterable: CrayonStyleFunction[] | Map<string, CrayonStyleFunction>[]
): void {
  if (typeof iterable[0] === "function") {
    for (const func of iterable as CrayonStyleFunction[]) {
      mapFunc(func.name, func);
    }
    return;
  }

  for (const map of iterable as Map<string, CrayonStyleFunction>[]) {
    for (const [name, func] of map.entries()) {
      mapFunc(name, func);
    }
  }
}

/**
 * Map given style to `name` key in `prototype`
 *
 * @param name – name of the style
 * @param code – style code which will get mapped
 */
function mapStyle(
  name: string,
  code: StyleCode | (() => StyleCode),
): void {
  styles.set(name, code);

  const attributes: PropertyDescriptor = {
    configurable: true,
  };

  if (colorSupport.noColor) {
    attributes.value = crayon;
  } else {
    attributes.get = function (this: Crayon) {
      const prepareCrayon = () => {
        const $code = typeof code === "function" ? code() : code;

        const builtCrayon = buildCrayon(
          this.styleBuffer + $code,
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
        // Overwrite crayon instance when colorSupport value changes to adapt styles
        eventTarget.addEventListener("update", () => {
          prepareCrayon();
        });
      }

      return preparedCrayon;
    };
  }

  Object.defineProperty(prototype, name, attributes);
}

/**
 * Uses `mapStyle` on every given style code
 *  - map key will be used as `name` parameter
 * @param maps – map which styles will get mapped
 */
export function mapPrototypeStyles(
  ...maps: (Map<string, (() => StyleCode) | StyleCode>)[]
): void {
  for (const map of maps) {
    for (const [name, code] of map.entries()) {
      mapStyle(name, code);
    }
  }
}

// Map default stylings
mapPrototypeStyles(colors, attributes);
mapPrototypeFuncs(ansi3, ansi4, ansi8, rgb, hsl, hex);
mapFunc(keyword.name, keyword, true);
