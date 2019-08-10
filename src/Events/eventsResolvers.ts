import {
  Event,
  EventInformation,
  EventOccurrence
} from "../Calendar/Event.entity"
import { Context, ResolverMap } from "../@types/graphql-utils"
import {GQL} from "../../@types"
import EventsService from './EventsService'

const eventsService = new EventsService()

const resolvers: ResolverMap = {
  Query: {
    event: (_, req: GQL.IEventOnQueryArguments) => {
      return Event.findOne(req.id)
    },
    events: async (_, req: GQL.IEventsOnQueryArguments) => {
      return Event.find({
        take: req.filter.limit,
        where:
          req.filter && req.filter.owner
            ? `"ownerId"='${req.filter.owner}'`
            : null
      })
    },
    occurrences: async (
      _,
      req: GQL.IOccurrencesOnQueryArguments,
    ) => {
      const { from, to } = req.filter
      return EventOccurrence.find({
        where: `during && tstzrange('${from}', '${to}')`,
        take: req.filter.limit
      })
    },
    occurrence: async (_, req: GQL.IOccurrenceOnQueryArguments) => {
      const occ = EventOccurrence.findOne(req.id)
      if (!occ) {
        throw new Error(`No occurrence found for id ${req.id}`)
      }
      return occ
    }
  },

  CalendarEvent: {
    owner: async (event: Event) => {
      return event.owner
    },
    info: async (event: Event) => {
      return event.info
    }
  },

  EventOccurrence: {
    start: (eOcc: EventOccurrence) => {
      return eOcc.during.split(',')[0].substring(2, 21)
    },
    end: (eOcc: EventOccurrence) => {
      return eOcc.during.split(',')[1].substring(2, 21)
    },
  },

  Mutation: {
    createEvent: async (
      _,
      { input }: GQL.ICreateEventOnMutationArguments,
      context: Context,
    ) => {
      if (!context.user) {
        throw Error("not authenticated")
      }
      const event = new Event()
      event.owner = Promise.resolve(context.user)
      event.info = Promise.resolve(
        input.info.map(infoInput => {
          const eventInformation = new EventInformation()
          eventInformation.language = infoInput.language
          eventInformation.title = infoInput.title
          eventInformation.description = infoInput.description
          eventInformation.event = event
          return eventInformation
        })
      )
      event.time = {
        recurrence: input.time.recurrence,
        timeZone: input.time.timeZone,
        start: input.time.start,
        end: input.time.end
      }
      event.meta = input.meta
      event.location = input.location

      event.occurrences = Promise.resolve(event.getOccurrences())
      await event.save()
      return event
    },
    updateEvent: async (
      _,
      { input }: GQL.IUpdateEventOnMutationArguments,
      context: Context,
    ) => {
      const {id, ...fields} = input

      if (!context.user) {
        throw Error("not authenticated")
      }
      const event = await Event.findOne(id)
      if ((await event.owner).id !== context.user.id) {
        throw Error("Only the owner can edit their events")
      }
      if (Object.keys(fields).length === 0) {
        throw Error("No change detected")
      }
      if (input.time) {
        event.time = input.time
        const existingOccurrences = await event.occurrences
        await Promise.all(existingOccurrences.map(occ => EventOccurrence.delete(occ.id)))
        event.occurrences = Promise.resolve(event.getOccurrences())
      }
      if (input.info) {
        event.info = Promise.resolve(
          input.info.map(inputInfo => {
            const newInfo = new EventInformation()
            Object.keys(inputInfo).forEach(inputInfoKey => {
              newInfo[inputInfoKey] = inputInfo[inputInfoKey]
            })
            return newInfo
          })
        )
      }
      if (input.location) {
        event.location = input.location
      }
      if (input.meta) {
        event.meta = input.meta
      }
      if (input.location) {
        event.location = input.location
      }
      console.log(JSON.stringify(event,null,'\t'))
      return event.save()
    }
  }
}

export default resolvers
