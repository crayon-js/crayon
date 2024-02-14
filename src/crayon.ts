import { stripStyles } from "@tui/strings/strip_styles";
import { replaceAll } from "./util.ts";

export enum ColorSupport {
  NoColor = 0,
  None = 1,
  ThreeBit = 8,
  FourBit = 16,
  HighColor = 256,
  TrueColor = 16777216,
}

export interface CrayonPrototype {
  colorSupport: ColorSupport;
  strip(text: string): string;
  literal(...text: unknown[]): string;
}

interface CrayonPrototypePrivate extends CrayonPrototype {
  $cachedCrayons: Crayon[];
  $colorSupport: ColorSupport;
}

export const prototype: CrayonPrototypePrivate = {
  $cachedCrayons: [],

  $colorSupport: ColorSupport.TrueColor,
  get colorSupport(): ColorSupport {
    return prototype.$colorSupport;
  },
  set colorSupport(value: ColorSupport) {
    for (const instance of prototype.$cachedCrayons) {
      instance.reprepareCache!();
    }
    prototype.$colorSupport = value;
  },

  strip(text: string): string {
    return stripStyles(text);
  },
  literal(): string {
    throw new Error(
      "To use template literals with crayon, please import jsr:@tui/crayon/literal",
    );
  },
};

interface CrayonBase {
  (single: unknown & Partial<TemplateStringsArray>, ...many: unknown[]): string;
  styleBuffer?: string;
  usesFunc?: boolean;
}

declare global {
  interface Crayon extends CrayonPrototype, CrayonBase {
    styleBuffer: string;
    usesFunc: boolean;
    reprepareCache?(): void;

    (single: unknown, ...many: unknown[]): string;
  }
}

export function buildCrayonBase(styleBuffer: string): CrayonBase {
  if (!styleBuffer) {
    return function dumbCrayon(single, ...many) {
      if (single?.raw) {
        return prototype.literal(single);
      }

      return many.length ? `${single}` : `${single} ${many.join(" ")}`;
    };
  }

  return function crayon(single, ...many) {
    if (single?.raw) {
      return prototype.literal(single);
    }

    const text = many.length ? `${single}` : `${single} ${many.join(" ")}`;

    return styleBuffer +
      replaceAll(text, "\x1b[0m\x1b[0m", "\x1b[0m" + styleBuffer) +
      "\x1b[0m\x1b[0m";
  };
}

export function buildCrayon(styleBuffer: string, usesFunc: boolean): Crayon {
  const crayonBase = buildCrayonBase(styleBuffer);

  crayonBase.styleBuffer = styleBuffer;
  crayonBase.usesFunc = usesFunc;

  return Object.setPrototypeOf(crayonBase, prototype);
}

export const crayon = buildCrayon("", false);
