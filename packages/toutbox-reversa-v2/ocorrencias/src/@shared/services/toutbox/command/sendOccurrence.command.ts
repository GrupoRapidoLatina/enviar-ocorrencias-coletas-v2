interface IEventsData {
	orderId?: string;
	trackingNumber?: string;
	CourierId: number;
	events: IEvent[];
}

export interface IEvent {
	eventCode: string;
	description: string;
	date: string;
	address: string;
	number: string;
	city: string;
	state: string;
	geo: {
		lat: number | null;
		long: number | null;
	};
	files?: {
		url: string;
		description?: string;
		fileType?: string;
	}[];
}

export interface IDataForLog {
	id_ordem: string;
	id_historico: number;
}

export class SendOccurrenceCommand {
	public eventsData: IEventsData[];
	public dataForLog: IDataForLog;

	constructor(data: Omit<IEventsData, "CourierId">, dataForLog: IDataForLog) {
		this.eventsData = [
			{
				CourierId: 81,
				...data,
			},
		];
		this.dataForLog = dataForLog;
	}

	public setFile(url: string) {
		if (this.eventsData[0].events[0]) {
			this.eventsData[0].events[0].files = [
				{
					url,
					description: "Foto Visita",
					fileType: ".JPG",
				},
			];
		}
	}
}
