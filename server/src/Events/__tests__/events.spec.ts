import {testConfig} from "../../../ormconfig"
import {Connection, createConnection} from "typeorm"
import {createServer} from "../../graphql"
import {PostOffice} from "../../post_office"
import {createTestClient} from "apollo-server-testing"
import {User} from "../../Auth/User.entity"
import {Session} from "../../Auth/Session.entity"
import {Event, EventInformation} from "../../Calendar/Event.entity";
import {useReducer} from "react";

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

    const event = new Event()
    event.owner = owner
    event.info = {
      title: "Test event",
      description: "Description for test event starting at 3pm"
    }
    event.time = {
      timeZone: 'Europe/Madrid',
      start: new Date("2019-10-10T13:00Z"),
      end: new Date("2019-10-10T14:00Z"),
    }
    event.status = "Scheduled"
    event.save()
  })
})
