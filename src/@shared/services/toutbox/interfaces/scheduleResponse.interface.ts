interface IScheduleResponsePayload {
  order_id: string | null;
  data: string;
  periodo: string;
  origem: string | null;
  tipoAgendamento: string;
  enviarAoTransportador: boolean;
  endereco: {
    nome: string;
    cpfcnpj: string | null;
    telefone: string;
    telefoneFixo: string | null;
    telefoneAdicional: string | null;
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
    lat: string | null;
    long: string | null;
    referencia: string | null;
  };
}

interface IScheduleErrorResponse {
  message: string;
}

export interface IScheduleResponse {
  results: string;
  error: IScheduleErrorResponse | null;
  payload: IScheduleResponsePayload | null;
  tenant: string | null;
  wl: string | null;
}
