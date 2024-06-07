// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import crayon, { type Crayon } from "./crayon.ts";
import type { NormalizedCrayonExtension } from "./extend.ts";
import {
  type Attribute,
  attributes,
  type FourBitColor,
  fourBitColors,
  methods,
} from "./styles/styles.ts";

type BaseExtension =
  & typeof methods
  & { [K in Attribute | FourBitColor]: string };

/**
 * 🖍️ Crayon instance extended by default styles and methods.
 *
 * @example
 * ```ts
 *
 * ```
 */
export default crayon
  .use(attributes)
  .use(fourBitColors)
  .use(methods) as Crayon<NormalizedCrayonExtension<BaseExtension>>;
