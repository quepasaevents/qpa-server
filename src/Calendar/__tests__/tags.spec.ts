import { Connection, createConnection } from "typeorm"
import { createServer } from "../../graphql"
import { PostOffice } from "../../post_office"
import { createTestClient } from "apollo-server-testing"
import { User } from "../../Auth/User.entity"
import { Session } from "../../Auth/Session.entity"
import { Event, EventInformation } from "../../Calendar/Event.entity"
import gql from "graphql-tag"
import testConfig from "../../__tests__/testORMConfig"

let testClient
let connection: Connection = null
let sendEmailMock
let sessionManagerMock

describe("Tags resolver", () => {
  beforeAll(async () => {
    return (connection = await createConnection({
      ...testConfig
    }))
  })

  beforeEach(async () => {
    sendEmailMock = jest.fn(() => Promise.resolve(true))
    sessionManagerMock = jest.fn(() => Promise.resolve(true))

    const server = await createServer({
      typeormConnection: connection,
      sendEmail: sendEmailMock as PostOffice,
      sessionManager: sessionManagerMock
    })
    return (testClient = await createTestClient(server as any))
  })

  afterAll(async () => {
    await connection.close()
  })

  it("Create some tags", async done => {
    done()
  })
})
