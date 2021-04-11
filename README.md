<font size="6"><p align="center"><b>🖍️ Crayon.js</b></p></font>
<hr />

## :books: About
##### Crayon.js is **one of the best**<sup><sup>1</sup></sup> performing terminal styling. Additionaly written in TypeScript.

Instead of straight up saying "use it, it's better" check yourself what meets your requirements.

<details>
<summary><font size="3"><b>📖 TL;DR</b></font></summary>
<h4>🖍️ crayon.js has:</h4>
<font size="3.5">
  <ul>
    <li>⚡ High performance</li>
    <li>📦 No dependencies</li>
    <li>⏱️ Low import times</li>
    <li>🦄 Automatic color support & fallbacking</li>
    <li>🔗 Supported nesting & chaining</li>
    <li>🌈 8bit (256) and 24bit (16.7m) color support</li>
    <li>🌟 Emojis, really just bcs of that you should star this repo</li>
  </ul>
</font>
</details>

<br />

If you don't need all the features but still like crayon.js checkout [`@crayon.js/lite`](https://github.com/Im-Beast/crayon.js/tree/lite)

### Installation
```bash
npm install crayon.js #yarn add crayon.js
```
### Usage
```ts
const crayon = require('crayon.js')
/* In TypeScript you can do: 
 * import * as crayon from 'crayon.js'
 * import crayon = require('crayon.js')
 */

// Chainable API
console.log(crayon.bgYellow.black('Hello!'))

/* Notice how you can use CSS Keywords directives directly for colors.
 * If terminal does not support 24bit colors it will fallback to 8/4/3 bit or none
 * colors depending on which one is supported
 */
console.log(crayon.bgKhaki.orange('World!'))

/* Crayon.js supports also using function api
 * It's not as elegant but removes a bit of overhead
 * And I'm looking forward to improve it
 */
console.log(crayon.keyword('bgKhaki').keyword('orange')('The same world!'))

/* Crayon.js allows you to not only apply colors
 * but also attributes (named modifiers by some other libs)
 * Of course you can mix them with colors if you want
 */
console.log(crayon.bold(`Isn't this text kinda thicc`))

/* Styles (this means both attributes and colors)
 * can be nested together in a string
 */
console.log(`${crayon.blue.bold(`wow ${crayon.red('that')}`)} ${crayon.yellow('is kinda cool')}`)

/* You can cache style, chalk names it "theme".
 * Remember to call main crayon instance as function to create theme.
 * If you're using the same style X times it's
 * worth to cache it as it improves performance.
 * modifying cached style will result it to change everywhere
 * and cached style can't be reset.
 */
const error = crayon().bgYellow.red
console.log(error('this is error!'))
console.log(error('this will also have the same style applied!!'))
```

### API

## ``crayon.<[...style](value*) | ()[...style](value*)>``
``* - it has to be able to be converted to string otherwise it'll throw an error``
```js
// Examples:
crayon.bgRed.olive('Welcome')
crayon().bgRed.olive('This will work too just fine')
```

```js
/* Style order don't matter, if they overlap
 * they'll be overwritten using last typed one.
 * However crayon doesn't clean up unused styles.
 * This means expression below will return false.
 */
