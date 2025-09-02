import type { DrizzleHistoryLogsRepository } from "../../../features/historyLogs/infra/repositories/drizzleHistoryLogs.repository";

export class HistoryLogsService {
	constructor(private repository: DrizzleHistoryLogsRepository) {}

	async getLogByNumeroBaAndStatus(numeroBa: string, status: string) {
		const result = await this.repository.getLogByNumeroBaAndStatus(
			numeroBa,
			Number(status),
		);
		return result;
	}

	async insertLog(command) {
		const result = await this.repository.insertLog(command);
		return result;
	}
}
