import {
	bigint,
	char,
	datetime,
	int,
	mediumtext,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";

export const historyLogsSchema = mysqlTable("_1_database_1_collection_62", {
	_id: int().primaryKey().autoincrement().notNull(),
	_uid: char({ length: 255 }).notNull(),
	_createdAt: datetime(),
	_updatedAt: datetime(),
	_permissions: mediumtext(),
	id_ordem: varchar({ length: 255 }),
	id_usuario: varchar({ length: 255 }),
	numero_ba: varchar({ length: 255 }),
	data: datetime(),
	payload: varchar({ length: 5000 }),
	response: varchar({ length: 5000 }),
	ex: int(),
	endpoint: varchar({ length: 500 }),
	status: int(),
	tentativas: bigint({ mode: "number" }),
	id_historico: varchar({ length: 255 }),
});
