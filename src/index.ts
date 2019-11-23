require("dotenv").config()

import { createServer } from "./graphql"
import typeormConfig from "./ormconfig"
import { createConnection } from "typeorm"
import { sendEmail } from "./post_office"
import * as config from "./config"
import express from "express"
import authHttpHandlers from "./Auth/authHttpHandlers"
import SessionManager from "./Auth/SessionManager"
import morgan from "morgan"
import ImageBucketService from "./Image/ImageBucketService"

const start = async () => {
  const sessionManager = new SessionManager({
    sendEmail: sendEmail,
    emailTargetDomain: config.domain,
    emailSenderDomain: config.mailgun.domain,
  })

  const imageBucketService = new ImageBucketService({
    buckerPublicURLBase: config.eventImage.imageBucketPublicURLBase,
    tmpLocalPath: config.eventImage.imageTempLocalPath,
    gcsBucketName: config.eventImage.imageCGSBucketName,
  })
  console.log(
    `Starting with db: ${typeormConfig.database} and config:\n ${JSON.stringify(
      typeormConfig,
      null,
      "\t"
    )}`
  )
  const connection = await createConnection(typeormConfig)
  console.log("Will look for migrations and run them")
  await connection.runMigrations()
  console.log("No more migrations to run")

  const server = await createServer({
    typeormConnection: connection,
    sendEmail,
    domain: config.domain,
    sessionManager,
    imageBucketService,
  })

  const authHandlers = authHttpHandlers(sessionManager)

  const app = express()
  app.use(express.json())
  app.use(morgan("combined"))
  app.post("/api/signup", authHandlers.signupHandler)
  app.post("/api/login", authHandlers.loginHandler)
  app.post("/api/init-session", authHandlers.initializeSessionHandler)
  app.get("/api/signout", authHandlers.signoutHandler)

  server.applyMiddleware({ app })

  app.listen({ port: 4000 }, () => {
    console.log(`🚀  Server ready at localhost:4000/${server.graphqlPath}`)
  })

  return server
}

start()
