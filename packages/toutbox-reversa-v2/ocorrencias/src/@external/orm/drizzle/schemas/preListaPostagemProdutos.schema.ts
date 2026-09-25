import {
    mysqlTable,
    int,
    varchar,
    text,
    decimal,
    index,
    foreignKey,
} from "drizzle-orm/mysql-core";
import { preListaPostagem } from "./preListaPostagem.schema";

export const preListaPostagemProdutos = mysqlTable(
    "pre_lista_postagem_produtos",
    {
        id: int("id").autoincrement().notNull().primaryKey(),
        idPreListaPostagem: int("id_pre_lista_postagem").notNull(),
        descricao: text("descricao"),
        altura: decimal("altura", { precision: 10, scale: 2 }).default("0.00"),
        comprimento: decimal("comprimento", { precision: 10, scale: 2 }).default(
            "0.00",
        ),
        largura: decimal("largura", { precision: 10, scale: 2 }).default("0.00"),
        peso: decimal("peso", { precision: 10, scale: 2 }).default("0.00"),
        preco: decimal("preco", { precision: 10, scale: 2 }).default("0.00"),
        quantidade: int("quantidade").default(0),
        sku: varchar("sku", { length: 255 }),
        codigoProduto: varchar("codigoProduto", { length: 255 }),
        numeroDeSerie: varchar("numeroDeSerie", { length: 255 }),
        tipoProduto: varchar("tipoProduto", { length: 255 }),
        fabricante: varchar("fabricante", { length: 255 }),
    },
    (table) => [
        index("id_plp_fk_idx").on(table.idPreListaPostagem),
        index("idx_plp_prod_fk").on(table.idPreListaPostagem),
        foreignKey({
            name: "id_plp_fk",
            columns: [table.idPreListaPostagem],
            foreignColumns: [preListaPostagem.id],
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
    ],
);
