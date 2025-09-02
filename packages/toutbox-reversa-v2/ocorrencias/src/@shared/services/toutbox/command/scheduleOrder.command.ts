export const SchedulePeriod = {
	MORNING: "M",
	AFTERNOON: "T",
} as const;

export type TSchedulePeriod =
	(typeof SchedulePeriod)[keyof typeof SchedulePeriod];

export const scheduleTypeMapping = {
	31: "Data da visita",
	46: "Visita",
	4003: "Entrega do pedido no cd",
} as const;

export type ScheduleStatusCode = keyof typeof scheduleTypeMapping;
type ScheduleType =
	(typeof scheduleTypeMapping)[keyof typeof scheduleTypeMapping];

interface Address {
	nome: string;
	telefone: string;
	email: string;
	empresa: string;
	endereco: string;
	numero: string;
	complemento: string;
	bairro: string;
	cidade: string;
	estado: string;
	pais: string;
	cep: string;
	ie: string;
}

interface ScheduleData {
	data: string;
	periodo: TSchedulePeriod;
	tipoAgendamento: ScheduleType;
	enviarAoTransportador: boolean;
	endereco: Address;
}

export class ScheduleOrderCommand implements ScheduleData {
	data: string;
	periodo: TSchedulePeriod;
	tipoAgendamento: ScheduleType;
	enviarAoTransportador: boolean = false;
	endereco: Address;

	constructor(params: Omit<ScheduleData, "enviarAoTransportador">) {
		this.data = params.data;
		this.periodo = params.periodo;
		this.tipoAgendamento = params.tipoAgendamento;
		this.endereco = params.endereco;
	}
}
