export class Order {
  _id: number;
  _uid: string;
  _createdAt: Date | null;
  _updatedAt: Date | null;
  _permissions: string | null;
  numero_ba: string | null;
  nome: string | null;
  cpf_cnpj: string | null;
  telefone_1: string | null;
  telefone_2: string | null;
  telefone_3: string | null;
  telefone_4: string | null;
  telefone_5: string | null;
  email: string | null;
  observacao: string | null;
  tipo_ocorrencia_id: string | null;
  cep: string | null;
  cidade: string | null;
  uf: string | null;
  bairro: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  contato: string | null;
  instancia: string | null;
  data_agendamento: number | null;
  data_agendamento_fim: number | null;
  criacao: number | null;
  periodo_agendamento: string | null;
  codigo_rastreio: string | null;
  origem_agendamento: string | null;
  cobranca_cep: string | null;
  cobranca_cidade: string | null;
  cobranca_uf: string | null;
  cobranca_bairro: string | null;
  cobranca_logradouro: string | null;
  cobranca_numero: string | null;
  cobranca_complemento: string | null;
  cobranca_contato: string | null;
  endereco_referencia: string | null;
  parceiro_id: string | null;
  atividade_id: string | null;
  operadora_id: string | null;
  usuario_id: string | null;
  progresso: string | null;
  importacao_id: string | null;
  protocolo_entrega_id: string | null;
  cluster: string | null;
  assinatura: string | null;
  quantidade_equipamento: number | null;

  constructor(
    data: Pick<
      Order,
      | "_id"
      | "_uid"
      | "_createdAt"
      | "_updatedAt"
      | "_permissions"
      | "numero_ba"
      | "progresso"
      | "cluster"
      | "quantidade_equipamento"
      | "assinatura"
    >
  ) {
    this._id = data._id;
    this._uid = data._uid;
    this._createdAt = data._createdAt;
    this._updatedAt = data._updatedAt;
    this._permissions = data._permissions;
    this.numero_ba = data.numero_ba;
    this.progresso = data.progresso;
    this.cluster = data.cluster;
    this.quantidade_equipamento = data.quantidade_equipamento;
    this.assinatura = data.assinatura;
  }

  public withPersonalData(
    data: Pick<
      Order,
      | "nome"
      | "cpf_cnpj"
      | "telefone_1"
      | "telefone_2"
      | "telefone_3"
      | "telefone_4"
      | "telefone_5"
      | "email"
    >
  ) {
    this.nome = data.nome;
    this.cpf_cnpj = data.cpf_cnpj;
    this.telefone_1 = data.telefone_1;
    this.telefone_2 = data.telefone_2;
    this.telefone_3 = data.telefone_3;
    this.telefone_4 = data.telefone_4;
    this.telefone_5 = data.telefone_5;
    this.email = data.email;

    return this;
  }

  public withPersonalAddress(
    data: Pick<
      Order,
      | "cep"
      | "cidade"
      | "uf"
      | "bairro"
      | "logradouro"
      | "numero"
      | "complemento"
      | "contato"
      | "instancia"
      | "endereco_referencia"
    >
  ) {
    this.cep = data.cep;
    this.cidade = data.cidade;
    this.uf = data.uf;
    this.bairro = data.bairro;
    this.logradouro = data.logradouro;
    this.numero = data.numero;
    this.complemento = data.complemento;
    this.contato = data.contato;
    this.instancia = data.instancia;
    this.endereco_referencia = data.endereco_referencia;

    return this;
  }

  public withOcurrenceData(
    data: Pick<Order, "observacao" | "tipo_ocorrencia_id">
  ) {
    this.observacao = data.observacao;
    this.tipo_ocorrencia_id = data.tipo_ocorrencia_id;

    return this;
  }

  public withScheduleData(
    data: Pick<
      Order,
      | "data_agendamento"
      | "data_agendamento_fim"
      | "criacao"
      | "periodo_agendamento"
      | "codigo_rastreio"
      | "origem_agendamento"
    >
  ) {
    this.data_agendamento = data.data_agendamento;
    this.data_agendamento_fim = data.data_agendamento_fim;
    this.criacao = data.criacao;
    this.periodo_agendamento = data.periodo_agendamento;
    this.codigo_rastreio = data.codigo_rastreio;
    this.origem_agendamento = data.origem_agendamento;

    return this;
  }

  public withBillingAddress(
    data: Pick<
      Order,
      | "cobranca_cep"
      | "cobranca_cidade"
      | "cobranca_uf"
      | "cobranca_bairro"
      | "cobranca_logradouro"
      | "cobranca_numero"
      | "cobranca_complemento"
      | "cobranca_contato"
    >
  ) {
    this.cobranca_cep = data.cobranca_cep;
    this.cobranca_cidade = data.cobranca_cidade;
    this.cobranca_uf = data.cobranca_uf;
    this.cobranca_bairro = data.cobranca_bairro;
    this.cobranca_logradouro = data.cobranca_logradouro;
    this.cobranca_numero = data.cobranca_numero;
    this.cobranca_complemento = data.cobranca_complemento;
    this.cobranca_contato = data.cobranca_contato;

    return this;
  }

  public withRelationships(
    data: Pick<
      Order,
      | "parceiro_id"
      | "atividade_id"
      | "operadora_id"
      | "usuario_id"
      | "importacao_id"
      | "protocolo_entrega_id"
    >
  ) {
    this.parceiro_id = data.parceiro_id;
    this.atividade_id = data.atividade_id;
    this.operadora_id = data.operadora_id;
    this.usuario_id = data.usuario_id;
    this.importacao_id = data.importacao_id;
    this.protocolo_entrega_id = data.protocolo_entrega_id;

    return this;
  }
}
