import { createServer } from "./graphql"
import typeormConfig from '../ormconfig'
import {createConnection} from "typeorm"
import { sendEmail} from "./post_office"
import * as config from './config'
import express from 'express'
import {loginHandler} from "./Auth/authHttpHandler"

const start = async () => {
  console.log(`Starting with db: ${typeormConfig.database} and config:\n ${JSON.stringify(typeormConfig,null,'\t')}`)
  const server = await createServer({
    typeormConnection: await createConnection(typeormConfig),
    sendEmail,
    domain: config.domain

  })

  const app = express()
  app.post('/api/login', loginHandler)
  server.applyMiddleware({ app })

  app.listen({port: 4000}, () => {
    console.log(`🚀  Server ready at localhost:4000/${server.graphqlPath}`)
  })

  return server
}

start()
