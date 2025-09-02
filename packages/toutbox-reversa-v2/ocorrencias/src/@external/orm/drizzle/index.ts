import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";
import { ENV } from "../../../@constants/env";
import * as schema from "./schemas";

export const connection = await createConnection(ENV.DB_URL);

export const db = drizzle({
  client: connection,
  schema,
  mode: "default",
});
