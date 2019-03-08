import { ConnectionOptions } from 'typeorm'

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  database: process.env.POSTGRES_DB || 'gpa',
  entities: [
    __dirname + '/src/**/*.entity{.ts,.js}',
  ],
  synchronize: true,
}

export default config
