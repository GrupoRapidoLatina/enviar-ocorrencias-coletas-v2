export function formatMsToDateTime(ms: number) {
	const date = new Date(ms);

	const formatted = Intl.DateTimeFormat("sv-SE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		timeZone: "America/Sao_Paulo",
	}).format(date);

	const replaced = formatted.replace(" ", "T");

	return `${replaced}-03:00`;
}
