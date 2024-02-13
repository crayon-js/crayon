// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { buildCrayon, crayon } from "../mod.ts";
import "../src/extensions/literal.ts";

import chalk4 from "npm:chalk@^4";
import chalk5, { Chalk } from "npm:chalk@^5";
import chalkTemplate from "npm:chalk-template@^1";
import kleur from "npm:kleur@^4";
import ansiColors from "npm:ansi-colors@^4";
import { colors as cliffy } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

const SHORT_LOREM_IPSUM = `Lorem ipsum`;

const LONG_LOREM_IPSUM =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitant morbi tristique senectus et netus et malesuada. Cras pulvinar mattis nunc sed blandit libero volutpat sed cras. Vestibulum morbi blandit cursus risus at ultrices mi. Senectus et netus et malesuada fames ac turpis egestas maecenas. Tellus pellentesque eu tincidunt tortor aliquam. Condimentum lacinia quis vel eros donec ac odio tempor orci. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Elit at imperdiet dui accumsan. In cursus turpis massa tincidunt dui. Egestas diam in arcu cursus. Pellentesque habitant morbi tristique senectus et netus et malesuada. Mi bibendum neque egestas congue quisque egestas diam.`;

const TEMPLATE_TEST = `{bold Hello}, how {blue are} you{white ?}`;

const LONG_TEMPLATE_TEST_LOREM_IPSUM =
  `{bgYellow Hello {bgHex("#FF0302").rgb(222,10,123) {bold C}{italic o l o r s}} {bold.italic I really enjoy you}}`;

const LONG_TEMPLATE_TEST_LOREM_IPSUM_CRAYON = LONG_TEMPLATE_TEST_LOREM_IPSUM
  .replace('"#FF0302"', "0xff0302");

const LONG_TEXT_TEMPLATE_TEST_LOREM_IPSUM =
  `{red Lorem {bold ipsum dolor sit amet}, consectetur adipiscing elit, {green sed do eiusmod} tempor incididunt ut labore et dolore magna aliqua. A erat nam at lectus urna duis convallis convallis. Nunc eget lorem dolor sed viverra. Amet justo donec enim diam. Consectetur adipiscing elit pellentesque habitant morbi. Tellus at urna condimentum mattis pellentesque id nibh. Sem nulla pharetra diam sit amet. Quis blandit turpis cursus in hac habitasse platea dictumst. Nunc eget lorem dolor sed viverra ipsum nunc. Donec ac odio tempor orci. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna. Posuere lorem ipsum dolor sit amet consectetur adipiscing. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Eget duis at tellus at urna condimentum mattis pellentesque. Sem integer vitae justo eget magna fermentum iaculis eu non. Lacinia at quis risus sed vulputate. {italic Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum.}\nFaucibus ornare suspendisse sed nisi lacus sed viverra. Euismod nisi porta lorem mollis. Consequat mauris nunc congue nisi vitae suscipit tellus mauris. Platea dictumst vestibulum rhoncus est pellentesque elit. Nunc scelerisque viverra mauris in aliquam sem fringilla. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Nullam ac tortor vitae purus faucibus. Natoque penatibus et magnis dis. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Odio aenean sed adipiscing diam donec adipiscing. Cursus metus aliquam eleifend mi in nulla. Faucibus ornare suspendisse sed nisi lacus sed viverra {bold tellus}.}`;

// RED + BGBLUE + BOLD
async function shortChain() {
  const group = "short-chain";

  await Deno.bench({
    name: "Crayon - Short chain",
    group,
    baseline: true,
  }, () => {
    crayon.red.bgBlue.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalk4.red.bgBlue.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 5", group }, () => {
    chalk5.red.bgBlue.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Cliffy", group }, () => {
    cliffy.red.bgBlue.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Ansi-colors", group }, () => {
    ansiColors.red.bgBlue.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Kleur", group }, () => {
    kleur.red().bgBlue().bold(SHORT_LOREM_IPSUM);
  });
}

// YELLOW + BGGREEN + UNDERLINE + ITALIC + BOLD
async function longChain() {
  const group = "long-chain";

  await Deno.bench({
    name: "Crayon - Long chain",
    group,
    baseline: true,
  }, () => {
    crayon.yellow.bgGreen.underline.italic.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalk4.yellow.bgGreen.underline.italic.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 5", group }, () => {
    chalk5.yellow.bgGreen.underline.italic.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Cliffy", group }, () => {
    cliffy.yellow.bgGreen.underline.italic.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Ansi-colors", group }, () => {
    ansiColors.yellow.bgGreen.underline.italic.bold(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Kleur", group }, () => {
    kleur.yellow().bgGreen().underline().italic().bold(SHORT_LOREM_IPSUM);
  });
}

// MAGENTA + BGCYAN
async function longTextShortChain() {
  const group = "long-text-short-chain";

  await Deno.bench({
    name: "Crayon - Long text short chain",
    group,
    baseline: true,
  }, () => {
    crayon.magenta.bgCyan(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalk4.magenta.bgCyan(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 5", group }, () => {
    chalk5.magenta.bgCyan(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Cliffy", group }, () => {
    cliffy.magenta.bgCyan(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Ansi-colors", group }, () => {
    ansiColors.magenta.bgCyan(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Kleur", group }, () => {
    kleur.magenta().bgCyan(LONG_LOREM_IPSUM);
  });
}

// BLUE + BGRED + UNDERLINE + ITALIC + BOLD
async function longTextLongChain() {
  const group = "long-text-long-chain";

  await Deno.bench({
    name: "Crayon - Long text long chain",
    group,
    baseline: true,
  }, () => {
    crayon.blue.bgRed.underline.italic.bold(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalk4.blue.bgRed.underline.italic.bold(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 5", group }, () => {
    chalk5.blue.bgRed.underline.italic.bold(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Cliffy", group }, () => {
    cliffy.blue.bgRed.underline.italic.bold(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Ansi-colors", group }, () => {
    ansiColors.blue.bgRed.underline.italic.bold(LONG_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Kleur", group }, () => {
    kleur.blue().bgRed().underline().italic().bold(LONG_LOREM_IPSUM);
  });
}

// BGWHITE + BLACK
async function cachedShortChain() {
  const group = "cached-short-chain";

  const crayonCache = crayon.bgWhite.black;
  await Deno.bench({
    name: "Crayon - Cached short chain",
    group,
    baseline: true,
  }, () => {
    crayonCache(SHORT_LOREM_IPSUM);
  });

  const chalkCache412 = chalk4.bgWhite.black;
  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalkCache412(SHORT_LOREM_IPSUM);
  });

  const chalkCache512 = chalk5.bgWhite.black;
  await Deno.bench({ name: "Chalk 5", group }, () => {
    chalkCache512(SHORT_LOREM_IPSUM);
  });

  const cliffyCache0243 = cliffy.bgWhite.black;
  await Deno.bench({ name: "Cliffy", group }, () => {
    cliffyCache0243(SHORT_LOREM_IPSUM);
  });

  const ansiColorsCache413 = ansiColors.bgWhite.black;
  await Deno.bench({ name: "Ansi-colors", group }, () => {
    ansiColorsCache413(SHORT_LOREM_IPSUM);
  });

  const kleurCache414 = kleur.bgWhite().black;
  await Deno.bench({ name: "Kleur", group }, () => {
    kleurCache414(SHORT_LOREM_IPSUM);
  });
}

// BGYELLOW + CYAN + ITALIC + UNDERLINE + BOLD
async function cachedLongChain() {
  const group = "cached-long-chain";

  const crayonCache = crayon.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({
    name: "Crayon - Cached long chain",
    group,
    baseline: true,
  }, () => {
    crayonCache(SHORT_LOREM_IPSUM);
  });

  const chalkCache412 = chalk4.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalkCache412(SHORT_LOREM_IPSUM);
  });

  const chalkCache512 = chalk5.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({ name: "Chalk 5", group }, () => {
    chalkCache512(SHORT_LOREM_IPSUM);
  });

  const cliffyCache0243 = cliffy.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({ name: "Cliffy", group }, () => {
    cliffyCache0243(SHORT_LOREM_IPSUM);
  });

  const ansiColorsCache = ansiColors.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({ name: "Ansi-colors", group }, () => {
    ansiColorsCache(SHORT_LOREM_IPSUM);
  });

  const kleurCache = kleur.bgYellow().cyan().italic().underline().bold;
  await Deno.bench({ name: "Kleur", group }, () => {
    kleurCache(SHORT_LOREM_IPSUM);
  });
}

// RGB(200,130,80) + BGHEX(#70FF90)
async function chainFunctions() {
  const group = "chain-functions";

  await Deno.bench({
    name: "Crayon - Chaining functions",
    group,
    baseline: true,
  }, () => {
    crayon.rgb(200, 130, 80).bgHex(0x70FF90)(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalk4.rgb(200, 130, 80).bgHex("#70FF90")(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 5", group }, () => {
    chalk5.rgb(200, 130, 80).bgHex("#70FF90")(SHORT_LOREM_IPSUM);
  });

  await Deno.bench({ name: "Cliffy", group }, () => {
    cliffy.rgb24(cliffy.bgRgb24(SHORT_LOREM_IPSUM, 0x70FF90), {
      r: 200,
      g: 130,
      b: 80,
    });
  });

  // Kleur and Ansi-colors don't have color functions
}

async function shortLiteral() {
  const group = "short-literal";

  await Deno.bench({
    name: "Crayon - Short literal",
    group,
    baseline: true,
  }, () => {
    crayon`${TEMPLATE_TEST}`;
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalk4`${TEMPLATE_TEST}`;
  });

  await Deno.bench({ name: "Chalk Template 0.4.0", group }, () => {
    chalkTemplate`${TEMPLATE_TEST}`;
  });

  // Cliffy, Kleur and Ansi-colors don't support literal templating
}

async function longLiteral() {
  const group = "long-literal";

  await Deno.bench({
    name: "Crayon - Long literal",
    group,
    baseline: true,
  }, () => {
    crayon`${LONG_TEMPLATE_TEST_LOREM_IPSUM_CRAYON}`;
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalk4`${LONG_TEMPLATE_TEST_LOREM_IPSUM}`;
  });

  await Deno.bench({ name: "Chalk Template 0.4.0", group }, () => {
    chalkTemplate`${LONG_TEMPLATE_TEST_LOREM_IPSUM}`;
  });

  // Cliffy, Kleur and Ansi-colors don't support literal templating
}

async function longTextLiteral() {
  const group = "long-text-literal";

  await Deno.bench({
    name: "Crayon - Long text literal",
    group,
    baseline: true,
  }, () => {
    crayon`${LONG_TEXT_TEMPLATE_TEST_LOREM_IPSUM}`;
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    chalk4`${LONG_TEXT_TEMPLATE_TEST_LOREM_IPSUM}`;
  });

  await Deno.bench({ name: "Chalk Template 0.4.0", group }, () => {
    chalkTemplate`${LONG_TEXT_TEMPLATE_TEST_LOREM_IPSUM}`;
  });

  // Cliffy, Kleur and Ansi-colors don't support literal templating
}

async function generateInstance() {
  const group = "generating-instance";

  await Deno.bench({
    name: "Crayon - Generating instance",
    group,
    baseline: true,
  }, () => {
    buildCrayon();
  });

  await Deno.bench({ name: "Chalk 4", group }, () => {
    new chalk4.Instance();
  });

  await Deno.bench({ name: "Chalk 5", group }, () => {
    new Chalk({ level: 3 });
  });
}

shortChain();
longChain();
longTextShortChain();
longTextLongChain();
cachedShortChain();
cachedLongChain();
chainFunctions();

shortLiteral();
longLiteral();
longTextLiteral();

generateInstance();
