import { and, desc, eq } from "drizzle-orm";
import { historyLogsSchema } from "../../../../@external/orm/drizzle/schemas/historyLogs.schema";

export type InsertLogCommand = typeof historyLogsSchema.$inferInsert;

export class DrizzleHistoryLogsRepository {
  constructor(private readonly drizzle: any) { }
  async getLogByNumeroBaAndStatus(numeroBa: string, status: number) {
    try {
      const result = await this.drizzle
        .select()
        .from(historyLogsSchema)
        .where(
          and(
            eq(historyLogsSchema.numero_ba, numeroBa),
            eq(historyLogsSchema.status, status),
            eq(historyLogsSchema.ex, 1)
          )
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
