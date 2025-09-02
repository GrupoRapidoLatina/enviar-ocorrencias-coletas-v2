import type { IEquipmentsRepository } from "../../../features/equipments/domain/contracts/repository/equipments.repository.interface";
import type { Equipment } from "../../../features/equipments/domain/model/equipment";
import type { IEquipmentsService } from "../../interfaces/equipments.service.interface";

export class EquipmentsService implements IEquipmentsService {
	constructor(private readonly repository: IEquipmentsRepository) {}

	async listProdutiveOrderEquipments(orderId: string): Promise<Equipment[]> {
		return this.repository.listProdutiveOrderEquipments(orderId);
	}
}