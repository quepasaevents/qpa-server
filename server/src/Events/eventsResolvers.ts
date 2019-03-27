import {Event} from "../Calendar/Event.entity"
import {ResolverMap} from "../@types/graphql-utils"
import {GQL} from "../@types"

const resolvers: ResolverMap = {
  Query: {
    events: async (_, req: GQL.IEventsOnQueryArguments, context, info) => {
      return Event.find({
        take: req.filter.limit,
        where: (req.filter && req.filter.owner) ? `"ownerId"='${req.filter.owner}'` : null
      })
    },
  },

  Event: {
    owner: async (event: Event, args, context, info) => {
      return event.owner
    }
  },

  Mutation: {
    createEvent: async (_, { input }: GQL.ICreateEventOnMutationArguments, context, info) => {
      const event = new Event()
      event.owner = context.user
      return null
    }
  },
}

export default resolvers
