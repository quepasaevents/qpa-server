import { testConfig } from "../../../ormconfig"
import { createConnection } from "typeorm"
import { User } from "../../Auth/User.entity"
import { Event, EventOccurrence } from "../Event.entity"
import { DateTime } from "luxon"

const toUTC = (isoTime: string, ianaTZ: string) => {
  const parsed = DateTime.fromISO(isoTime, { zone: ianaTZ })
  if (parsed.invalidReason) {
    throw new Error(
      `${parsed.invalidReason}: ${isoTime} with time-zone: ${ianaTZ}`
    )
  }
  return parsed.toUTC().toISO()
}

let owner: User = null

let connection
describe("Recurring events", () => {
  beforeAll(async () => {
    connection = await createConnection({
      ...testConfig
    })
    owner = new User()
    owner.username = "onetimeguy"
    owner.email = "one@time.com"
    owner.name = "One Time"
    await owner.save()
    return connection
  })
  afterAll(async () => {
    await connection.close()
  })

  it("Event with no recurrence has one occurrence", async done => {
    const event = new Event()
    event.info = {
      title: "Test one time event",
      description: "This is a test event that has no repetition rules"
    }
    event.owner = owner
    event.time = {
      timeZone: "Europe/Madrid",
      start: "2019-02-01T10:00",
      end: "2019-02-01T11:00"
    }

    await event.save()
    await event.updateOccurrences()

    await event.save()

    const occurences = await EventOccurrence.find({
      where: { eventId: event.id }
    })
    expect(occurences).toHaveLength(1)
    expect(occurences[0].timeZone).toEqual(event.time.timeZone)
    done()
  })

  it("Event happening once a week", () => {
    const event = new Event()
    event.info = {
      title: "Weekly testing event",
      description: "This event takes place every monday at 2pm"
    }
    event.owner = owner

    // from 2019-03-04 to 2019-03-25 every monday
    //      March 2019
    // Su Mo Tu We Th Fr Sa
    //                1  2
    // 3  4  5  6  7  8  9    <- 2019-03-04
    // 10 11 12 13 14 15 16   <- 2019-03-11
    // 17 18 19 20 21 22 23   <- 2019-03-18
    // 24 25 26 27 28 29 30   <- 2019-03-25
    // 31

    event.time = {
      timeZone: "Europe/Madrid",
      start: "2019-03-04T14:00",
      end: "2019-03-04T15:00",
      recurrence: "DTSTART:20190304T140000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO;INTERVAL=1;UNTIL=20190325T230000Z" // until 15/04/2019
    }

    event.updateOccurrences()
    expect(event.occurrences).toHaveLength(4)
  })
})
