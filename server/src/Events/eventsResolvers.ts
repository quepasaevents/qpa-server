import {
  Event,
  EventInformation,
  EventOccurrence
} from "../Calendar/Event.entity"
import { Context, ResolverMap } from "../@types/graphql-utils"

const resolvers: ResolverMap = {
  Query: {
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
      return EventOccurrence.createQueryBuilder("occurrence")
        .where("occurrence.utcStart BETWEEN :from AND :to", {
          from: req.filter.from,
          to: req.filter.to
        })
        .limit(req.filter.limit)
    }
  },

  Event: {
    owner: async (event: Event, args, context, info) => {
      return event.owner
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
      event.info = input.info.map(infoInput => {
        const eventInformation = new EventInformation()
        eventInformation.language = infoInput.language
        eventInformation.title = infoInput.title
        eventInformation.description = infoInput.description
        eventInformation.event = event
        return eventInformation
      })
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
