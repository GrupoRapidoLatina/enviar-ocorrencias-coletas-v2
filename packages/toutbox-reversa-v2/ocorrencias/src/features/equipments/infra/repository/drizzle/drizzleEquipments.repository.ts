import { and, eq } from "drizzle-orm";
import { equipmentsSchema } from "../../../../../@external/orm/drizzle/schemas";
import type { IEquipmentsRepository } from "../../../domain/contracts/repository/equipments.repository.interface";
import { Equipment } from "../../../domain/model/equipment";

export class DrizzleEquipmentsRepository implements IEquipmentsRepository {
	constructor(private readonly drizzle: any) {}

	async listProdutiveOrderEquipments(orderId: string) {
		const result = await this.drizzle
			.select()
			.from(equipmentsSchema)
			.where(
				and(
					eq(equipmentsSchema.ordem_servico_id, orderId),
					eq(equipmentsSchema.produtivo, 1),
				),
			)
			.groupBy(equipmentsSchema.numero_serie);

		return result.map((equipment) => new Equipment(equipment));
	}
}
