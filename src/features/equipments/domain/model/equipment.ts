export class Equipment {
	_id: number;
	_uid: string;
	_createdAt: Date | null;
	_updatedAt: Date | null;
	_permissions: string | null;
	codigo: string | null;
	descricao: string | null;
	numero_serie: string | null;
	latitude: string | null;
	longitude: string | null;
	coletado: number | null;
	produtivo: number | null;
	equipamento_id: string | null;
	ordem_servico_id: string | null;
	perifericos: number | null;

	constructor(props: Equipment) {
		Object.assign(this, props);
	}
}
