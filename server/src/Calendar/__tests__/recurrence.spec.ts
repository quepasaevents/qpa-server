import {testConfig} from "../../../ormconfig"
import {createConnection} from "typeorm"
import {User} from "../../Auth/User.entity"
import {Event, EventOccurrence} from "../Event.entity"
import {DateTime} from "luxon";

const toUTC = (isoTime: string, ianaTZ: string) => {
  const parsed = DateTime.fromISO(isoTime, {zone: ianaTZ})
  if (parsed.invalidReason) {
    throw new Error(`${parsed.invalidReason}: ${isoTime} with time-zone: ${ianaTZ}`)
  }
  return parsed.toUTC().toISO()
}

let owner: User = null

let connection
describe('Recurring events', () => {
  beforeAll(async () => {
    connection = await createConnection({
      ...testConfig,
    })
    owner = new User()
    owner.username = 'onetimeguy'
    owner.email = 'one@time.com'
    owner.name = 'One Time'
    await owner.save()
    return connection
  })
  afterAll(async () => {
    await connection.close()
  })


  it('Event with no recurrence has one occurrence', async (done) => {
    const event = new Event()
    event.info = {
      title: 'Test one time event',
      description: 'This is a test event that has no repetition rules'
    }
    event.owner = owner
    event.time = {
      timeZone: 'Europe/Madrid',
      start: "2019-02-01T10:00",
      end: "2019-02-01T11:00",
    }

    await event.save()
    await event.updateOccurrences()

    await event.save()

    const occurences = await EventOccurrence.find({where: {eventId: event.id}})
    expect(occurences).toHaveLength(1)
    expect(occurences[0].timeZone).toEqual(event.time.timeZone)
    done()
  })
})
