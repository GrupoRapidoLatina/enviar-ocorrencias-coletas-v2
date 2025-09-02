import {
	bigint,
	datetime,
	int,
	mysqlTable,
	text,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const equipmentsSchema = mysqlTable("_1_database_1_collection_46", {
	_id: int().primaryKey().autoincrement().notNull(),
	_uid: varchar({ length: 255 }).notNull().unique(),
	_createdAt: datetime({ mode: "date", fsp: 3 }),
	_updatedAt: datetime({ mode: "date", fsp: 3 }),
	_permissions: text(),
	codigo: varchar({ length: 50 }),
	descricao: varchar({ length: 100 }),
	numero_serie: varchar({ length: 50 }),
	latitude: varchar({ length: 50 }),
	longitude: varchar({ length: 50 }),
	coletado: bigint({ mode: "number" }),
	produtivo: tinyint(),
	equipamento_id: varchar({ length: 50 }),
	ordem_servico_id: varchar({ length: 50 }),
	perifericos: bigint({ mode: "number" }),
});
