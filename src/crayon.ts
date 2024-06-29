// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { replaceAll } from "./utils/strings.ts";
import type { CrayonStyleMethod, CrayonStyleMethodType } from "./extend.ts";
import { type CrayonExtension, extend, type NormalizedCrayonExtension } from "./extend.ts";

/** Amount of colors supported by given thing */
export enum ColorSupport {
  NoColor = 0,
  None = 1,
  ThreeBit = 8,
  FourBit = 16,
  HighColor = 256,
  TrueColor = 16777216,
}

export interface CrayonPrototype<T = unknown> {
  /**
   * Amount of colors in which crayon will operate.
   * By default it runs in {@link ColorSupport TrueColor} mode, but supports `NO_COLOR`.
   * You can use `@crayon/color-support` package to set it to amount of colors supported by terminal.
   */
  colorSupport: ColorSupport;
  /**
   * Method used for literal templating\
   * It is not implemented by default.\
   * You can use `@crayon/literal` to implement this functionality.
   * @example
   * ```ts
   * crayon`...`;
   * ```
   */
  literal(...text: unknown[]): string;
  /**
   * Returns crayon extended by given {extension}.
   * @param extension - object containing new styles and methods
   *
   * @example Static style
   * ```ts
   * crayon.use({
   *   red: "\x1b[31m",
   *   bgRed: "\x1b[41m",
   * });
   * ```
   *
   * @example Dynamic style
   * ```ts
   * crayon.use({
   *   red: () => crayon.colorSupport > 1 ? "\x1b[31m" : "",
   *   bgRed: () => crayon.colorSupport > 1 ? "\x1b[41m" : "",
   * });
   * ```
   *
   * When method is defined as a function, it will be treated as a {@linkcode CrayonStyleMethodType Variant} method.
   *
   * @example Methods
   * ```ts
   * crayon.use({
   *   rgb: (bg: boolean, r: number, g: number, b: number) => `\x1b[${bg ? 48 : 38};2;${r};${g};${b}m`,
   *   staticRgb: {
   *     fn: (r: number, g: number, b: number) => `\x1b[38;2;${r};${g};${b}m`,
   *     type: CrayonStyleMethodType.Static,
   *   }
   * });
   * ```
   */
  use<E extends CrayonExtension>(extension: E): Crayon<T & NormalizedCrayonExtension<E>>;
}

interface CrayonPrototypePrivate extends CrayonPrototype {
  $colorSupport: ColorSupport;
  $recache: [Crayon, string, () => string][];
}

const NO_COLOR = "Deno" in globalThis
  // @ts-expect-error Deno specific code
  ? Deno.noColor
  : "process" in globalThis
  // @ts-expect-error Node specific code
  ? process.env["NO_COLOR"]
  : undefined;

export const prototype: CrayonPrototypePrivate = {
  $recache: [],
  $colorSupport: NO_COLOR && NO_COLOR !== "0" ? ColorSupport.NoColor : ColorSupport.TrueColor,

  get colorSupport(): ColorSupport {
    return prototype.$colorSupport;
  },
  set colorSupport(value: ColorSupport) {
    prototype.$colorSupport = value;

    for (const [parent, name, style] of prototype.$recache) {
      const newStyleBuffer = parent.styleBuffer + style();
      Object.defineProperty(parent, name, {
        configurable: true,
        value: buildCrayon(newStyleBuffer, parent.hasMethods),
      });
    }
  },

  use(extension) {
    return extend(extension);
  },

  literal(): string {
    throw new Error(
      "To use template literals with crayon, please import jsr:@crayon/literal",
    );
  },
};

interface CrayonBase {
  (single: unknown & Partial<TemplateStringsArray>, ...many: unknown[]): string;
  styleBuffer?: string;
  hasMethods?: boolean;
}

type CrayonExtendedKey<Extension, Key extends keyof Extension> = Extension[Key] extends
  CrayonStyleMethod<infer _1, infer _2, CrayonStyleMethodType.Variant>
  // When extension has a variant method it has both normal and a background variant
  ? Key | `bg${Capitalize<Key & string>}`
  : Key;

type CrayonExtendedValue<Extension, Key extends keyof Extension> = Extension[Key] extends
  CrayonStyleMethod<infer Args, infer _O, infer _Type> ? (...args: Args) => Crayon<Extension>
  : Crayon<Extension>;

type CrayonExtended<Extension> = {
  [Key in keyof Extension as CrayonExtendedKey<Extension, Key>]: CrayonExtendedValue<
    Extension,
    Key
  >;
};

export type Crayon<T = unknown> =
  & {
    (single: unknown, ...many: unknown[]): string;
    readonly styleBuffer: string;
    readonly hasMethods: boolean;
  }
  & CrayonPrototype<T>
  & CrayonExtended<T>;

export function buildCrayonBase(styleBuffer: string): CrayonBase {
  if (!styleBuffer) {
    return function dumbCrayon(single, ...many) {
      if (single?.raw) return prototype.literal(single);
      return many.length ? `${single} ${many.join(" ")}` : `${single}`;
    };
  }

  return function crayon(single, ...many) {
    if (single?.raw) return prototype.literal(single);
    const text = many.length ? `${single} ${many.join(" ")}` : `${single}`;
    return styleBuffer +
      replaceAll(text, "\x1b[0m\x1b[0m", "\x1b[0m" + styleBuffer) +
      "\x1b[0m\x1b[0m";
  };
}

/**
 * Builds new {@linkcode Crayon} instance
 * @param styleBuffer ANSI style sequence which generated instance will have
 * @param hasMethods Whether generated instance contains method extensions
 */
export function buildCrayon<T extends Crayon = Crayon>(
  styleBuffer: string,
  hasMethods: boolean,
): T {
  const crayonBase = buildCrayonBase(styleBuffer);
  crayonBase.styleBuffer = styleBuffer;
  crayonBase.hasMethods = hasMethods;
  return Object.setPrototypeOf(crayonBase, prototype);
}

/**
 * Default crayon instance with no styles or methods whatsoever
 */
export default buildCrayon("", false) as Crayon;
