import { ENV } from "../../../@constants/env";
import type { IHttpService } from "../../interfaces/httpService.interface";
import { Buffer } from "buffer";

interface ITrackingNumberResponse {
  codigoRastreio: string;
}

export class PreListaPostagemService {
  private basicAuthToken: string;
  constructor(private readonly httpService: IHttpService) {
    const credentials = `${ENV.COLETAS_API_USERNAME}:${ENV.COLETAS_API_PASSWORD}`;
    this.basicAuthToken = Buffer.from(credentials).toString("base64");
  }

  async getTrackingNumber(orderId: string) {
    const response = await this.httpService.get<ITrackingNumberResponse>(
      `/endpoint/codigo_rastreio.php?codigoUnico=${orderId}`,
      {
        headers: {
          Authorization: `Basic ${this.basicAuthToken}`,
        },
      }
    );

    console.log(JSON.stringify(response, null, 2));

    return response;
  }

  async getProductQuantity(orderId: string, serialNumber: string) {
    const response = await this.httpService.get<any>(
      `/endpoint/quantidade_produto.php?codigoUnico=${orderId}&numeroDeSerie=${serialNumber}`,
      {
        headers: {
          Authorization: `Basic ${this.basicAuthToken}`,
        },
      }
    );

    console.log(JSON.stringify(response, null, 2));

    return response;
  }
}
