import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { LoggerOptions } from "typeorm/logger/LoggerOptions";

const isDev = process.env.NODE_ENV === 'development'
const isDebugSQL = !!process.env.DEBUG_SQL

const logging: LoggerOptions = ["error"]
if (isDebugSQL) {
  logging.push("query")
}
const config: PostgresConnectionOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || "qpa-dev",
  username: process.env.DB_USER || null,
  password: process.env.DB_PASSWORD || null,
  entities: ["**/*.entity.ts", "**/*.entity.js"],
  migrations: ["migrations/*.js", "migrations/*.ts"],
  logging: logging,
  synchronize: !!process.env.TYPEORM_SYNCHRONIZE,
  cli: {
    migrationsDir: "migrations"
  }
};

export = config;
