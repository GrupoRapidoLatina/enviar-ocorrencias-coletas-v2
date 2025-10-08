import type { ISendOccurrenceResponse } from "./sendOccurrenceResponse.interface";
import type { SendOccurrenceCommand } from "../command/sendOccurrence.command";
import type { IScheduleResponse } from "./scheduleResponse.interface";
import type { ScheduleOrderCommand } from "../command/scheduleOrder.command";
import type { ISendEquipmentResponse } from "./sendEquipmentResponse.interface";
import type { SendEquipmentsCommand } from "../command/sendEquipments.command";
import type { SendCollectedEquipmentsCommand } from "../command/sendCollectedEquipments.command";
import type { IResponse } from "../../../interfaces/httpService.interface";

export interface IToutboxService {
  sendOccurrence(command: SendOccurrenceCommand): Promise<IResponse<ISendOccurrenceResponse>>;
  scheduleOrder(command: ScheduleOrderCommand, orderId: string): Promise<IResponse<IScheduleResponse>>;
  sendEquipments(command: SendEquipmentsCommand): Promise<IResponse<ISendEquipmentResponse>>;
  sendCollectedEquipments(command: SendCollectedEquipmentsCommand, orderId: string): Promise<IResponse<ISendEquipmentResponse>>;
}
