import { Crayon } from './types';
/**
 *
 * Main Crayon object used to chain styles:
 * * call as function after chaining with given argument to get styled string
 *
 * @example
 * ```ts
 * import crayon = require('crayon.js')
 *
 * crayon.red.bgBlue.bold('🖍️ crayon')
 * ```
 *
 * * call as function at the beginning without arguments to receive new Crayon object which can be used to cache styling
 * @example
 * ```ts
 * import crayon = require('crayon.js')
 *
 * const warning = crayon().bgRed.keyword('orange').italic
 *
 * console.log(warning('THIS IS REALLY WARNY'))
 * console.log(warning('something failed'))
 * ```
 */
declare const crayonInstance: Crayon;
export = crayonInstance;
