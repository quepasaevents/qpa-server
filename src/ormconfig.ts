import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions"

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'qpa-dev',
  username: process.env.DB_USER || null,
  password: process.env.DB_PASSWORD || null,
  entities: ["src/**/*.entity.ts"],
  migrations: ["migrations/*.js"],
  logging: true,
  synchronize: true,
  logger: 'debug',
  cli: {
    migrationsDir: "migrations"
  }
}

export = config
