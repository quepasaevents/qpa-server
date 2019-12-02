import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { User } from "../Auth/User.entity"
import { DateTime } from "luxon"
import { rrulestr } from "rrule"
import { EventTag } from "./EventTag.entity"
import { format } from "date-fns"
import { EventImage } from "../Image/EventImage.entity"
import EventRevision from "../Events/EventRevision.entity"

export const breakTime = (isoString: string) => {
  const tSplit = isoString.split("T")
  return {
    date: tSplit[0],
    time: tSplit[1].substr(0, 8),
  }
}

export enum EventPublishedState {
  PUBLISHED = "published",
  DRAFT = "draft",
}

export enum EventRevisionState {
  PENDING_SUGGESTED_REVISION = "pending_suggested_revision",
  PENDING_MANDATORY_REVISION = "pending_mandatory_revision",
  CHANGES_REQUIRED = "changes_required",
  ACCEPTED = "accepted",
  DENIED = "denied",
  SPAM = "spam",
}

export class EventLocation {
  @Column({ nullable: true })
  address?: string
  @Column({ nullable: true })
  name?: string
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

  @Column({ nullable: true })
  recurrence?: string

  @Column({ nullable: true })
  exceptions?: string
}

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @ManyToOne(type => User, user => user.events)
  owner: Promise<User>

  @OneToMany(type => EventOccurrence, occurrence => occurrence.event, {
    cascade: true,
  })
  occurrences: Promise<EventOccurrence[]>

  @OneToMany(type => EventInformation, eventInfo => eventInfo.event, {
    cascade: true,
  })
  infos: Promise<EventInformation[]>

  @Column(type => EventTime)
  time: EventTime

  @ManyToMany(type => EventTag)
  @JoinTable()
  tags: Promise<EventTag[]>

  @Column({
    default: "confirmed",
  })
  status: string

  @OneToMany(type => EventImage, image => image.event, {
    onDelete: "CASCADE",
  })
  images: Promise<EventImage[]>

  @OneToMany(_ => EventRevision, revision => revision.event, {
    onDelete: "CASCADE",
  })
  revisions: Promise<EventRevision[]>

  @Column("varchar")
  publishedState: EventPublishedState

  @Column("varchar")
  revisionState: EventRevisionState

  @Column(type => EventLocation)
  location: EventLocation

  getOccurrences(): EventOccurrence[] {
    const revisionAllowsGoingLive = [
      EventRevisionState.PENDING_SUGGESTED_REVISION,
      EventRevisionState.ACCEPTED,
    ].includes(this.revisionState)
    const isPublished = this.publishedState === EventPublishedState.PUBLISHED

    if (!revisionAllowsGoingLive || !isPublished) {
      return []
    }

    const occurences = []
    const justTime = {
      start: format(new Date(this.time.start), "HH:mm"),
      end: format(new Date(this.time.end), "HH:mm"),
    }
    if (!this.time.recurrence) {
      const occ = new EventOccurrence()
      occ.during = `[${this.time.start},${this.time.end}]`
      occ.start = format(new Date(this.time.start), "yyyy-MM-dd'T'HH:mm")
      occ.end = format(new Date(this.time.end), "yyyy-MM-dd'T'HH:mm")
      occurences.push(occ)
    } else {
      const dates = rrulestr(this.time.recurrence).all(
        (occurrenceDate, i) => i < 30
      )
      const eventDuration =
        new Date(this.time.end).getTime() - new Date(this.time.start).getTime()

      dates.forEach(recurrenceDateStart => {
        const recurrenceDateEnd = new Date(
          recurrenceDateStart.getTime() + eventDuration
        )

        const occ = new EventOccurrence()
        occ.event = Promise.resolve(this)
        const brokenRecurrenceDateStart = breakTime(
          recurrenceDateStart.toISOString()
        )
        const brokenRecurrenceDateEnd = breakTime(
          DateTime.fromJSDate(recurrenceDateStart)
            .plus(eventDuration)
            .toISO()
        )
        const userInputStart = breakTime(this.time.start)
        const userInputEnd = breakTime(this.time.end)

        const duringFrom = `${brokenRecurrenceDateStart.date} ${userInputStart.time} ${this.time.timeZone}`
        const duringTo = `${brokenRecurrenceDateEnd.date} ${userInputEnd.time} ${this.time.timeZone}`
        occ.during = `[${duringFrom}, ${duringTo}]`
        occ.start = `${format(recurrenceDateStart, "yyyy-MM-dd")}T${
          justTime.start
        }`
        occ.end = `${format(recurrenceDateStart, "yyyy-MM-dd")}T${justTime.end}`
        occ.event = Promise.resolve(this)
        occurences.push(occ)
      })
    }
    console.log("the occurrences calculated", occurences)
    return occurences
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
  @Column({ nullable: true })
  description: string
  @ManyToOne(type => Event, event => event.infos, {
    onDelete: "CASCADE",
  })
  event: Event
}

@Entity()
export class EventOccurrence extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @ManyToOne(type => Event, event => event.occurrences, {
    nullable: false,
    onDelete: "CASCADE",
  })
  event: Promise<Event>

  @Column({ type: "tstzrange", nullable: true })
  during: string

  @Column()
  start: string

  @Column()
  end: string
}
