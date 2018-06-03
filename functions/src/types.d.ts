// export interface Session {
//   createdAt: Date
//   ttlMs: number
//   expired: boolean
//   authMethod: string
//   hash: string
//   userAgent: string
//   location: string
// }

interface DBEntity {
  id?: string
  ctime?: number,
}

interface UserKeys {
  username?: string
  email?: string
}
interface UserProperties extends UserKeys {
  name: string
}

interface User extends UserKeys, DBEntity {
}


export type EventTime = {
  date: string // in format  "yyyy-mm-dd" for all-day event
  dateTime: string // in RFC3339 e.g. 2002-10-02T10:00:00-05:00 or 2002-10-02T15:00:00Z
  timeZone: string // IANA Timezone e.g. "Europe/Zurich"
}

// Event Timing is the instance that gets persisted over the calendar API
// and contains just the necessary data to solve the scheduling. The rest
// of the meta of an event is handled by the application directly.
type EventTiming = {
  // The (exclusive) end time of the event. For a recurring event, this
  // is the end time of the first instance.
  end: EventTime

  // The (inclusive) start time of the event. For a recurring event,
  // this is the start time of the first instance.
  start: EventTime

  // For an instance of a recurring event, this is the time at which
  // this event would start according to the recurrence data in the
  // recurring event identified by recurringEventId. Immutable.
  originalStartTime: EventTime

  // List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
  // as specified in RFC5545. Note that DTSTART and DTEND lines are not
  // allowed in this field; event start and end times are specified in
  // the start and end fields. This field is omitted for single events or
  // instances of recurring events.
  recurrence: string[]

  status: "confirmed" | "tentative" | "cancelled"
  calendarEventId: string
}

export type CalendarEvent = {
  timeZone?: string
  owner: string
  contactPhone: string
  contactEmail: string
  locationAddress: string
  location: string
  locationCoordinate: Array<number>,
  title: string
  description: string
  imageUrl: string
  tags: Array<string>
  gcalEntry: number
  id: number
  timing: EventTiming
}
