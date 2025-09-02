import { TOUTBOX_OCCURRENCES_MAPPING } from "../../../../@constants/toutboxOccurrencesMapping";
import type { IEquipmentsService } from "../../../../@shared/interfaces/equipments.service.interface";
import type { EquipmentsLogsService } from "../../../../@shared/services/equipmentsLogs/equipmentsLogs.service";
import type { HistoryLogsService } from "../../../../@shared/services/historyLogs/historyLogs.service";
import {
	ScheduleOrderCommand,
	SchedulePeriod,
	scheduleTypeMapping,
	type TSchedulePeriod,
} from "../../../../@shared/services/toutbox/command/scheduleOrder.command";
import { SendCollectedEquipmentsCommand } from "../../../../@shared/services/toutbox/command/sendCollectedEquipments.command";
import { SendEquipmentsCommand } from "../../../../@shared/services/toutbox/command/sendEquipments.command";
import { SendOccurrenceCommand } from "../../../../@shared/services/toutbox/command/sendOccurrence.command";
import type { ToutboxService } from "../../../../@shared/services/toutbox/toutbox.service";
import { formatMsToDateTime } from "../../../../@shared/utils/formatters/date";
import { generateUid } from "../../../../@shared/utils/generators/uid";
import type { InsertEquipmentLogCommand } from "../../../equipmentsLogs/infra/repository/drizzle/drizzleEquipmentsLogs.repository";
import type { InsertLogCommand } from "../../../historyLogs/infra/repositories/drizzleHistoryLogs.repository";
import type { IOrderHistoryRepository } from "../contracts/orderHistory.repository.interface";
import type { LatestOrderHistory } from "../model/latestOrderHistory";
import type { DeliveryDateCalculatorService } from "../services/deliveryDateCalculator.service";

/**
 * Classe responsável por orquestrar o envio de histórico de pedidos.
 * Gerencia o fluxo de processamento de ocorrências e delega operações
 * específicas para serviços especializados.
 */
export class SendOrderHistoryUsecase {
	constructor(
		private readonly orderHistoryRepository: IOrderHistoryRepository,
		private readonly historyLogsService: HistoryLogsService,
		private readonly deliveryDateCalculatorService: DeliveryDateCalculatorService,
		private readonly equipmentsService: IEquipmentsService,
		private readonly toutboxService: ToutboxService,
		private readonly equipmentsLogsService: EquipmentsLogsService,
	) {}

	async execute() {
		const response: any[] = [];
		// fetch latest occurrences
		const occurrences =
			await this.orderHistoryRepository.listLatestOrdersHistories();
		let counter = 0;
		for (const occurrence of occurrences) {
			counter++;
			console.log(`Enviando ocorrência ${counter} de ${occurrences.length}`);
			this.toutboxService.setApiKey(occurrence.sigla ?? "");
			const checkOccurrence =
				await this.checkIfOccurrenceHasBeenSentInPastMinute(occurrence);
			if (checkOccurrence.alreadySent) {
				response.push(`Ocorrência: ${occurrence._id} já enviada`);
				await this.orderHistoryRepository.syncLog(
					occurrence._id ?? 0,
					checkOccurrence.oldOccurrenceId,
				);
				continue;
			}
			const occurrencesReponses: any[] = [];
			const occurenceDateTime = formatMsToDateTime(
				occurrence.data_criacao || 0,
			);

			const convertedOccurrenceCode = Number(`${occurrence.codigo_telefonica}`);
			let forceProdutiveOccurrence: boolean = false;
			if (convertedOccurrenceCode === TOUTBOX_OCCURRENCES_MAPPING.COLETADO) {
				forceProdutiveOccurrence =
					await this.needToForceProdutiveOccurrence(occurrence);
			}

			if (
				convertedOccurrenceCode ===
					TOUTBOX_OCCURRENCES_MAPPING.BAIXA_PRODUTIVA ||
				forceProdutiveOccurrence
			) {
				const equipmentsSended = await this.sendOrderEquipments(occurrence);

				occurrencesReponses.push(equipmentsSended);
			}

			if (this.needSchedule(convertedOccurrenceCode)) {
				const orderScheduled = await this.scheduleOrder(occurrence);

				occurrencesReponses.push(orderScheduled);
			}

			const sendOccurrenceCommand = new SendOccurrenceCommand(
				{
					orderId: occurrence.numero_ba ?? "",
					events: [
						{
							eventCode: `${occurrence.codigo_telefonica}`,
							description: `${occurrence.ocorrencia}`,
							date: occurenceDateTime,
							address: `${occurrence.logradouro}, ${occurrence.bairro}`,
							number: `${occurrence.numero}`,
							city: `${occurrence.cidade}`,
							state: `${occurrence.uf}`,
							geo: {
								lat: occurrence.latitude
									? parseFloat(`${occurrence.latitude}`)
									: 0,
								long: occurrence.latitude
									? parseFloat(`${occurrence.longitude}`)
									: 0,
							},
						},
					],
				},
				{
					id_historico: occurrence._id ?? 0,
					id_ordem: `${occurrence.ordem_servico_id}`,
				},
			);

			if (occurrence.imagem) {
				sendOccurrenceCommand.setFile(occurrence.imagem);
			}

			const result = await this.sendOccurrence(
				sendOccurrenceCommand,
				occurrence._id ?? 0,
			);

			occurrencesReponses.push(result);

			response.push(occurrencesReponses);
		}

		return response;
	}

