import { ENV } from "../../../@constants/env";
import { DrizzlePreListaPostagemRepository } from "../../../features/preListaPostagem/infra/repository/drizzlePreListaPostagem.repository";
import { DrizzlePreListaPostagemProdutosRepository } from "../../../features/preListaPostagem/infra/repository/drizzlePreListaPostagemProdutos.repository";
import { IHttpService } from "../../interfaces/httpService.interface";

interface ITrackingNumberResponse {
  codigoRastreio: string;
}

export class PreListaPostagemService {
  private basicAuthToken: string;

  constructor(
    private readonly plpRepository: DrizzlePreListaPostagemRepository,
    private readonly plppRepository: DrizzlePreListaPostagemProdutosRepository,
    private readonly httpService: IHttpService
  ) {
    const credentials = `${ENV.COLETAS_API_USERNAME}:${ENV.COLETAS_API_PASSWORD}`;
    this.basicAuthToken = Buffer.from(credentials).toString("base64");
  }

  async getTrackingNumber(orderId: string) {
    console.log({ orderId });
    let data = await this.plpRepository.getTrackingNumber(orderId);

    console.log(data);

    if (!data) {
      const response = await this.httpService.get<ITrackingNumberResponse>(
        `/endpoint/codigo_rastreio.php?codigoUnico=${orderId}`,
        {
          headers: {
            Authorization: `Basic ${this.basicAuthToken}`,
          },
        }
      );
      console.log({ response });
      data = response.error ? null : response.data;
    }

    return data;
  }

  async getProductQuantity(orderId: string, serialNumber: string) {
    let data = await this.plppRepository.getProductQuantity(
      orderId,
      serialNumber
    );

    if (!data) {
      const response = await this.httpService.get<any>(
        `/endpoint/quantidade_produto.php?codigoUnico=${orderId}&numeroDeSerie=${serialNumber}`,
        {
          headers: {
            Authorization: `Basic ${this.basicAuthToken}`,
          },
        }
      );

      data = response.error ? null : response.data;
    }

    return data;
  }
}
