import type { IEvent } from "../command/sendOccurrence.command";

interface IResponseInfos {
	nfKey: string | null;
	orderId: string;
	trackingNumber: string | null;
	courierId: number;
	uniqueId: string | null;
	messages: string[];
}

interface IEventsPayload {
	trackingNumber: string | null;
	orderId: string;
	nfKey: string | null;
	uniqueId: string | null;
	courierId: number;
	iccids: string | number | null;
	additionalInfo: string | null;
	events: IEvent[];
}

interface ISendOccurrenceResponsePayload {
	eventsPayload: IEventsPayload[];
	successes: IResponseInfos[];
	errors: IResponseInfos[];
}

export interface ISendOccurrenceResponse {
	results: string;
	error: IResponseInfos[] | null;
	payload: ISendOccurrenceResponsePayload;
	tenant: string | null;
	wl: string | null;
}
