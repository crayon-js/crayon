import { ColorSupport } from './types'

let os: any, execSync: any

const getWindowsVersion = (): number[] => {
	os ||= require('os')
	if (process.platform == 'win32') {
		const [version, , versionId] = os.release().split('.')
		return [Number(version), Number(versionId)]
	}
	return []
}

let threeBitColor = false
let fourBitColor = false
let highColor = false
let trueColor = false

const supportedColors = (): ColorSupport => ({
	threeBitColor,
	fourBitColor,
	highColor,
	trueColor,
})

export const getColorSupport = (): ColorSupport => {
	if (process.env.NO_COLOR) {
		trueColor = false
		highColor = false
		fourBitColor = false
		return supportedColors()
	}

	switch (process.env.COLORTERM) {
		case 'truecolor':
			trueColor = true
			highColor = true
			fourBitColor = true
			return supportedColors()
		// are there other settings for that variable?
	}

	if (/-?256(color)?/gi.test(process.env.TERM || '')) {
		highColor = true
		fourBitColor = true
		return supportedColors()
	}

	const CIs = [
		'TRAVIS',
		'CIRCLECI',
		'GITHUB_ACTIONS',
		'GITLAB_CI',
		'BUILDKITE',
		'DRONE',
		'APPVEYOR',
	]

	if (process.env.CI && CIs.some((CI) => !!process.env[CI])) {
		fourBitColor = true
		return supportedColors()
	}

	if (process.env.COLORTERM) {
		fourBitColor = true
		return supportedColors()
	}

	const winVersion = getWindowsVersion()
	if (winVersion.length) {
		fourBitColor = true
		// https://devblogs.microsoft.com/commandline/24-bit-color-in-the-windows-console/
		highColor = winVersion[2] > 14931
		trueColor = winVersion[2] > 14931
		return supportedColors()
	}

	execSync ||= require('child_process').execSync

	const tputColors = Number(execSync('tput colors')) || 0

	threeBitColor = tputColors >= 4
	fourBitColor = tputColors >= 8
	highColor = tputColors >= 256
	trueColor = tputColors >= 16777216

	return supportedColors()
}
