import {testConfig} from "../../../ormconfig"
import {Connection, createConnection} from "typeorm"
import {createServer} from "../../graphql"
import {PostOffice} from "../../post_office"
import {createTestClient} from "apollo-server-testing"
import {User} from "../../Auth/User.entity"
import {Session} from "../../Auth/Session.entity"

let testClient
let connection: Connection = null
let sendEmailMock

describe('Evenst resolver', () => {
  beforeAll(async () => {
    connection = await createConnection({
      ...testConfig,
    })
  })

  beforeEach(async () => {
    sendEmailMock = jest.fn(() => Promise.resolve(true))

    const server = await createServer({
      typeormConnection: connection,
      sendEmail: sendEmailMock as PostOffice
    })
    testClient = await createTestClient(server as any)
  })

  it('Create Event', async () => {
    const owner = new User()
    owner.name = "Kite Flyer"
    owner.username = 'kites_are_us'
    owner.email = "info@kites.com"
    await owner.save()

    const session = new Session()
    session.user = owner
    session.hash = 'kite_owners_auth_hash'
    session.isValid = true
    await session.save()
  })

})