crayon.red.blue('this will be blue') === crayon.blue('this will be blue')
```

## crayon.colorSupport
```ts
interface ColorSupport {
	/** 24bit (16.7m) color palette */
	trueColor: boolean
	/** 8bit (256) color palette */
	highColor: boolean
	/** 4bit (16) color palette */
	fourBitColor: boolean
	/** 3bit (8) color palette */
	threeBitColor: boolean
}
```
Crayon should detect supported terminal colors but if it does not you can overwrite them. <br />
Color support settings are defined globally, so if you change it in main crayon object it'll also affect other crayon instances

Crayon supports NO_COLOR env variable, this means that if you have set one to true-ish value it'll stop displaying colors.

## Supported attributes
Crayon supports most of these displayed [here](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters).<br />
To see exactly which ones you can go [here](src/styles.ts) and check <b>attributes</b> variable.
## Color names
All 4bit colors have their own name
Syntax of naming colors is
### `[bg][light | Light]<baseColorName | BaseColorName>`
for example:
``red, lightRed, bgRed, bgLightRed``

Available base color names:

<table>
  <tr align="center">
    <td>black</td>
    <td>red</td>
    <td>green</td>
    <td>yellow</td>
  </tr>
  <tr align="center">
    <td>blue</td>
    <td>magenta</td>
    <td>cyan</td>
    <td>white</td>
  </tr>
</table>

## Functions

### `crayon.<...function(...arguments)>`
### `crayon.$functions.<...function(...arguments)>`

#### Color Functions
<table>
  <tr align="center">
    <th>function</th>
    <td>rgb (red,green,blue)</td>
    <td>hsl(hue,saturation,lightness)</td>
    <td>hex</td>
    <td>ansi3</td>
    <td>ansi4</td>
    <td>ansi8</td>
    <td>keyword</td>
  </tr>
  <tr align="center">
    <th>syntax</th>
    <td>(0-255, 0-255, number)</td>
    <td>(0-360, 0-100, 0-100)</td>
    <td>#000000 - #FFFFFF</td>
    <td>0-7</td>
    <td>0-15</td>
    <td>0-255</td>
    <td><a href="https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json">css keyword</a></td>
  </tr>
</table>

#### Misc Functions
<table>
  <tr align="center">
    <th>function</th>
    <td>strip</td>
  </tr>
  <tr align="center">
    <th>syntax</th>
    <td>(string)</td>
  </tr>
    <tr align="center">
    <th>description</th>
    <td>returns text with no styling</td>
  </tr>
</table>

If numerical arguments are out of given range they get automatically clamped.

<br/>
<details>
<summary><font size="2">1 - More on that</font></summary>

<b>X</b> packages define themself as the fastest one, however most of them just lie. <br /> <br />
<b>Kleur</b> and <b>ansi-colors</b> advertise themself as "The fastest Node.js library for terminal styling". <br /> However in later tests they fall far behind chalk, which is probably the most popular package for that right now. <br /> <br />
Don't get me wrong, I have nothing to the authors of them but they either provide outdated info (chalk 3.0 received very big performance boost) or straight lie.
</details>

## :package: Feature set
<details>
  <summary>Features</summary>
  <br />
  <table>
    <tr align="center">
      <th>Feature</th>
      <th>crayon.js</th>
      <th>chalk</th>
      <th>ansi-colors</th>
      <th>kleur</th>
    </tr>
    <tr align="center">
      <th>Color fallback <sub><sup>(conversion/detection)</sup></sub></th>
        <th>:heavy_check_mark: </th>
        <th>:heavy_check_mark: <sub><sup>(missing 8->4bit)</sup></sub> </th>
        <th>:heavy_multiplication_x: <sub><sup>(only using external libs)</sup></sub></th>
        <th>:heavy_multiplication_x: <sub><sup>(only using external libs)</sup></sub></th>
    </tr>
    <tr align="center">
      <th>Atrributes <sub><sup>(Modifiers)</sup></sub></th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
    </tr>
    <tr align="center">
      <th>4bit <sub><sup>(16)</sup></sub></th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
    </tr>
    <tr align="center">
      <th>8bit <sub><sup>(HighColor)</sup></sub></th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_multiplication_x:</th>
        <th>:heavy_multiplication_x:</th>
    </tr>
    <tr align="center">
      <th>24bit <sub><sup>(TrueColor)</sup></sub></th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_multiplication_x:</th>
        <th>:heavy_multiplication_x:</th>
    </tr>
    <tr align="center">
      <th>Doesn't extend prototype</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
    </tr>
    <tr align="center">
      <th>Nested styling</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_check_mark:</th>
    </tr>
    <tr align="center">
      <th>Full Typescript/<br />Autocompletion support</th>
        <th>:heavy_check_mark:</th>
        <th>:heavy_multiplication_x:</th>
        <th>:heavy_multiplication_x:</th>
        <th>:heavy_multiplication_x:</th>
    </tr>
  </table>
</details>

## :zap: Performance
<details>

  ##### Methodology:
  All tests were done on my PC which is not in any way fast.

  Require times have been measured using [this script](/test/require-times.js). <br />
  Access and render performance have been measured using [this script](/test/benchmark.ts).

  Best performing subject (*± 10%*) has been marked with bold font

  ##### Results:

  <table>
    <tr align="center">
      <th>Test subject</th>
      <th>⏱️ Require times (ms)</th>
      <th>🧪 Access time (kops)</th>
      <th>🖍️ Render test (kops)</th>
    </tr>
    <tr align="center">
      <td>crayon.js (chain)</td>
      <td rowspan="3"><b color="green">6.6 ±0.13<b></td>
      <td>246</td>
      <td>18</td>
    </tr>
    <tr align="center">
      <td>crayon.js (func)</td>
      <td>450</td>
      <td>20</td>
    </tr>
    <tr align="center">
      <td>crayon.js (cached)</td>
      <td><b color="green">4000</b></td>
      <td><b color="green">22</b></td>
    </tr>
    <tr align="center">
      <td>chalk (chain)</td>
      <td rowspan="2">8.8 ±1.22</td>
      <td>3333</td>
      <td>16</td>
    </tr>
    <tr align="center">
      <td>chalk (cached)</td>
      <td><b color="green">4000</b></td>
      <td><b color="green">21</b></td>
    </tr>
    <tr align="center">
      <td>ansi-colors (chain)</td>
      <td rowspan="2">6.9 ±0.60</td>
      <td>199</td>
      <td>14</td>
    </tr>
    <tr align="center">
      <td>ansi-colors (cached)</td>
      <td>788</td>
      <td>16</td>
    </tr>
    <tr align="center">
      <td>kleur</td>
      <td><b color="green">6.1 ±0.05</b></td>
      <td>495</td>
      <td>15</td>
    </tr>
  </table>

</details>

## :handshake: Contributing
#### Feel free to fork, add commits and pull requests

## :memo: Licensing
#### This project is available under MIT License conditions.