	private async checkIfOccurrenceHasBeenSentInPastMinute({
		numero_ba,
		codigo_telefonica,
		data_criacao,
	}: LatestOrderHistory) {
		const alreadySent = await this.historyLogsService.getLogByNumeroBaAndStatus(
			numero_ba ?? "",
			codigo_telefonica ?? "",
		);

		let oldDate = new Date("2025-01-01");
		let oldOccurrenceId = "0";
		if (alreadySent) {
			oldDate = new Date(alreadySent.data ?? "2025-01-01");
			oldOccurrenceId = alreadySent.id_historico ?? "0";
		}

		const ONE_MINUTE_IN_MILISECONDS = 60 * 1000;

		const difference = data_criacao
			? oldDate.getTime() - data_criacao >= ONE_MINUTE_IN_MILISECONDS
			: false;
		return { alreadySent: difference, oldOccurrenceId };
	}

	private needSchedule(status: number) {
		return status in scheduleTypeMapping;
	}

	private async scheduleOrder(occurrence: LatestOrderHistory) {
		const CODIGO_TELEFONICA = Number(occurrence.codigo_telefonica ?? "0");
		if (CODIGO_TELEFONICA) {
			const dateTimeMsNow = Date.now();
			const scheduleDate =
				occurrence.data_agendamento && occurrence.data_agendamento > 0
					? occurrence.data_agendamento
					: dateTimeMsNow;
			let formattedScheduleDate = formatMsToDateTime(scheduleDate);
			let period: TSchedulePeriod = SchedulePeriod.MORNING;

			if (CODIGO_TELEFONICA === TOUTBOX_OCCURRENCES_MAPPING.BAIXA_PRODUTIVA) {
				const { deliveryDate, period: deliveryPeriod } =
					await this.deliveryDateCalculatorService.calculate(
						occurrence.cidade ?? "",
					);

				formattedScheduleDate = deliveryDate;
				period = deliveryPeriod;
			}

			const command = new ScheduleOrderCommand({
				data: formattedScheduleDate,
				periodo: period,
				tipoAgendamento: scheduleTypeMapping[CODIGO_TELEFONICA],
				endereco: {
					bairro: `${occurrence.bairro}`,
					cep: `${occurrence.cep}`,
					cidade: `${occurrence.cidade}`,
					complemento: `${occurrence.complemento}`,
					email: `${occurrence.email}`,
					empresa: "PARCEIRO",
					endereco: `${occurrence.logradouro}`,
					estado: `${occurrence.uf}`,
					ie: "",
					nome: `${occurrence.nome}`,
					numero: `${occurrence.numero}`,
					pais: "BR",
					telefone: `${occurrence.telefone}`,
				},
			});

			const result = await this.toutboxService.scheduleOrder(
				command,
				occurrence.numero_ba ?? "",
			);
			await this.insertOccurrenceLog({
				_uid: generateUid(),
				_createdAt: new Date(),
				_updatedAt: new Date(),
				_permissions: "[]",
				data: new Date(),
				ex: result.error ? 0 : 1,
				endpoint: `/Parcel/Pickup?order_id=${occurrence.numero_ba}`,
				id_ordem: "",
				numero_ba: occurrence.numero_ba,
				id_usuario: "1",
				id_historico: String(occurrence._id),
				payload: JSON.stringify(command),
				response: JSON.stringify(result.data),
				status: 100,
				tentativas: 0,
			});

			if (
				occurrence.codigo_telefonica &&
				occurrence.codigo_telefonica in
					[
						TOUTBOX_OCCURRENCES_MAPPING.BAIXA_PRODUTIVA,
						TOUTBOX_OCCURRENCES_MAPPING.COLETADO,
					]
			) {
				await this.forceScheduleOccurrence(occurrence);
			}

			return result;
		}
	}

