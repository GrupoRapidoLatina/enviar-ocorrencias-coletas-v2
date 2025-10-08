interface ICollectedProduct {
	serial_number: string;
	collected: boolean;
}

export class SendCollectedEquipmentsCommand {
	collected_products: ICollectedProduct[];

	constructor(collectedProduct: ICollectedProduct) {
		this.collected_products = [collectedProduct];
	}
}
