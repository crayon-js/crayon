import { attributes, fourBitColors } from './styles'
import { Crayon } from './types'

/** @internal */
export const clamp = (num: number, min: number, max: number) =>
	Math.min(Math.max(num, min), max)

/** @internal */
export const errorConfig: Crayon['config']['errors'] = new Proxy(
	{
		log: true,
		throw: false,
	},
	{}
)

/** @internal */
export const crayonError = (message: string) => {
	if (errorConfig.log)
		console.log(
			`[${fourBitColors.red + attributes.bold}crayon${attributes.reset}] ${
				fourBitColors.yellow
			}${message}${attributes.reset}`
		)
	if (errorConfig.throw) throw new Error(message)
}
