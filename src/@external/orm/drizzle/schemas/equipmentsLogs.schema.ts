import {
	char,
	datetime,
	int,
	mediumtext,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";

export const equipmentsLogsSchema = mysqlTable("_1_database_1_collection_69", {
	_id: int().primaryKey().autoincrement().notNull(),
	_uid: char({ length: 255 }).notNull(),
	_createdAt: datetime(),
	_updatedAt: datetime(),
	_permissions: mediumtext(),
	ordem_id: varchar({ length: 255 }),
	item_id: varchar({ length: 255 }),
	payload: varchar({ length: 5000 }),
	response: varchar({ length: 5000 }),
	ex: int(),
});
