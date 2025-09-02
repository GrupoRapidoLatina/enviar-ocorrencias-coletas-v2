import { and, desc, eq } from "drizzle-orm";
import { db } from "../../../../@external/orm/drizzle";
import { historyLogsSchema } from "../../../../@external/orm/drizzle/schemas/historyLogs.schema";

export type InsertLogCommand = typeof historyLogsSchema.$inferInsert;

export class DrizzleHistoryLogsRepository {
	private drizzle = db;

	async getLogByNumeroBaAndStatus(numeroBa: string, status: number) {
		try {
			const result = await this.drizzle
				.select()
				.from(historyLogsSchema)
				.where(
					and(
						eq(historyLogsSchema.numero_ba, numeroBa),
						eq(historyLogsSchema.status, status),
					),
				)
				.orderBy(desc(historyLogsSchema._id))
				.limit(1);

			return result.length > 0 ? result[0] : null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async insertLog(log: InsertLogCommand) {
		try {
			const [result] = await this.drizzle.insert(historyLogsSchema).values(log);
			return result.insertId;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
