import { styles } from './styles'

export const clamp = (num: number, min: number, max: number) =>
	Math.min(Math.max(num, min), max)

export const crayonError = (message: string) =>
	console.log(
		`[${styles.red + styles.bold}crayon${styles.reset}] ${
			styles.yellow
		}${message}${styles.reset}`
	)