	private async forceScheduleOccurrence(occurrence: LatestOrderHistory) {
		const sendOccurrenceCommand = new SendOccurrenceCommand(
			{
				orderId: occurrence.numero_ba ?? "",
				events: [
					{
						eventCode: `${TOUTBOX_OCCURRENCES_MAPPING.AGENDAMENTO_REALIZADO}`,
						description: "Agendamento realizado",
						date: formatMsToDateTime(Date.now()),
						address: `${occurrence.logradouro}, ${occurrence.bairro}`,
						number: `${occurrence.numero}`,
						city: `${occurrence.cidade}`,
						state: `${occurrence.uf}`,
						geo: {
							lat: 0,
							long: 0,
						},
					},
				],
			},
			{
				id_historico: occurrence._id ?? 0,
				id_ordem: `${occurrence.ordem_servico_id}`,
			},
		);

		await this.sendOccurrence(
			sendOccurrenceCommand,
			occurrence._id ?? 0,
			false,
		);
	}

	private async sendOrderEquipments(occurrence: LatestOrderHistory) {
		const equipments =
			await this.equipmentsService.listProdutiveOrderEquipments(
				occurrence.ordem_servico_id ?? "",
			);
		const equipmentsResponse: any[] = [];
		for (const equipment of equipments) {
			const collectedCommand = new SendCollectedEquipmentsCommand({
				collected: true,
				product_code: `${equipment.codigo}`,
				serial_number: `${equipment.numero_serie}`,
			});

			const result = await this.toutboxService.sendCollectedEquipments(
				collectedCommand,
				occurrence.numero_ba ?? "",
			);
			equipmentsResponse.push(result);
			await this.insertEquipmentLog({
				_uid: generateUid(),
				_createdAt: new Date(),
				_updatedAt: new Date(),
				_permissions: "[]",
				ex: result.error ? 0 : 1,
				item_id: equipment._uid,
				ordem_id: occurrence.ordem_servico_id ?? "",
				payload: JSON.stringify(collectedCommand),
				response: JSON.stringify(result.data),
			});

			if (result.data?.error) {
				const productNotFoundInToutbox = this.productNotFoundInToutbox(
					result.data.error[0].messages,
				);
				if (productNotFoundInToutbox) {
					const sendEquipmentCommand = new SendEquipmentsCommand({
						collected: true,
						description: `${equipment.descricao}`,
						productCode: `${equipment.codigo}`,
						serialNumber: `${equipment.numero_serie}`,
						trackingNumber: `${occurrence.numero_ba}`,
					});

					const result =
						await this.toutboxService.sendEquipments(sendEquipmentCommand);
					await this.insertEquipmentLog({
						_uid: generateUid(),
						_createdAt: new Date(),
						_updatedAt: new Date(),
						_permissions: "[]",
						ex: result.error ? 0 : 1,
						item_id: equipment._uid,
						ordem_id: occurrence.ordem_servico_id ?? "",
						payload: JSON.stringify(sendEquipmentCommand),
						response: JSON.stringify(result.data),
					});
					equipmentsResponse.push(result);
				}
			}
		}

		return equipmentsResponse;
	}

