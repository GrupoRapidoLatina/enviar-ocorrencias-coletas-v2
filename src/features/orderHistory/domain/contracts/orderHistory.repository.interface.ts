import type { LatestOrderHistory } from "../model/latestOrderHistory";
import type { OrderHistory } from "../model/orderHistory";

export type IInsertOrderHistoryCommand = Omit<OrderHistory, "_id">;

export interface IOrderHistoryRepository {
	listLatestOrdersHistories: () => Promise<LatestOrderHistory[]>;
	insert: (data: IInsertOrderHistoryCommand) => Promise<OrderHistory | null>;
	syncLog: (_id: number, id_historico: string) => Promise<boolean>;
	findProdutiveOccurrence: (order_id: string) => Promise<OrderHistory[]>;
}
