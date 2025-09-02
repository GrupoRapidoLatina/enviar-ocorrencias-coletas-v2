interface ISendEquipmentResponsePayload {
  eventPayload: IEventPayload[];
  successes: IResponseInfos[];
  errors: IResponseInfos[];
}

interface IEventPayload {
  description: string;
  value: number;
  sku: string | null;
  productCode: string;
  serialNumber: string;
  manufacturer: string | null;
  note: string | null;
  collected: boolean;
  quantity: number;
}

interface IResponseInfos {
  nfKey: string | null;
  orderId: string;
  trackingNumber: string | null;
  courierId: number;
  uniqueId: string | null;
  messages: string[];
}

export interface ISendEquipmentResponse {
  results: string;
  error: IResponseInfos[] | null;
  payload: ISendEquipmentResponsePayload;
  tenant: string | null;
  wl: string | null;
}