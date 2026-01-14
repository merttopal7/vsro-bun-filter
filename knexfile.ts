import { join } from "path";
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    migrations: {
      tableName: "ftemir_migrations",
      directory: join(process.cwd(), "src/utils/Database/migrations"),
    },
  },
};

export default config;
