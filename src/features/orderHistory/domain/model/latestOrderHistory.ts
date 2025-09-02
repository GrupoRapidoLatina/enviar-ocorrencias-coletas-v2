export class LatestOrderHistory {
  _id: number | null;
  _createdAt: Date | null;
  data_criacao: number | null;
  descricao: string | null;
  ordem_servico_id: string | null;
  ordem_servico_item_id: string | null;
  numero_ba: string | null;
  data_agendamento: number | null;
  codigo_telefonica: string | null;
  ocorrencia: string | null;
  status: number | null;
  logradouro: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  latitude: string | null;
  longitude: string | null;
  foto_id: string | null;
  sigla: string | null;
  imagem: string | null;
  nome: string | null;
  telefone: string | null;
  email: string | null;
  complemento: string | null;
  cep: string | null;
  ex: string | null;

  constructor(data: LatestOrderHistory) {
    Object.assign(this, data);
  }
}
