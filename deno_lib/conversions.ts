import { clamp } from './util.ts'

export const ansi4ToAnsi3 = (code: number) => code % 8

export const rgbToAnsi4 = (r: number, g: number, b: number): number => {
	const value = Math.round(Math.max(r, g, b) / 64)
	return !value
		? 0
		: ((value >= 3 ? 8 : 0) + (Math.round(b / 255) << 2)) |
				(Math.round(g / 255) << 1) |
				Math.round(r / 255)
}

export const rgbToAnsi8 = (r: number, g: number, b: number): number => {
	r = Math.round(r)
	g = Math.round(g)
	b = Math.round(b)

	return r >> 4 === g >> 4 && g >> 4 === b >> 4
		? r < 8
			? 16
			: r > 248
			? 231
			: Math.round(((r - 8) / 247) * 24) + 232
		: 16 +
				36 * Math.round((r / 255) * 5) +
				6 * Math.round((g / 255) * 5) +
				Math.round((b / 255) * 5)
}

// https://github.com/Qix-/color-convert/blob/master/conversions.js
export const ansi8ToAnsi4 = (code: number): number => {
	if (code >= 232) {
		const grayness = (code - 232) * 10 + 8
		return rgbToAnsi4(grayness, grayness, grayness)
	}

	code -= 16

	const rem = code % 36
	const r = (Math.floor(code / 36) / 5) * 255
	const g = (Math.floor(rem / 6) / 5) * 255
	const b = ((rem % 6) / 5) * 255

	return rgbToAnsi4(r, g, b)
}

export const hslToRgb = (
	h: number,
	s: number,
	l: number
): [number, number, number] => {
	l /= 100
	const a = (s * Math.min(l, 1 - l)) / 100
	const f = (number: number) => {
		const k = (number + h / 30) % 12
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
		return clamp(Math.round(255 * color), 0, 255)
	}

	return [f(0), f(8), f(4)]
}
