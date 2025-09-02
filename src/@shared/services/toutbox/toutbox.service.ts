import { ENV } from "../../../@constants/env";
import type { IHttpService } from "../../interfaces/httpService.interface";
import type { ScheduleOrderCommand } from "./command/scheduleOrder.command";
import type { SendCollectedEquipmentsCommand } from "./command/sendCollectedEquipments.command";
import type { SendEquipmentsCommand } from "./command/sendEquipments.command";
import type { SendOccurrenceCommand } from "./command/sendOccurrence.command";
import type { IScheduleResponse } from "./interfaces/scheduleResponse.interface";
import type { ISendEquipmentResponse } from "./interfaces/sendEquipmentResponse.interface";
import type { ISendOccurrenceResponse } from "./interfaces/sendOccurrenceResponse.interface";
import { generateUid } from "../../../@shared/utils/generators/uid";

export class ToutboxService {
	private API_KEYS = {
		"VIVO B2C": ENV.TOUTBOX_B2C_API_KEY,
		"VIVO B2B": ENV.TOUTBOX_B2B_API_KEY,
	};
	private apiKey: string;
	constructor(private readonly httpService: IHttpService) {}

	public setApiKey(operation: string) {
		this.apiKey = this.API_KEYS[operation];
	}

	private validateApiKey() {
		if (!this.apiKey) {
			throw new Error("You should define an API key, use `setApiKey` method");
		}
	}

	async sendOccurrence({
		setFile: _setFile,
		dataForLog,
		...occurrence
	}: SendOccurrenceCommand) {
		this.validateApiKey();
		const response = await this.httpService.post<
			Omit<SendOccurrenceCommand, "setFile" | "dataForLog">,
			ISendOccurrenceResponse
		>(
			`/Parcel/Event?order_id=${occurrence.eventsData[0].orderId}`,
			occurrence,
			{
				headers: {
					Authorization: `${this.apiKey}`,
				},
			},
		);

		return response;
	}

	async scheduleOrder(command: ScheduleOrderCommand, orderId: string) {
		this.validateApiKey();
		const response = await this.httpService.post<
			Omit<ScheduleOrderCommand, "dataForLog">,
			IScheduleResponse
		>(`/Parcel/Pickup?order_id=${orderId}`, command, {
			headers: {
				Authorization: `${this.apiKey}`,
			},
		});

		return response;
	}

	async sendEquipments(command: SendEquipmentsCommand) {
		this.validateApiKey();
		const response = await this.httpService.put<
			Omit<SendEquipmentsCommand, "dataForLog">,
			ISendEquipmentResponse
		>(
			`/Parcel/Product?courier_id=81&order_id=${command.products[0].trackingNumber}`,
			command,
			{
				headers: {
					Authorization: `${this.apiKey}`,
				},
			},
		);

		return response;
	}

	async sendCollectedEquipments(
		command: SendCollectedEquipmentsCommand,
		orderId: string,
	) {
		this.validateApiKey();
		const response = await this.httpService.put<
			Omit<SendCollectedEquipmentsCommand, "dataForLog">,
			ISendEquipmentResponse
		>(
			`/Parcel/Product/Collected?courier_id=81&order_id=${orderId}`,
			{
				...command,
			},
			{
				headers: {
					Authorization: `${this.apiKey}`,
				},
			},
		);

		return response;
	}
}
