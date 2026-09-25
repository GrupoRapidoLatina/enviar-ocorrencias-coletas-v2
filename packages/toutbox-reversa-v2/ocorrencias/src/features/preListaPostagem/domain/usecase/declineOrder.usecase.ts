import { TOUTBOX_OCCURRENCES_MAPPING } from "../../../../@constants/toutboxOccurrencesMapping";
import type { HistoryLogsService } from "../../../../@shared/services/historyLogs/historyLogs.service";
import { SendOccurrenceCommand } from "../../../../@shared/services/toutbox/command/sendOccurrence.command";
import type { IToutboxService } from "../../../../@shared/services/toutbox/interfaces/toutbox.service.interface";
import { formatMsToDateTime } from "../../../../@shared/utils/formatters/date";
import { generateUid } from "../../../../@shared/utils/generators/uid";
import type { IPreListaPostagemRepository } from "../contracts/preListaPostagem.repository.interface";
import { PreListaPostagemService } from "../../../../@shared/services/preListaPostagem/preListaPostagem.service";
import type { InsertLogCommand } from "../../../historyLogs/infra/repositories/drizzleHistoryLogs.repository";

interface IToutboxServiceStrategy {
  "VIVO B2B": IToutboxService;
  "VIVO B2C": IToutboxService;
}

export class DeclineOrderUsecase {
  private toutboxService: IToutboxService | null = null;
  private operation: "VIVO B2B" | "VIVO B2C" = "VIVO B2B";

  constructor(
    private readonly preListaPostagemRepository: IPreListaPostagemRepository,
    private readonly historyLogsService: HistoryLogsService,
    private readonly toutboxServiceStrategy: IToutboxServiceStrategy,
    private readonly preListaPostagemService: PreListaPostagemService,
  ) {}

  async execute() {
    const response: any[] = [];
    
    // RF-01: Buscar pedidos recusados
    const declinedOrders = await this.preListaPostagemRepository.findDeclinedOrders();
    let counter = 0;

    for (const order of declinedOrders) {
      counter++;
      console.log(`Enviando decline ${counter} de ${declinedOrders.length}`);

      // RF-02: Determinar operação (B2B / B2C)
      const identifier = order.numeroPedido || order.codigoUnico;
      const regex = new RegExp("^[A-Za-z]");
      this.operation = identifier?.match(regex) ? "VIVO B2B" : "VIVO B2C";
      this.setToutboxService(this.operation);

      if (!this.toutboxService) {
        response.push(`Não foi possível definir a operação da ocorrência: ${order.id}`);
        continue;
      }

      const orderIdentifier = order.codigoUnico || order.numeroPedido || "";
      const occurenceDateTime = formatMsToDateTime(Date.now());

      // RF-03: Montar SendOccurrenceCommand
      const sendOccurrenceCommand = new SendOccurrenceCommand(
        {
          orderId: orderIdentifier,
          events: [
            {
              eventCode: `${TOUTBOX_OCCURRENCES_MAPPING.BAIXA_PEDIDO_TRANSPORTADORA}`,
              description: "Baixa a pedido da transportadora",
              date: occurenceDateTime,
              address: `${order.entregaLogradouro || ""}, ${order.entregaBairro || ""}`,
              number: `${order.entregaNumero || ""}`,
              city: `${order.entregaCidade || ""}`,
              state: `${order.entregaUf || ""}`,
              geo: {
                lat: parseFloat(`${order.entregaLat || 0}`) || 0,
                long: parseFloat(`${order.entregaLon || 0}`) || 0,
              },
            },
          ],
        },
        {
          id_historico: order.id,
          id_ordem: orderIdentifier,
        },
      );

      // Tratamento para B2B tracking number, similar ao padrão existente
      if (this.operation === "VIVO B2B") {
        const trackingNumber = await this.preListaPostagemService.getTrackingNumber(orderIdentifier);

        if (!trackingNumber) {
          await this.insertOccurrenceLog({
            _uid: generateUid(),
            _createdAt: new Date(),
            _updatedAt: new Date(),
            _permissions: "[]",
            data: new Date(),
            ex: 0,
            endpoint: `interno`,
            id_ordem: orderIdentifier,
            numero_ba: orderIdentifier,
            id_usuario: "1",
            id_historico: String(order.id),
            payload: JSON.stringify(sendOccurrenceCommand),
            response: `Código rastreio não encontrado para o pedido ${orderIdentifier}`,
            status: TOUTBOX_OCCURRENCES_MAPPING.BAIXA_PEDIDO_TRANSPORTADORA,
            tentativas: 1,
          });
          response.push(`Erro (Tracking Not Found): ${orderIdentifier}`);
          continue;
        }

        sendOccurrenceCommand.eventsData = sendOccurrenceCommand.eventsData.map((event) => {
          const { orderId, ...rest } = event;
          return {
            ...rest,
            trackingNumber: trackingNumber.codigoRastreio || "",
          };
        });
      }

      const result = await this.toutboxService.sendOccurrence(sendOccurrenceCommand);
      const isError = !result || result.error || result.data?.error;

      // RF-04: Registrar log de envio
      await this.insertOccurrenceLog({
        _uid: generateUid(),
        _createdAt: new Date(),
        _updatedAt: new Date(),
        _permissions: "[]",
        data: new Date(),
        ex: isError ? 0 : 1,
        endpoint: `/Parcel/Event`,
        id_ordem: orderIdentifier,
        numero_ba: orderIdentifier,
        id_usuario: "1",
        id_historico: String(order.id),
        payload: JSON.stringify(sendOccurrenceCommand),
        response: JSON.stringify(result?.data),
        status: TOUTBOX_OCCURRENCES_MAPPING.BAIXA_PEDIDO_TRANSPORTADORA,
        tentativas: 1,
      });

      // Se sucesso, atualiza o status para não reenviar nas próximas execuções (idempotência)
      if (!isError) {
        await this.preListaPostagemRepository.updateDeclinedStatus(order.id, -2);
      }

      response.push(result);
    }

    return response;
  }

  private setToutboxService(service: "VIVO B2C" | "VIVO B2B") {
    this.toutboxService = this.toutboxServiceStrategy[service];
  }

  private async insertOccurrenceLog(command: InsertLogCommand) {
    try {
      const result = await this.historyLogsService.insertLog(command);
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
