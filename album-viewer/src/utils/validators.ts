export function validateDate(input: string): Date | null {
	const trimmedInput = input.trim()

	// French date format: jj/mm/aaaa (accepts '/', '-', or '.')
	const dateRegex = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/
	const matches = trimmedInput.match(dateRegex)

	if (!matches) {
		return null
	}

	const day = Number.parseInt(matches[1], 10)
	const month = Number.parseInt(matches[2], 10)
	const year = Number.parseInt(matches[3], 10)

	if (month < 1 || month > 12) {
		return null
	}

	if (day < 1 || day > 31) {
		return null
	}

	const date = new Date(year, month - 1, day)

	// Validate components to reject overflowed dates (e.g. 31/02/2024)
	if (
		date.getFullYear() !== year ||
		date.getMonth() !== month - 1 ||
		date.getDate() !== day
	) {
		return null
	}

	return date
}

export function validateGuidFormat(input: string): boolean {
	const trimmedInput = input.trim()

	// Accepts canonical GUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

	return guidRegex.test(trimmedInput)
}

export function validateIPV6(input: string): boolean {
	const trimmedInput = input.trim()

	// Accepts full and compressed IPv6 formats, including IPv4-mapped forms.
	const ipv6Regex = /^((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?:(?::[0-9A-Fa-f]{1,4}){1,6})|:(?:(?::[0-9A-Fa-f]{1,4}){1,7}|:)|fe80:(?::[0-9A-Fa-f]{0,4}){0,4}%[0-9A-Za-z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[0-9A-Fa-f]{1,4}:){1,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))$/

	return ipv6Regex.test(trimmedInput)
}
