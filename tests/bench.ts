// Copyright 2022 Im-Beast. All rights reserved. MIT license.
import { crayon } from "../mod.ts";
import "../src/extensions/literal.ts";
import oldCrayon from "https://deno.land/x/crayon@2.3.1/mod.ts";
// @deno-types="https://deno.land/x/chalk_deno@v4.1.1-deno/index.d.ts"
import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

type Colorer =
  | typeof crayon
  | typeof oldCrayon
  | typeof chalk;

async function bench(
  name: string,
  test: (colorer: Colorer) => () => void,
) {
  await Deno.bench({
    name: `Crayon: ${name}`,
    group: name,
    baseline: true,
  }, test(crayon));

  await Deno.bench({
    name: `Old crayon: ${name}`,
    group: name,
  }, test(oldCrayon));

  await Deno.bench({
    name: `Chalk: ${name}`,
    group: name,
  }, test(chalk));
}

function chainTest(
  colorer: Colorer,
): () => void {
  return () => colorer.green.bold(`Hello ${colorer.italic("there")}`);
}

function oneLongChainTest(
  colorer: Colorer,
): () => void {
  return () =>
    colorer.green.bold.yellow.bgBlue.magenta.bold.italic.underline.bgCyan(
      `Hello ${colorer.italic("there")}`,
    );
}

function advancedChainTest(
  colorer: Colorer,
): () => void {
  return () =>
    colorer.bgYellow(
      "Hello " +
        colorer.bgHex(
          // @ts-expect-error g
          colorer !== oldCrayon ? 0xff0302 : "#FF0302",
        ).rgb(222, 10, 123)(
          `${colorer.bold("C")}${colorer.italic(`o l o r s`)}`,
        ) + colorer.bold.italic("I really enjoy you."),
    );
}

function longChainTest(colorer: Colorer): () => void {
  return () =>
    colorer.red(
      `Lorem ${
        colorer.bold("ipsum dolor sit amet")
      }, consectetur adipiscing elit, ${
        colorer.green("sed do eiusmod")
      } tempor incididunt ut labore et dolore magna aliqua. A erat nam at lectus urna duis convallis convallis. Nunc eget lorem dolor sed viverra. Amet justo donec enim diam. Consectetur adipiscing elit pellentesque habitant morbi. Tellus at urna condimentum mattis pellentesque id nibh. Sem nulla pharetra diam sit amet. Quis blandit turpis cursus in hac habitasse platea dictumst. Nunc eget lorem dolor sed viverra ipsum nunc. Donec ac odio tempor orci. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna. Posuere lorem ipsum dolor sit amet consectetur adipiscing. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Eget duis at tellus at urna condimentum mattis pellentesque. Sem integer vitae justo eget magna fermentum iaculis eu non. Lacinia at quis risus sed vulputate. ${
        colorer.italic(
          "Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum.",
        )
      }\nFaucibus ornare suspendisse sed nisi lacus sed viverra. Euismod nisi porta lorem mollis. Consequat mauris nunc congue nisi vitae suscipit tellus mauris. Platea dictumst vestibulum rhoncus est pellentesque elit. Nunc scelerisque viverra mauris in aliquam sem fringilla. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Nullam ac tortor vitae purus faucibus. Natoque penatibus et magnis dis. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Odio aenean sed adipiscing diam donec adipiscing. Cursus metus aliquam eleifend mi in nulla. Faucibus ornare suspendisse sed nisi lacus sed viverra ${
        colorer.bold("tellus")
      }.`,
    );
}

function literalTemplateTest(
  colorer: Colorer,
): () => void {
  return () => colorer`{bold Hello}, what's {blue going} on{white ?}`;
}

function advancedLiteralTemplateTest(
  colorer: Colorer,
): () => void {
  return () =>
    colorer`{bgYellow Hello {bgHex(${
      colorer !== oldCrayon ? "0xff0302" : "#FF0302"
    }).rgb(222,10,123) {bold C}{italic o l o r s}} {bold.italic I really enjoy you}}`;
}

function longLiteralTemplateTest(colorer: Colorer): () => void {
  return () =>
    colorer
      `{red Lorem {bold ipsum dolor sit amet}, consectetur adipiscing elit, {green sed do eiusmod} tempor incididunt ut labore et dolore magna aliqua. A erat nam at lectus urna duis convallis convallis. Nunc eget lorem dolor sed viverra. Amet justo donec enim diam. Consectetur adipiscing elit pellentesque habitant morbi. Tellus at urna condimentum mattis pellentesque id nibh. Sem nulla pharetra diam sit amet. Quis blandit turpis cursus in hac habitasse platea dictumst. Nunc eget lorem dolor sed viverra ipsum nunc. Donec ac odio tempor orci. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna. Posuere lorem ipsum dolor sit amet consectetur adipiscing. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Eget duis at tellus at urna condimentum mattis pellentesque. Sem integer vitae justo eget magna fermentum iaculis eu non. Lacinia at quis risus sed vulputate. {italic Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum.}\nFaucibus ornare suspendisse sed nisi lacus sed viverra. Euismod nisi porta lorem mollis. Consequat mauris nunc congue nisi vitae suscipit tellus mauris. Platea dictumst vestibulum rhoncus est pellentesque elit. Nunc scelerisque viverra mauris in aliquam sem fringilla. Volutpat lacus laoreet non curabitur gravida arcu ac tortor. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Nullam ac tortor vitae purus faucibus. Natoque penatibus et magnis dis. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Odio aenean sed adipiscing diam donec adipiscing. Cursus metus aliquam eleifend mi in nulla. Faucibus ornare suspendisse sed nisi lacus sed viverra {bold tellus}.}`;
}

function cacheTest(
  colorer: Colorer,
): () => void {
  const isOldCrayon = colorer === oldCrayon;
  const cache = (isOldCrayon ? colorer() : colorer).bgRgb(75, 30, 15).hex(
    isOldCrayon ? "#0380FF" : "0x0380ff",
  ).bold.italic.underline;
  return () => cache("Hello, it's me");
}

await bench("Chaining", chainTest);
await bench("Advanced Chaining", advancedChainTest);
await bench("One long chain", oneLongChainTest);
await bench("Long Chaining", longChainTest);
await bench("Cached chaining", cacheTest);

await bench("Literal Templating", literalTemplateTest);
await bench("Advanced Literal Templating", advancedLiteralTemplateTest);
await bench("Long Literal Templating", longLiteralTemplateTest);

// TODO: kleur and ansi-colors comparison
