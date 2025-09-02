export class OrderHistory {
	public _id: number;
	public _uid: string | null;
	public _createdAt: Date | null;
	public _updatedAt: Date | null;
	public _permissions: string | null;
	public data_criacao: number | null;
	public descricao: string | null;
	public tipo_ocorrencia_id: string | null;
	public usuario_id: string | null;
	public usuario_nome: string | null;
	public parceiro_id: string | null;
	public parceiro_nome: string | null;
	public ordem_servico_id: string | null;
	public ordem_servico_item_id: string | null;
	public latitude: string | null;
	public longitude: string | null;
	public data_agendamento: number | null;
	public data_agendamento_fim: number | null;
	public familia_equipamento_id: string | null;
	public numero_ba: string | null;
	public codigo_telefonica: string | null;
	public status: number | null;
	public foto_id: string | null;
	public id_sinc: string | null;
	public resinc: number | null;

	constructor(data: OrderHistory) {
		Object.assign(this, data);
	}
}
