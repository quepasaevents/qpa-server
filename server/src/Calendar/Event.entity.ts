import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm"
import {User} from "../Auth/User.entity"
import {DateTime} from "luxon"
import {rrulestr} from "rrule"

export const toUTC = (isoTime: string, ianaTZ: string): DateTime => {
  const parsed = DateTime.fromISO(isoTime, {zone: ianaTZ})
  if (parsed.invalidReason) {
    throw new Error(
      `${parsed.invalidReason}: ${isoTime} with time-zone: ${ianaTZ}`
    )
  }
  return parsed
}

export const breakTime = (isoString: string) => {
  const tSplit = isoString.split('T')
  return {
    date: tSplit[0],
    time: tSplit[1].substr(0, 8)
  }
}

@Entity()
class EventLocation extends BaseEntity {
}

class Contact {
  @Column()
  email?: string

  @Column()
  phone?: string
}

@Entity()
class EventContactPerson {

  @Column()
  name: string

  @Column()
  contact: Contact
}

/**
 * EventTime documents the time in the local mindset of the user created the event
 * therefore all times are string and not Date objects. TODO: Add joi validation
 */


export class EventTime {
  @Column()
  timeZone: string

  @Column()
  start: string

  @Column()
  end: string

  @Column({nullable: true})
  recurrence?: string

  @Column({nullable: true})
  exceptions?: string
}

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @ManyToOne(type => User, user => user.events)
  owner: User

  @OneToMany(type => EventOccurrence, occurrence => occurrence.event, {
    cascade: true
  })
  occurrences: Promise<EventOccurrence[]>

  @OneToMany(type => EventInformation, eventInfo => eventInfo.event, {
    cascade: true
  })
  info: Promise<EventInformation[]>

  @Column(type => EventTime)
  time: EventTime

  @Column({
    default: "confirmed"
  })
  status: string

  // todo: check pg support for arrays
  // @Column(type => EventContactPerson)
  // contact: EventContactPerson[]

  @Column(type => EventLocation)
  location: EventLocation

  updateOccurrences() {
    const occurences = []
    console.log('this.time.recurrence', this.time.recurrence)
    if (!this.time.recurrence) {
      const occ = new EventOccurrence()
      occ.during = `[${this.time.start},${this.time.end}]`
      occurences.push(occ)
    } else {
      const dates = rrulestr(this.time.recurrence).all((occurenceDate, i) => i < 30)
      const eventDuration = DateTime.fromISO(this.time.start).diff(DateTime.fromISO(this.time.end))

      dates.forEach(recurrenceDateStart => {
        const occ = new EventOccurrence()
        const brokenRecurrenceDateStart = breakTime(recurrenceDateStart.toISOString())
        const brokenRecurrenceDateEnd = breakTime(DateTime.fromJSDate(recurrenceDateStart).plus(eventDuration).toISO())
        const userInputStart = breakTime(this.time.start)
        const userInputEnd = breakTime(this.time.end)

        const duringFrom = `${brokenRecurrenceDateStart.date} ${userInputStart.time} ${this.time.timeZone}`
        const duringTo = `${brokenRecurrenceDateEnd.date} ${userInputEnd.time} ${this.time.timeZone}`
        occ.during = `[${duringFrom}, ${duringTo}]`
      })

    }
    occurences.forEach(occ => {
      occ.start = this.time.start
      occ.end = this.time.end
    })
    console.log('occurences', occurences)
    this.occurrences = Promise.resolve(occurences)
    return
  }
}

@Entity()
export class EventInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column()
  language: string
  @Column()
  title: string
  @Column({nullable: true})
  description: string
  @ManyToOne(type => Event, event => event.info)
  event: Event
}

@Entity()
export class EventOccurrence extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @ManyToOne(type => Event, event => event.occurrences)
  event: Promise<Event>

  @Column({type: "tstzrange", nullable: true})
  during: string

  @Column()
  start: string

  @Column()
  end: string

}
