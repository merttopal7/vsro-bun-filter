import type { Knex } from "knex";
import path from "path";

const baseConnection: Knex.MsSqlConnectionConfig = {
  user: "sa",
  password: "password",
  server: "127.0.0.1",
  port: 1433,
  database: "SRO_VT_SHARD",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};


export const config = {
  development: {
    client: "mssql",
    connection: baseConnection,
    pool: {
      min: 0,
      max: 10
    }
  }
};


export const configWithMigration = {
  development: {
    client: "mssql",
    connection: baseConnection,
    pool: {
      min: 0,
      max: 10
    },
    migrations: {
      tableName: "ftemir_migrations",
      directory: path.join(process.cwd(), "src/utils/Database/migrations"),
    }
  }
};



