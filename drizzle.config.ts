import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/@constants/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/@external/orm/drizzle/schemas/index.ts",
  dialect: "mysql",
  dbCredentials: {
    url: ENV.DB_URL!,
  },
});
