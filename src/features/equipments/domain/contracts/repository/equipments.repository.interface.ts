import type { Equipment } from "../../model/equipment";

export interface IEquipmentsRepository {
	listProdutiveOrderEquipments(orderId: string): Promise<Equipment[]>;
}
