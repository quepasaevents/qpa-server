import {ConnectionOptions} from 'typeorm'

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'qpa-dev',
  entities: ["src/**/*.entity.ts"],
  logging: true,
  synchronize: true,
  logger: 'debug'
}

export const testConfig: ConnectionOptions = {
  ...config,
  database: 'qpa-test',
  dropSchema: true
}

export default config
