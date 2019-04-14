import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  AfterUpdate,
  AfterInsert,
  BeforeInsert,
  BeforeUpdate,
  TransactionManager,
  EntityManager,
  Transaction
} from "typeorm"
import { User } from "../Auth/User.entity"
import { DateTime } from "luxon"
import { rrulestr } from "rrule"

const toUTC = (isoTime: string, ianaTZ: string) => {
  const parsed = DateTime.fromISO(isoTime, { zone: ianaTZ })
  if (parsed.invalidReason) {
    throw new Error(
      `${parsed.invalidReason}: ${isoTime} with time-zone: ${ianaTZ}`
    )
  }
  return parsed.toUTC().toISO()
}

@Entity()
class EventLocation extends BaseEntity {}

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

  // todo: check pg support for arrays
  // @Column({type: "array"})
  // languages: string[]

  @Column()
  contact: Contact
}

export class EventTime {
  @Column()
  timeZone: string

  @Column({ type: "timestamp without time zone" })
  start: string

  @Column({ type: "timestamp without time zone" })
  end: string

  @Column({ nullable: true })
  recurrence?: string

  @Column({ nullable: true })
  exceptions?: string
}

export class EventInformation {
  @Column()
  title: string
  @Column()
  description: string
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
  occurrences: EventOccurrence[]

  @Column(type => EventInformation)
  info: EventInformation

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
    if (!this.time.recurrence) {
      const singleOccurrence = new EventOccurrence()
      singleOccurrence.event = this
      singleOccurrence.timeZone = this.time.timeZone
      singleOccurrence.start = this.time.start
      singleOccurrence.end = this.time.end
      singleOccurrence.utcStart = toUTC(this.time.start, this.time.timeZone)
      singleOccurrence.utcEnd = toUTC(this.time.end, this.time.timeZone)
      this.occurrences = [singleOccurrence]
    } else {
      const ruleSet = rrulestr(this.time.recurrence)
      const allDates = ruleSet.all()

      this.occurrences = allDates
        .map(occurenceDate => {
          const occ = new EventOccurrence()
          occ.timeZone = this.time.timeZone
          occ.start = this.time.start
          occ.end = this.time.end
          occ.utcStart = toUTC(this.time.start, this.time.timeZone)
          occ.utcEnd = toUTC(this.time.end, this.time.timeZone)
          occ.event = this
          return occ
        })

    }
    return this
  }
}

@Entity()
export class EventOccurrence extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @ManyToOne(type => Event, event => event.occurrences)
  event: Event

  @Column({ type: "timestamp without time zone" })
  start: string

  @Column({ type: "timestamptz" })
  utcStart: string

  @Column({ type: "timestamp without time zone" })
  end: string

  @Column({ type: "timestamptz" })
  utcEnd: string

  @Column()
  timeZone: string
}
