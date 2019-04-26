import { createServer } from "./graphql"
import typeormConfig from '../ormconfig'
import {createConnection} from "typeorm"
import { sendEmail} from "./post_office"
import * as config from './config'

async function start() {
  console.log(`Starting with db: ${typeormConfig.database}`)
  const server = await createServer({
    typeormConnection: await createConnection(typeormConfig),
    sendEmail,
    domain: config.domain

  })
  server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`)
  })
  return server
}

start()
