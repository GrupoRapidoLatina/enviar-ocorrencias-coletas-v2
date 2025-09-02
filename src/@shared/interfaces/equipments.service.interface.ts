import type { Equipment } from "../../features/equipments/domain/model/equipment";

export interface IEquipmentsService {
	listProdutiveOrderEquipments(orderId: string): Promise<Equipment[]>;
}
