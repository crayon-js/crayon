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
import { AnyFunction, capitalize } from "./util.ts";

const hasColor = !Deno.noColor;

export interface ColorSupport {
  trueColor: boolean;
  highColor: boolean;
  fourBitColor: boolean;
  threeBitColor: boolean;
}

export const colorSupport: ColorSupport = {
  trueColor: hasColor,
  highColor: hasColor,
  fourBitColor: hasColor,
  threeBitColor: hasColor,
};

const properties = {
  get colorSupport(): ColorSupport {
    return colorSupport;
  },
  set colorSupport(value: ColorSupport) {
    if (hasColor) Object.assign(colorSupport, value);
  },
  strip(text: string): string {
    // deno-lint-ignore no-control-regex
    return text.replace(/\x1b\[[0-9]([0-9])?([0-9])?m/gi, "");
  },
};

export function mapPrototypeFuncs(...funcs: AnyFunction[]) {
  for (const func of funcs) {
    Object.defineProperty(properties, func.name, {
      value(...args: unknown[]) {
        this.buffer += func(...args, false);
        const { buffer } = this;
        this.buffer = "";
        return generateCrayon(buffer);
      },
    });

    Object.defineProperty(properties, `bg${capitalize(func.name)}`, {
      value(...args: unknown[]) {
        this.buffer += func(...args, true);
        const { buffer } = this;
        this.buffer = "";
        return generateCrayon(buffer);
      },
    });
  }
}

export function mapPrototypeStyles(...maps: Map<string, StyleCode>[]): void {
  for (const codes of maps) {
    for (const [name, code] of codes.entries()) {
      Object.defineProperty(properties, name, {
        get() {
          this.buffer += code;
          const { buffer } = this;
          this.buffer = "";
          return generateCrayon(buffer);
        },
      });
    }
  }
}

export type Crayon<
  C extends string = never,
  // deno-lint-ignore ban-types
  O extends Record<string, unknown> = {},
> =
  & ((...text: unknown[]) => string)
  & typeof properties
  // deno-lint-ignore ban-types
  & (<A extends string = "", B extends Record<string, unknown> = {}>() =>
    Crayon<C | A, O & B>)
  & {
    buffer: string;
    keyword(style: Style): Crayon<C, O>;
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

export function generateCrayon<
  C extends string = never,
  // deno-lint-ignore ban-types
  O extends Record<string, unknown> = {},
>(buffer?: string): Crayon<C, O> {
  const crayon = ((...text: unknown[]) => {
    if (!text.length) return crayon;

    return crayon.buffer +
      text
        .join(" ")
        .replace("\x1b[0m", `\x1b[0m${crayon.buffer}`) +
      "\x1b[0m";
  }) as Crayon<C, O>;

  crayon.buffer = buffer ?? "";

  Object.setPrototypeOf(crayon, properties);

  return crayon;
}

mapPrototypeStyles(colors, attributes);
mapPrototypeFuncs(keyword, ansi3, ansi4, ansi8, rgb, hsl, hex);

export const crayon = generateCrayon();
