import { addStyle, addStyleAlias, addStyleAliases, addStyleFunction, addStyles, functions, styles } from './styles';
import { Crayon } from './types';
export declare const config: {
    colorSupport: import("./types").CrayonColorSupport;
    optimizeStyles: {
        chain: boolean;
        literal: boolean;
    };
    errors: {
        throw: boolean;
        log: boolean;
    };
};
declare const optimizeStyles: (string: string) => string;
export declare const reloadStyles: () => void;
export declare const reloadFunctions: () => void;
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
declare const crayonInstance: Crayon<void, void>;
export { addStyleFunction, addStyleAliases, optimizeStyles, addStyleAlias, addStyles, addStyle, functions, styles, };
export default crayonInstance;
