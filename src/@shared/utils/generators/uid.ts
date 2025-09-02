import { createHash, randomBytes } from "node:crypto";

export function generateUid() {
	const bytes = randomBytes(20);
	const timestamp = process.hrtime.bigint().toString();

	const hash = createHash("sha256")
		.update(bytes)
		.update(timestamp)
		.digest("hex");

	return hash.substring(0, 20).toUpperCase();
}
