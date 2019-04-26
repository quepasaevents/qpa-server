import {User} from "../../Auth/User.entity"
import {Session} from "../../Auth/Session.entity"
import {Event, toUTC} from "../../Calendar/Event.entity"
import {Frequency, RRule} from 'rrule'
import {testConfig} from "../../../ormconfig"
import {Connection, createConnection} from "typeorm"

let connection: Connection = null

describe('Occurrences', async () => {
  beforeAll(async () => {
    return (connection = await createConnection({
      ...testConfig,
    }))
  })

  afterAll(async () => {
    await connection.close()
  })

  it('Test occurrences resolver', async () => {
    const owner = new User()
    owner.name = "All the time"
    owner.username = "allthetime"
    owner.email = "allthetime@example.com"
    await owner.save()

    const session = new Session()
    session.user = owner
    session.hash = "allthetime_owners_auth_hash"
    session.isValid = true
    await session.save()

    const event = new Event()
    event.owner = owner
    event.info = {
      title: "Recurring event once a week",
      description: "Event happening every monday at 13:00"
    }
    event.time = {
      timeZone: "Europe/Madrid",
      start: "2019-03-01T13:00",
      end: "2019-03-01T14:00",
      recurrence: new RRule({
        freq: Frequency.WEEKLY,
        interval: 1,
        dtstart: new Date(toUTC("2019-03-01T13:00", "Europe/Madrid"))
      }).toString()
    }
    event.status = "Scheduled"

    event.updateOccurrences()
    await event.save()
  })
})
