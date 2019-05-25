import {
  Event,
  EventInformation,
  EventOccurrence
} from "../Calendar/Event.entity"
import { Context, ResolverMap } from "../@types/graphql-utils"
import {GQL} from "../../../@types"
const resolvers: ResolverMap = {
  Query: {
    event: (_, req: GQL.IEventOnQueryArguments, context, info) => {
      return Event.findOne(req.id)
    },
    events: async (_, req: GQL.IEventsOnQueryArguments, context, info) => {
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
      context,
      info
    ) => {
      const { from, to } = req.filter
      const occurrences = await EventOccurrence.find({
        where: `during && tstzrange('${from}', '${to}')`,
        take: req.filter.limit
      })

      return occurrences
    }
  },

  CalendarEvent: {
    owner: async (event: Event, args, context, info) => {
      return event.owner
    },
    info: async (event: Event) => {
      return event.info
    }
  },

  EventOccurrence: {
    start: (eOcc: EventOccurrence) => JSON.parse(eOcc.during)[0],
    event: async (eOcc: EventOccurrence) => {
      console.log('eOcc', eOcc)
      return eOcc.event
    }
  },

  Mutation: {
    createEvent: async (
      _,
      { input }: GQL.ICreateEventOnMutationArguments,
      context: Context,
      info
    ) => {
      if (!context.user) {
        throw Error("not authenticated")
      }
      const event = new Event()
      event.owner = context.user
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
      event.updateOccurrences()
      await event.save()
      return event
    }
  }
}

export default resolvers
