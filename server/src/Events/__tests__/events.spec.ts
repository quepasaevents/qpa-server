import {testConfig} from "../../../ormconfig"
import {Connection, createConnection} from "typeorm"
import {createServer} from "../../graphql"
import {PostOffice} from "../../post_office"
import {createTestClient} from "apollo-server-testing"
import {User} from "../../Auth/User.entity"
import {Session} from "../../Auth/Session.entity"
import {Event, EventInformation} from "../../Calendar/Event.entity"
import gql from "graphql-tag"

let testClient
let connection: Connection = null
let sendEmailMock

describe('Events resolver', () => {
  beforeAll(async () => {
    return connection = await createConnection({
      ...testConfig,
    })
  })

  beforeEach(async () => {
    sendEmailMock = jest.fn(() => Promise.resolve(true))

    const server = await createServer({
      typeormConnection: connection,
      sendEmail: sendEmailMock as PostOffice
    })
    return testClient = await createTestClient(server as any)
  })

  afterAll(async () => {
    await connection.close()
  })

  it('Create Event', async (done) => {
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
    await event.save()
    expect(await Event.count()).toEqual(1)

    const res = await testClient.query({
      query: gql`
        query {
            events(filter: {limit: 10}) {
                id
                info {
                   title
                    description
                }
                status
                time {
                    timeZone
                    start
                    end
                }
            }
        }
      `
    })
    expect(res.errors).toBeUndefined()
    expect(res.data).toBeDefined()
    expect(res.data.events).toHaveLength(1)
    done()
  })
})
