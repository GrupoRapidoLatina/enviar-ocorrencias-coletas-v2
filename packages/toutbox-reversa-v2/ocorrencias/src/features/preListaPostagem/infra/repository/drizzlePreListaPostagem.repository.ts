import { eq } from "drizzle-orm";
import { TDrizzle } from "../../../../@external/orm/drizzle";
import { preListaPostagem } from "../../../../@external/orm/drizzle/schemas/preListaPostagem.schema";
import type { IPreListaPostagemRepository } from "../../domain/contracts/preListaPostagem.repository.interface";

export class DrizzlePreListaPostagemRepository implements IPreListaPostagemRepository {
  constructor(private readonly drizzle: TDrizzle) {}

  async getTrackingNumber(orderId: string) {
    const [result] = await this.drizzle
      .select({
        codigoRastreio: preListaPostagem.entregaRastreio,
      })
      .from(preListaPostagem)
      .where(eq(preListaPostagem.codigoUnico, orderId));

    return result;
  }

  async findDeclinedOrders() {
    return await this.drizzle
      .select()
      .from(preListaPostagem)
      .where(eq(preListaPostagem.aceito, -1))
      .limit(100);
  }

  async updateDeclinedStatus(id: number, newStatus: number) {
    await this.drizzle
      .update(preListaPostagem)
      .set({ aceito: newStatus })
      .where(eq(preListaPostagem.id, id));
  }
}
