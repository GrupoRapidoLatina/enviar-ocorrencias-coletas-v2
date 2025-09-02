import {
	char,
	datetime,
	int,
	mediumtext,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";

export const citiesSchema = mysqlTable("_1_database_1_collection_70", {
	_id: int().primaryKey(),
	_uid: char({ length: 255 }).notNull(),
	_createdAt: datetime(),
	_updatedAt: datetime(),
	_permissions: mediumtext(),
	cidade: varchar({ length: 255 }),
	zona: varchar({ length: 255 }),
	periodo: varchar({ length: 255 }),
	periodo_dias: int(),
});
