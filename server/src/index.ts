import { createServer } from "./graphql"
import typeormConfig from '../ormconfig'
import {createConnection} from "typeorm"
import { sendEmail} from "./post_office"

async function start() {
  const server = await createServer({
    typeormConnection: await createConnection(typeormConfig),
    sendEmail,
  })
  server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`)
  })
  return server
}

start()
