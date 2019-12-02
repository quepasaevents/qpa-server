import {
  Event,
  EventInformation,
  EventOccurrence,
  EventRevisionState,
} from "../Calendar/Event.entity"
import { Context, ResolverMap } from "../@types/graphql-utils"
import { getTags } from "./EventsService"
import { equals } from "ramda"
import { User } from "../Auth/User.entity"
import { hasAnyRole } from "../Auth/authUtils"
import { ImageType } from "../Image/EventImage.entity"
import { QueryBuilder, getConnection } from "typeorm"

const getUserTrustLevel = async (context: Context) => {
  const isFullyTrusted = hasAnyRole(await context.user.roles, [
    "admin",
    "embassador",
  ])
  const isPartiallyTrusted =
    !isFullyTrusted && hasAnyRole(await context.user.roles, ["organizer"])
  const nonTrusted = !(isFullyTrusted || isPartiallyTrusted)

  return {
    isFullyTrusted,
    isPartiallyTrusted,
    nonTrusted,
  }
}

const resolvers: ResolverMap = {
  Query: {
    event: (_, req: GQL.IEventOnQueryArguments) => {
      return Event.findOne(req.id)
    },
    events: async (_, req: GQL.IEventsOnQueryArguments) => {
      const queryBuilder = getConnection()
        .getRepository(Event)
        .createQueryBuilder()

      if (req.filter.owner) {
        queryBuilder.where("ownerId = :ownerId", { ownerId: req.filter.owner })
      } else if (req.filter.pendingRevision) {
          queryBuilder.where(`"revisionState" = '${EventRevisionState.PENDING_MANDATORY_REVISION}'`)
            .orWhere(`"revisionState" = '${EventRevisionState.PENDING_SUGGESTED_REVISION}'`)
      }

      if (req.filter.limit) {
        queryBuilder.limit(req.filter.limit)
      }
      return queryBuilder.getMany()
    },
    occurrences: async (_, req: GQL.IOccurrencesOnQueryArguments) => {
      const { from, to } = req.filter
      return EventOccurrence.find({
        where: `during && tstzrange('${from}', '${to}')`,
        take: req.filter.limit,
      })
    },
    occurrence: async (_, req: GQL.IOccurrenceOnQueryArguments) => {
      const occ = EventOccurrence.findOne(req.id)
      if (!occ) {
        throw new Error(`No occurrence found for id ${req.id}`)
      }
      return occ
    },
  },

  CalendarEvent: {
    owner: async (event: Event) => {
      return event.owner
    },
    infos: async (event: Event) => {
      return event.infos
    },
    info: async (event: Event, req: GQL.IInfoOnCalendarEventArguments) => {
      const infos = await event.infos
      return infos.find(info => info.language === req.lang)
    },
    tags: async (event: Event) => {
      return event.tags
    },
    images: async (event: Event) => {
      const allImages = await event.images
      return {
        thumb: allImages.filter(image => image.type === ImageType.Thumbnail)[0],
        cover: allImages.filter(image => image.type === ImageType.Cover)[0],
        poster: allImages.filter(image => image.type === ImageType.Poster)[0],
        gallery: allImages.filter(image => image.type === ImageType.Gallery),
      }
    },
  },
  EventOccurrence: {
    start: (eOcc: EventOccurrence) => {
      return eOcc.start
    },
    end: (eOcc: EventOccurrence) => {
      return eOcc.end
    },
  },

  Mutation: {
    createEvent: async (
      _,
      { input }: GQL.ICreateEventOnMutationArguments,
      context: Context
    ) => {
      if (!context.user) {
        throw Error("not authenticated")
      }
      const userTrustLevel = await getUserTrustLevel(context)

      const event = new Event()

      event.publishedState = input.publishedState

      if (userTrustLevel.isFullyTrusted) {
        event.revisionState = EventRevisionState.ACCEPTED
      } else if (userTrustLevel.isPartiallyTrusted) {
        event.revisionState = EventRevisionState.PENDING_SUGGESTED_REVISION
      } else {
        event.revisionState = EventRevisionState.PENDING_MANDATORY_REVISION
      }

      event.owner = Promise.resolve(context.user)
      event.infos = Promise.resolve(
        input.infos.map(infoInput => {
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
        end: input.time.end,
      }
      if (input.tagNames) {
        const tags = await getTags(input.tagNames)
        console.log("will set tags", tags)
        event.tags = Promise.resolve(tags)
      }
      event.location = input.location
      event.occurrences = Promise.resolve(event.getOccurrences())
      await event.save()
      return event
    },
    updateEvent: async (
      _,
      { input }: GQL.IUpdateEventOnMutationArguments,
      context: Context
    ) => {
      const { id, ...fields } = input

      if (!context.user) {
        throw Error("not authenticated")
      }
      const event = await Event.findOne(id)
      const userTrustLevel = await getUserTrustLevel(context)

      const isOwner = (await event.owner).id !== context.user.id

      if (!(userTrustLevel.isFullyTrusted || isOwner)) {
        throw Error("Only the owner can edit their events")
      }
      if (Object.keys(fields).length === 0) {
        throw Error("No change detected")
      }
      if (input.time && !equals(input.time, event.time)) {
        console.log(
          `Event time changed from: ${JSON.stringify(
            event.time
          )} to: ${JSON.stringify(input.time)}`
        )
        event.time = input.time
        const existingOccurrences = await event.occurrences
        await Promise.all(
          existingOccurrences.map(occ => EventOccurrence.delete(occ.id))
        )
        event.occurrences = Promise.resolve(event.getOccurrences())
      }
      if (input.infos) {
        event.infos = Promise.resolve(
          input.infos.map(inputInfo => {
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
      if (input.tagNames) {
        const tagsToSet = await getTags(input.tagNames)
        console.log("tagsToSet, ", tagsToSet)
        event.tags = Promise.resolve(tagsToSet)
      }
      if (input.location) {
        event.location = input.location
      }
      if (event.revisionState === EventRevisionState.ACCEPTED) {
        event.revisionState = EventRevisionState.PENDING_SUGGESTED_REVISION
      }
      return event.save()
    },
    deleteEvent: async (_, id: string, context: Context): Promise<User> => {
      const event = await Event.findOne(id)

      const isSuperUser = hasAnyRole(await context.user.roles, [
        "admin",
        "embassador",
      ])
      const isOwner = (await event.owner).id !== context.user.id

      if (!(isSuperUser || isOwner)) {
        throw Error("Only the owner can delete this event")
      }

      console.log("will try to remove event now", event.id)
      const removeEventResult = await Event.remove(event)
      console.log("removeEventResult", JSON.stringify(removeEventResult))
      return context.user
    },
  },
}

export default resolvers
