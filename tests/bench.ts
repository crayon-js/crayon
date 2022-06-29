// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { crayon } from "../mod.ts";
import "../src/extensions/literal.ts";

import crayon231 from "https://deno.land/x/crayon@2.3.1/mod.ts";
// TODO: Test for Chalk 5.x.x, right now skypack.dev and esm.sh fails to import it because it vendored dependencies
import chalk from "https://cdn.skypack.dev/chalk@4.1.2?dts";
import ansiColors from "https://cdn.skypack.dev/ansi-colors@4.1.3?dts";
import kleur from "https://cdn.skypack.dev/kleur@4.1.4?dts";
// ---------------------------------------------------------------

const LOREM_IPSUM =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitant morbi tristique senectus et netus et malesuada. Cras pulvinar mattis nunc sed blandit libero volutpat sed cras. Vestibulum morbi blandit cursus risus at ultrices mi. Senectus et netus et malesuada fames ac turpis egestas maecenas. Tellus pellentesque eu tincidunt tortor aliquam. Condimentum lacinia quis vel eros donec ac odio tempor orci. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Elit at imperdiet dui accumsan. In cursus turpis massa tincidunt dui. Egestas diam in arcu cursus. Pellentesque habitant morbi tristique senectus et netus et malesuada. Mi bibendum neque egestas congue quisque egestas diam.`;

// RED + BGBLUE + BOLD
async function shortChain() {
  const group = "short-chain";

  await Deno.bench({
    name: "Crayon (Upstream) - Short chain",
    group,
    baseline: true,
  }, () => {
    crayon.red.bgBlue.bold("Hello");
  });

  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231.red.bgBlue.bold("Hello");
  });

  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalk.red.bgBlue.bold("Hello");
  });

  await Deno.bench({ name: "Ansi-colors 4.1.3", group }, () => {
    ansiColors.red.bgBlue.bold("Hello");
  });

  await Deno.bench({ name: "Kleur 4.1.4", group }, () => {
    kleur.red().bgBlue().bold("Hello");
  });
}

// YELLOW + BGGREEN + UNDERLINE + ITALIC + BOLD
async function longChain() {
  const group = "long-chain";

  await Deno.bench({
    name: "Crayon (Upstream) - Long chain",
    group,
    baseline: true,
  }, () => {
    crayon.yellow.bgGreen.underline.italic.bold("Hello");
  });

  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231.yellow.bgGreen.underline.italic.bold("Hello");
  });

  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalk.yellow.bgGreen.underline.italic.bold("Hello");
  });

  await Deno.bench({ name: "Ansi-colors 4.1.3", group }, () => {
    ansiColors.yellow.bgGreen.underline.italic.bold("Hello");
  });

  await Deno.bench({ name: "Kleur 4.1.4", group }, () => {
    kleur.yellow().bgGreen().underline().italic().bold("Hello");
  });
}

// MAGENTA + BGCYAN
async function longTextShortChain() {
  const group = "long-text-short-chain";

  await Deno.bench({
    name: "Crayon (Upstream) - Long text short chain",
    group,
    baseline: true,
  }, () => {
    crayon.magenta.bgCyan(LOREM_IPSUM);
  });

  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231.magenta.bgCyan(LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalk.magenta.bgCyan(LOREM_IPSUM);
  });

  await Deno.bench({ name: "Ansi-colors 4.1.3", group }, () => {
    ansiColors.magenta.bgCyan(LOREM_IPSUM);
  });

  await Deno.bench({ name: "Kleur 4.1.4", group }, () => {
    kleur.magenta().bgCyan(LOREM_IPSUM);
  });
}

// BLUE + BGRED + UNDERLINE + ITALIC + BOLD
async function longTextLongChain() {
  const group = "long-text-long-chain";

  await Deno.bench({
    name: "Crayon (Upstream) - Long text long chain",
    group,
    baseline: true,
  }, () => {
    crayon.blue.bgRed.underline.italic.bold(LOREM_IPSUM);
  });

  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231.blue.bgRed.underline.italic.bold(LOREM_IPSUM);
  });

  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalk.blue.bgRed.underline.italic.bold(LOREM_IPSUM);
  });

  await Deno.bench({ name: "Ansi-colors 4.1.3", group }, () => {
    ansiColors.blue.bgRed.underline.italic.bold(LOREM_IPSUM);
  });

  await Deno.bench({ name: "Kleur 4.1.4", group }, () => {
    kleur.blue().bgRed().underline().italic().bold(LOREM_IPSUM);
  });
}

// BGWHITE + BLACK
async function cachedShortChain() {
  const group = "cached-short-chain";

  const crayonCache = crayon.bgWhite.black;
  await Deno.bench({
    name: "Crayon (Upstream) - Cached short chain",
    group,
    baseline: true,
  }, () => {
    crayonCache("Hello");
  });

  const crayon231Cache = crayon231.bgWhite.black;
  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231Cache("Hello");
  });

  const chalkCache = chalk.bgWhite.black;
  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalkCache("Hello");
  });

  const ansiColorsCache = ansiColors.bgWhite.black;
  await Deno.bench({ name: "Ansi-colors 4.1.3", group }, () => {
    ansiColorsCache("Hello");
  });

  const kleurCache = kleur.bgWhite().black;
  await Deno.bench({ name: "Kleur 4.1.4", group }, () => {
    kleurCache("Hello");
  });
}

// BGYELLOW + CYAN + ITALIC + UNDERLINE + BOLD
async function cachedLongChain() {
  const group = "cached-long-chain";

  const crayonCache = crayon.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({
    name: "Crayon (Upstream) - Cached long chain",
    group,
    baseline: true,
  }, () => {
    crayonCache("Hello");
  });

  const crayon231Cache = crayon231.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231Cache("Hello");
  });

  const chalkCache = chalk.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalkCache("Hello");
  });

  const ansiColorsCache = ansiColors.bgYellow.cyan.italic.underline.bold;
  await Deno.bench({ name: "Ansi-colors 4.1.3", group }, () => {
    ansiColorsCache("Hello");
  });

  const kleurCache = kleur.bgYellow().cyan().italic().underline().bold;
  await Deno.bench({ name: "Kleur 4.1.4", group }, () => {
    kleurCache("Hello");
  });
}

// RGB(200,130,80) + BGHEX(#70FF90)
async function chainFunctions() {
  const group = "chain-functions";

  await Deno.bench({
    name: "Crayon (Upstream) - Chaining functions",
    group,
    baseline: true,
  }, () => {
    crayon.rgb(200, 130, 80).bgHex(0x70FF90)("Hello");
  });

  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231.rgb(200, 130, 80).bgHex("#70FF90")("Hello");
  });

  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalk.rgb(200, 130, 80).bgHex("#70FF90")("Hello");
  });

  // Kleur and Ansi-colors don't have color functions
}

async function shortLiteral() {
  const group = "short-literal";

  await Deno.bench({
    name: "Crayon (Upstream) - Short literal",
    group,
    baseline: true,
  }, () => {
    crayon`{bold Hello}, how {blue are} you{white ?}`;
  });

  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231`{bold Hello}, how {blue are} you{white ?}`;
  });

  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalk`{bold Hello}, how {blue are} you{white ?}`;
  });

  // Kleur and Ansi-colors don't support literal templating
}

async function longLiteral() {
  const group = "long-literal";

  await Deno.bench({
    name: "Crayon (Upstream) - Long literal",
    group,
    baseline: true,
  }, () => {
    crayon
      `{bgYellow Hello {bgHex(0xff0302).rgb(222,10,123) {bold C}{italic o l o r s}} {bold.italic I really enjoy you}}`;
  });

  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231
      `{bgYellow Hello {bgHex("#FF0302").rgb(222,10,123) {bold C}{italic o l o r s}} {bold.italic I really enjoy you}}`;
  });

  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalk
      `{bgYellow Hello {bgHex("#FF0302").rgb(222,10,123) {bold C}{italic o l o r s}} {bold.italic I really enjoy you}}`;
  });

  // Kleur and Ansi-colors don't support literal templating
}

async function longTextLiteral() {
  const group = "long-text-literal";

  await Deno.bench({
    name: "Crayon (Upstream) - Long text literal",
    group,
    baseline: true,
  }, () => {
    crayon
      `{red Lorem {bold ipsum dolor sit amet}, consectetur adipiscing elit, {green sed do eiusmod} tempor incididunt ut labore et dolore magna aliqua. A erat nam at lectus urna duis convallis convallis. Nunc eget lorem dolor sed viverra. Amet justo donec enim diam. Consectetur adipiscing elit pellentesque habitant morbi. Tellus at urna condimentum mattis pellentesque id nibh. Sem nulla pharetra diam sit amet. Quis blandit turpis cursus in hac habitasse platea dictumst. Nunc eget lorem dolor sed viverra ipsum nunc. Donec ac odio tempor orci. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna. Posuere lorem ipsum dolor sit amet consectetur adipiscing. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Eget duis at tellus at urna condimentum mattis pellentesque. Sem integer vitae justo eget magna fermentum iaculis eu non. Lacinia at quis risus sed vulputate. {italic Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum.}\nFaucibus ornare suspendisse sed nisi lacus sed viverra. Euismod nisi porta lorem mollis. Consequat mauris nunc congue nisi vitae suscipit tellus mauris. Platea dictumst vestibulum rhoncus est pellentesque elit. Nunc scelerisque viverra mauris in aliquam sem fringilla. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Nullam ac tortor vitae purus faucibus. Natoque penatibus et magnis dis. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Odio aenean sed adipiscing diam donec adipiscing. Cursus metus aliquam eleifend mi in nulla. Faucibus ornare suspendisse sed nisi lacus sed viverra {bold tellus}.}`;
  });

  await Deno.bench({ name: "Crayon 2.3.1", group }, () => {
    crayon231
      `{red Lorem {bold ipsum dolor sit amet}, consectetur adipiscing elit, {green sed do eiusmod} tempor incididunt ut labore et dolore magna aliqua. A erat nam at lectus urna duis convallis convallis. Nunc eget lorem dolor sed viverra. Amet justo donec enim diam. Consectetur adipiscing elit pellentesque habitant morbi. Tellus at urna condimentum mattis pellentesque id nibh. Sem nulla pharetra diam sit amet. Quis blandit turpis cursus in hac habitasse platea dictumst. Nunc eget lorem dolor sed viverra ipsum nunc. Donec ac odio tempor orci. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna. Posuere lorem ipsum dolor sit amet consectetur adipiscing. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Eget duis at tellus at urna condimentum mattis pellentesque. Sem integer vitae justo eget magna fermentum iaculis eu non. Lacinia at quis risus sed vulputate. {italic Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum.}\nFaucibus ornare suspendisse sed nisi lacus sed viverra. Euismod nisi porta lorem mollis. Consequat mauris nunc congue nisi vitae suscipit tellus mauris. Platea dictumst vestibulum rhoncus est pellentesque elit. Nunc scelerisque viverra mauris in aliquam sem fringilla. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Nullam ac tortor vitae purus faucibus. Natoque penatibus et magnis dis. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Odio aenean sed adipiscing diam donec adipiscing. Cursus metus aliquam eleifend mi in nulla. Faucibus ornare suspendisse sed nisi lacus sed viverra {bold tellus}.}`;
  });

  await Deno.bench({ name: "Chalk 4.1.2", group }, () => {
    chalk
      `{red Lorem {bold ipsum dolor sit amet}, consectetur adipiscing elit, {green sed do eiusmod} tempor incididunt ut labore et dolore magna aliqua. A erat nam at lectus urna duis convallis convallis. Nunc eget lorem dolor sed viverra. Amet justo donec enim diam. Consectetur adipiscing elit pellentesque habitant morbi. Tellus at urna condimentum mattis pellentesque id nibh. Sem nulla pharetra diam sit amet. Quis blandit turpis cursus in hac habitasse platea dictumst. Nunc eget lorem dolor sed viverra ipsum nunc. Donec ac odio tempor orci. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna. Posuere lorem ipsum dolor sit amet consectetur adipiscing. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Eget duis at tellus at urna condimentum mattis pellentesque. Sem integer vitae justo eget magna fermentum iaculis eu non. Lacinia at quis risus sed vulputate. {italic Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum.}\nFaucibus ornare suspendisse sed nisi lacus sed viverra. Euismod nisi porta lorem mollis. Consequat mauris nunc congue nisi vitae suscipit tellus mauris. Platea dictumst vestibulum rhoncus est pellentesque elit. Nunc scelerisque viverra mauris in aliquam sem fringilla. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Nullam ac tortor vitae purus faucibus. Natoque penatibus et magnis dis. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Odio aenean sed adipiscing diam donec adipiscing. Cursus metus aliquam eleifend mi in nulla. Faucibus ornare suspendisse sed nisi lacus sed viverra {bold tellus}.}`;
  });

  // Kleur and Ansi-colors don't support literal templating
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
