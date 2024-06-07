// Copyright 2024 Im-Beast. All rights reserved. MIT license.
const attributes = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  blink: "\x1b[5m",
  fastBlink: "\x1b[6m",
  invert: "\x1b[7m",
  hidden: "\x1b[8m",
  strikethrough: "\x1b[9m",
  boldOff: "\x1b[21m",
  doubleUnderline: "\x1b[21m",
  boldOrDimOff: "\x1b[22m",
  italicOff: "\x1b[23m",
  underlineOff: "\x1b[24m",
  blinkOff: "\x1b[25m",
  invertOff: "\x1b[26m",
  hiddenOff: "\x1b[27m",
  strikethroughOff: "\x1b[28m",
};

export type Attribute = keyof typeof attributes;

export default attributes;
