import { ColorSupport } from './types.ts'

let threeBitColor = true
let fourBitColor = true
let highColor = true
let trueColor = true

const supportedColors = (): ColorSupport => ({
	threeBitColor,
	fourBitColor,
	highColor,
	trueColor,
})

export const getColorSupport = (): ColorSupport => {
	return supportedColors()
}
