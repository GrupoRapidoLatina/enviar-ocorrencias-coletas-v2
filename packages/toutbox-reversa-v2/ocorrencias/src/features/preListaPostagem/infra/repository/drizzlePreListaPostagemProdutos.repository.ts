import { and, eq } from "drizzle-orm";
import { TDrizzle } from "../../../../@external/orm/drizzle";
import { preListaPostagem } from "../../../../@external/orm/drizzle/schemas/preListaPostagem.schema";
import { preListaPostagemProdutos } from "../../../../@external/orm/drizzle/schemas/preListaPostagemProdutos.schema";

export class DrizzlePreListaPostagemProdutosRepository {
	constructor(private readonly drizzle: TDrizzle) { }


	async getProductQuantity(orderId: string, serialNumber: string) {
		const [result] = await this.drizzle.select({
			quantidade: preListaPostagemProdutos.quantidade,
			descricao: preListaPostagemProdutos.descricao,
			codigoProduto: preListaPostagemProdutos.codigoProduto,
			numeroDeSerie: preListaPostagemProdutos.numeroDeSerie,
			tipoProduto: preListaPostagemProdutos.tipoProduto,
			fabricante: preListaPostagemProdutos.fabricante,
		}).from(
			preListaPostagemProdutos
		).innerJoin(
			preListaPostagem,
			eq(preListaPostagemProdutos.idPreListaPostagem, preListaPostagem.id)
		)
			.where(
				and(
					eq(preListaPostagem.codigoUnico, orderId),
					eq(preListaPostagemProdutos.numeroDeSerie, serialNumber),
				)
			)

		return result;
	}
}