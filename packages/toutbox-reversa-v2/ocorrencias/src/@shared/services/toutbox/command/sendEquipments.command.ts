interface IProduct {
	trackingNumber: string;
	description: string;
	productCode: string;
	serialNumber: string;
	collected: boolean;
	quantity: number;
}

export class SendEquipmentsCommand {
	products: IProduct[];

	constructor(product: IProduct) {
		this.products = [product];
	}
}
