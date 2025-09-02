import type {
	DrizzleEquipmentsLogsRepository,
	InsertEquipmentLogCommand,
} from "../../../features/equipmentsLogs/infra/repository/drizzle/drizzleEquipmentsLogs.repository";

export class EquipmentsLogsService {
	constructor(private repository: DrizzleEquipmentsLogsRepository) {}

	async insertLog(command: InsertEquipmentLogCommand) {
		const result = await this.repository.insertLog(command);
		return result;
	}
}
