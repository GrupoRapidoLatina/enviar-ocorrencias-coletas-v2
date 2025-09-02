import { and, eq, gt, gte, inArray, lt, lte, sql } from "drizzle-orm";
import { TOUTBOX_OCCURRENCES_MAPPING } from "../../../../@constants/toutboxOccurrencesMapping";
import { db } from "../../../../@external/orm/drizzle";
import * as schemas from "../../../../@external/orm/drizzle/schemas";
import { generateUid } from "../../../../@shared/utils/generators/uid";
import type {
	IInsertOrderHistoryCommand,
	IOrderHistoryRepository,
} from "../../domain/contracts/orderHistory.repository.interface";
import { LatestOrderHistory } from "../../domain/model/latestOrderHistory";
import { OrderHistory } from "../../domain/model/orderHistory";

export class DrizzleOrderHistoryRepository implements IOrderHistoryRepository {
	private drizzle = db;

	async listLatestOrdersHistories(): Promise<LatestOrderHistory[]> {
		try {
			const result = await this.drizzle
				.select({
					_id: schemas.orderHistorySchema._id,
					_createdAt: schemas.orderHistorySchema._createdAt,
					data_criacao: schemas.orderHistorySchema.data_criacao,
					descricao: schemas.orderHistorySchema.descricao,
					ordem_servico_id: schemas.orderHistorySchema.ordem_servico_id,
					ordem_servico_item_id:
						schemas.orderHistorySchema.ordem_servico_item_id,
					numero_ba: schemas.orderHistorySchema.numero_ba,
					data_agendamento: schemas.orderHistorySchema.data_agendamento,
					codigo_telefonica: schemas.orderHistorySchema.codigo_telefonica,
					ocorrencia: schemas.occurrencesSchema.descricao,
					status: schemas.orderHistorySchema.status,
					nome: schemas.ordersSchema.nome,
					telefone: schemas.ordersSchema.telefone_1,
					email: schemas.ordersSchema.email,
					logradouro: schemas.ordersSchema.logradouro,
					numero: schemas.ordersSchema.numero,
					complemento: schemas.ordersSchema.complemento,
					bairro: schemas.ordersSchema.bairro,
					cidade: schemas.ordersSchema.cidade,
					uf: schemas.ordersSchema.uf,
					cep: schemas.ordersSchema.cep,
					latitude: sql<string>`IF(${schemas.orderHistorySchema.latitude} = "", 0, ${schemas.orderHistorySchema.latitude})`,
					longitude: sql<string>`IF(${schemas.orderHistorySchema.longitude} = "", 0, ${schemas.orderHistorySchema.longitude})`,
					foto_id: schemas.orderHistorySchema.foto_id,
					sigla: schemas.operationsSchema.sigla,
					imagem: sql<string>`
            CASE
              WHEN LENGTH(${schemas.orderHistorySchema.foto_id}) > 0 THEN
                CONCAT('https://rapidocoletas.com.br/v1/storage/buckets/padrao/files/', ${schemas.orderHistorySchema.foto_id}, '/view{qp}project=rapido-coletas') 
              ELSE 
                NULL 
            END
          `.as("imagem"),
					ex: sql<string>`
            COALESCE(${schemas.orderHistorySchema.id_sinc}, 0)
          `.as("ex"),
				})
				.from(schemas.orderHistorySchema)
				.innerJoin(
					schemas.ordersSchema,
					eq(
						schemas.ordersSchema._uid,
						schemas.orderHistorySchema.ordem_servico_id,
					),
				)
				.innerJoin(
					schemas.operationsSchema,
					eq(schemas.ordersSchema.operadora_id, schemas.operationsSchema._uid),
				)
				.leftJoin(
					schemas.occurrencesSchema,
					eq(
						schemas.occurrencesSchema.codigo_telefonica,
						schemas.orderHistorySchema.codigo_telefonica,
					),
				)
				.where(
					and(
						gt(
							sql<number>`COALESCE(${schemas.orderHistorySchema.codigo_telefonica}, 0)`,
							0,
						),
						gte(schemas.orderHistorySchema._createdAt, new Date("2024-05-14")),
						lte(
							sql<number>`COALESCE(${schemas.orderHistorySchema.id_sinc}, 0)`,
							0,
						),
						lt(
							sql<number>`COALESCE(${schemas.orderHistorySchema.resinc}, 0)`,
							3,
						),
						inArray(schemas.operationsSchema._uid, [
							"630fd72b864eb4979c74",
							"6893a710319046d1dd25",
						]),
					),
				)
				.groupBy(schemas.orderHistorySchema._id)
				.orderBy(schemas.orderHistorySchema._id)
				.limit(50);

			return result.map(
				(item) =>
					new LatestOrderHistory({
						...item,
						imagem: item.imagem ? item.imagem.replace("{qp}", "?") : null,
					}),
			);
		} catch (error) {
			console.log(error);
			return [];
		}
	}

	async insert(data: IInsertOrderHistoryCommand): Promise<OrderHistory | null> {
		try {
			const result = await this.drizzle
				.insert(schemas.orderHistorySchema)
				.values({
					...data,
					_uid: generateUid(),
				});
			return new OrderHistory({
				...data,
				_id: result[0].insertId,
			});
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async syncLog(_id: number, id_historico: string): Promise<boolean> {
		try {
			const result = await this.drizzle
				.update(schemas.orderHistorySchema)
				.set({
					id_sinc: id_historico,
				})
				.where(eq(schemas.orderHistorySchema._id, _id));

			return result[0].affectedRows > 0;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	async findProdutiveOccurrence(order_id: string) {
		const result = await this.drizzle
			.select()
			.from(schemas.orderHistorySchema)
			.where(
				and(
					eq(schemas.orderHistorySchema.ordem_servico_id, order_id),
					eq(
						schemas.orderHistorySchema.codigo_telefonica,
						`${TOUTBOX_OCCURRENCES_MAPPING.BAIXA_PRODUTIVA}`,
					),
				),
			);

		return result.map((item) => new OrderHistory(item));
	}
}
