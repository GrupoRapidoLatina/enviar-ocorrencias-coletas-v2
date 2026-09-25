export interface IPreListaPostagemRepository {
  getTrackingNumber(orderId: string): Promise<{ codigoRastreio: string | null } | undefined>;
  findDeclinedOrders(): Promise<any[]>;
  updateDeclinedStatus(id: number, newStatus: number): Promise<void>;
}
