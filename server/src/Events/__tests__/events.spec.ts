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

const createKiteflyingEvent = async () => {
  const owner = new User()
  owner.name = "Kite Flyer"
  owner.username = "kites_are_us"
  owner.email = "info@kites.com"
  await owner.save()

  const session = new Session()
  session.user = owner
  session.hash = "kite_owners_auth_hash"
  session.isValid = true
  await session.save()

  const event = new Event()
  event.owner = owner
  event.info = {
    title: "Kite Flying Test Event",
    description: "Description for test event starting at 3pm"
  }
  event.time = {
    timeZone: "Europe/Madrid",
    start: "2019-10-10T13:00",
    end: "2019-10-10T14:00"
  }
  event.status = "Scheduled"
  return await event.save()
}

const createKinttingEvent = async () => {
  const owner = new User()
  owner.name = "Knitty User"
  owner.username = "kintting_is_fun"
  owner.email = "info@knitting.com"
  await owner.save()

  const session = new Session()
  session.user = owner
  session.hash = "knitty_owners_auth_hash"
  session.isValid = true
  await session.save()

  const event = new Event()
  event.owner = owner
  event.info = {
    title: "Knitting Test Event",
    description: "Description for test event starting at 3pm"
  }
  event.time = {
    timeZone: "Europe/Madrid",
    start: "2019-10-10T14:00",
    end: "2019-10-10T15:00"
  }
  event.status = "Scheduled"
  return await event.updateOccurrences().save()
}

describe("Events resolver", () => {
  beforeAll(async () => {
    return (connection = await createConnection({
      ...testConfig
    }))
  })

  beforeEach(async () => {
    sendEmailMock = jest.fn(() => Promise.resolve(true))

    const server = await createServer({
      typeormConnection: connection,
      sendEmail: sendEmailMock as PostOffice
    })
    return (testClient = await createTestClient(server as any))
  })

  afterAll(async () => {
    await connection.close()
  })

  it("Create Kiteflying Event", async done => {
    await createKiteflyingEvent()
    expect(await Event.count()).toEqual(1)
    const res = await testClient.query({
      query: gql`
        query {
          events(filter: { limit: 10 }) {
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

  it("Create knitting event", async done => {
    const knittingEvent = await createKinttingEvent()
    const kinttingUser = await User.findOne({ username: "kintting_is_fun" })
    const res = await testClient.query({
      query: gql`
        query GetEvent($ownerId: ID!) {
          events(filter: { limit: 10, owner: $ownerId }) {
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
      `,
      variables: {
        ownerId: kinttingUser.id
      }
    })
    expect(res.errors).toBeUndefined()
    expect(res.data).toBeDefined()
    expect(res.data.events).toHaveLength(1)
    expect(res.data.events[0].info.title).toEqual("Knitting Test Event")
    done()
  })

})