	private productNotFoundInToutbox(errors: string[]) {
		return errors.some(
			(error) =>
				error.includes("não possui produtos") ||
				error.includes("Objeto não encontrado"),
		);
	}

	private async needToForceProdutiveOccurrence(
		occurrence: LatestOrderHistory,
	): Promise<boolean> {
		const alreadySent =
			await this.orderHistoryRepository.findProdutiveOccurrence(
				occurrence.ordem_servico_id ?? "",
			);

		if (!alreadySent) {
			const ID_PRODUTIVE_OCCURRENCE = "6397332033b236ced7a3";
			const STATUS_PRODUTIVE_OCCURRENCE = 5;
			const HISTORY_DESCRIPTION =
				"Baixa produtiva lançada automaticamente ao entregar ordem";
			await this.orderHistoryRepository.insert({
				_createdAt: new Date(),
				_permissions: "",
				data_criacao: Date.now(),
				codigo_telefonica: `${TOUTBOX_OCCURRENCES_MAPPING.BAIXA_PRODUTIVA}`,
				_uid: "",
				_updatedAt: new Date(),
				data_agendamento: null,
				data_agendamento_fim: null,
				descricao: HISTORY_DESCRIPTION,
				familia_equipamento_id: null,
				foto_id: "",
				id_sinc: "",
				latitude: null,
				longitude: null,
				numero_ba: occurrence.numero_ba,
				ordem_servico_id: occurrence.ordem_servico_id,
				ordem_servico_item_id: occurrence.ordem_servico_item_id,
				parceiro_id: null,
				parceiro_nome: "TOUTBOX",
				resinc: 0,
				status: STATUS_PRODUTIVE_OCCURRENCE,
				tipo_ocorrencia_id: ID_PRODUTIVE_OCCURRENCE,
				usuario_id: null,
				usuario_nome: "TOUTBOX",
			});
			const sendOccurrenceCommand = new SendOccurrenceCommand(
				{
					orderId: occurrence.numero_ba ?? "",
					events: [
						{
							eventCode: `${occurrence.codigo_telefonica}`,
							description: `${occurrence.ocorrencia}`,
							date: formatMsToDateTime(Date.now()),
							address: `${occurrence.logradouro}, ${occurrence.bairro}`,
							number: `${occurrence.numero}`,
							city: `${occurrence.cidade}`,
							state: `${occurrence.uf}`,
							geo: {
								lat: parseFloat(`${occurrence.latitude}`) ?? 0,
								long: parseFloat(`${occurrence.longitude}`) ?? 0,
							},
						},
					],
				},
				{
					id_historico: occurrence._id ?? 0,
					id_ordem: `${occurrence.ordem_servico_id}`,
				},
			);

			await this.sendOccurrence(sendOccurrenceCommand, occurrence._id ?? 0);
		}
		return Boolean(alreadySent);
	}

	private async sendOccurrence(
		command: SendOccurrenceCommand,
		occurrenceId: number,
		syncLog: boolean = true,
	) {
		const { dataForLog, ...occurrence } = command;
		const response = await this.toutboxService.sendOccurrence(command);
		const idLog = await this.insertOccurrenceLog({
			_uid: generateUid(),
			_createdAt: new Date(),
			_updatedAt: new Date(),
			_permissions: "[]",
			data: new Date(),
			ex: response.error ? 0 : 1,
			endpoint: `/Parcel/Event?order_id=${occurrence.eventsData[0].orderId}`,
			id_ordem: dataForLog.id_ordem,
			numero_ba: occurrence.eventsData[0].orderId,
			id_usuario: "1",
			id_historico: String(dataForLog.id_historico),
			payload: JSON.stringify(occurrence),
			response: JSON.stringify(response.data),
			status: Number(occurrence.eventsData[0].events[0].eventCode),
			tentativas: 0,
		});
		if (idLog && (!response.error || !response.data.error) && syncLog) {
			await this.orderHistoryRepository.syncLog(occurrenceId, String(idLog));
		}
		return response;
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

	private async insertEquipmentLog(command: InsertEquipmentLogCommand) {
		try {
			await this.equipmentsLogsService.insertLog(command);
		} catch (error) {
			console.log(error);
			return;
		}
	}
}
