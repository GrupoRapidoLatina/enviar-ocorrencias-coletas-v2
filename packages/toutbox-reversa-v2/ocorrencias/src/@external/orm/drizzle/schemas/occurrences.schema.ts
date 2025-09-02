import {
  bigint,
  char,
  datetime,
  int,
  mediumtext,
  mysqlTable,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

export const occurrencesSchema = mysqlTable("_1_database_1_collection_28", {
  _id: int().primaryKey(),
  _uid: char({ length: 255 }).notNull(),
  _createdAt: datetime(),
  _updatedAt: datetime(),
  _permissions: mediumtext(),
  descricao: varchar({ length: 100 }),
  codigo_telefonica: varchar({ length: 30 }),
  status: bigint({ mode: "number" }),
  permitir_abaixa: tinyint(),
  ativo: tinyint(),
  requerer_foto: tinyint(),
  permite_coletor: tinyint(),
});
