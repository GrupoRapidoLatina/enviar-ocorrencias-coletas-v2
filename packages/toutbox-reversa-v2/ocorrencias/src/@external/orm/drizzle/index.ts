import { drizzle } from "drizzle-orm/mysql2";
import { createConnection, Connection } from "mysql2/promise";
import { ENV } from "../../../@constants/env";
import * as schema from "./schemas";

let connection: Connection | null = null;
let dbInstance: any = null;

export async function getDB() {
  if (!connection) {
    connection = await createConnection(ENV.DB_URL);
    dbInstance = drizzle({ client: connection, schema, mode: "default" });
  }
  return dbInstance!;
}

export async function closeDB() {
  if (connection) {
    await connection.end();
    connection = null;
    dbInstance = null;
  }
}
