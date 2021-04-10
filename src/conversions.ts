import { clamp } from './util'

export const rgbToAnsi4 = (r: number, g: number, b: number): number => {
	const value = Math.round(Math.max(r, g, b) / 255)
	return value > 0
		? (value === 1 ? 90 : 30) +
				((Math.round(b / 255) << 2) |
					(Math.round(g / 255) << 1) |
					Math.round(r / 255))
		: 30
}

export const rgbToAnsi8 = (r: number, g: number, b: number): number => {
	r = Math.round(r)
	g = Math.round(g)
	b = Math.round(b)
	return r === g && b == g
		? r < 8
			? 16
			: r > 248
			? 231
			: ((r - 8) / 247) * 24 + 232
		: 36 * (r / 255) * 5 + 6 * (g / 255) * 5 + (b / 255) * 5 + 16
}

// https://github.com/Qix-/color-convert/commit/3c0007f11db95a1577269ebae8b8d8203ca10e10
export const ansi8ToAnsi4 = (code: number): number => {
	if (code < 8) return code + 30
	if (code < 16) return code + 82
	if (code >= 251) return 97
	if (code >= 246) return 37
	if (code >= 235) return 90
	if (code >= 232) return 30

	code -= 16
	const rem = code % 36

	const r = Math.round((~~code / 36 / 5) * 0.3 + 0.35)
	const g = Math.round((~~rem / 6 / 5) * 0.3 + 0.35)
	const b = Math.round(((rem % 6) / 5) * 0.3 + 0.35)

	const v = Math.round(Math.max(r, g, b))
	return 30 + ((b << 2) | (g << 1) | r) + v * 199.65
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

exports = { rgbToAnsi4, rgbToAnsi8, hslToRgb, ansi8ToAnsi4 }
