import { colorSupport, functions, styles, addStyleAlias, addStyleFunction, addStyle, addStyles, addStyleAliases } from './styles';
import { Crayon } from './types';
import { getColorSupport } from './support';
declare const optimizeStyles: (string: string) => string;
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
export { crayonInstance as crayon, addStyleFunction, getColorSupport, addStyleAliases, optimizeStyles, addStyleAlias, addStyles, addStyle, colorSupport, functions, styles, };
export default crayonInstance;
