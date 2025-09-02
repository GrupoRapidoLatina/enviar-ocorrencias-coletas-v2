import { db } from "../../../../../@external/orm/drizzle";
import { equipmentsLogsSchema } from "../../../../../@external/orm/drizzle/schemas/equipmentsLogs.schema";

export type InsertEquipmentLogCommand = typeof equipmentsLogsSchema.$inferInsert;

export class DrizzleEquipmentsLogsRepository {
	drizzle = db;

	async insertLog(command: InsertEquipmentLogCommand) {
		try {
			const [result] = await this.drizzle.insert(equipmentsLogsSchema).values(command);
			return result.insertId;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
