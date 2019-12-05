import { Context, ResolverMap } from "../@types/graphql-utils";
import { hasHigherRole } from "../Auth/authUtils";
import { Event, EventRevisionState } from "../Calendar/Event.entity";
import EventRevision, { EventRevisionConclusion } from "./EventRevision.entity";

const OPEN_REVISION_STALE_MS = 15 * 60 * 1000
const revisionResolvers: ResolverMap = {
  Mutation: {
    startEventRevision: async (
      _,
      req: GQL.IStartEventRevisionOnMutationArguments,
      context,
      info
    ) => {
      if (!(await hasHigherRole(context))) {
        throw new Error("Insufficient permissions to revise an event")
      }
      const event = await Event.findOne(req.input.eventId)
      const openRevisions = (await event.revisions).filter(revision =>
        revision.isActive()
      )

      const msTimeForStaleRevision = Date.now() - OPEN_REVISION_STALE_MS
      const revisionsToBeMarkedStale = []
      const openValidRevisions = []
      openRevisions.forEach(async revision => {
        if (revision.createdAt.getTime() < msTimeForStaleRevision) {
          revisionsToBeMarkedStale.push(revision)
        } else if (!(revision.submittedAt || (await revision.dismissedBy))) {
          openValidRevisions.push(revision)
        }
      })
      // todo: system wide search for stale revisions and mark or delete those
      const markAsStalePromises = revisionsToBeMarkedStale.map(
        staleRevision => {
          staleRevision.staleAt = new Date()
          return staleRevision.save()
        }
      )
      await Promise.all(markAsStalePromises)

      if (openValidRevisions.length) {
        throw new Error("Event has an open revision.")
      }

      const newRevision = new EventRevision()
      newRevision.event = Promise.resolve(event)
      newRevision.author = Promise.resolve(context.user)
      const eventRevisions = (await event.revisions) || []
      event.revisions = Promise.resolve([...eventRevisions, newRevision])
      await newRevision.save()
      return event.save()
    },
    submitEventRevision: async (
      _,
      req: GQL.ISubmitEventRevisionOnMutationArguments,
      context,
      info
    ) => {
      if (!(await hasHigherRole(context))) {
        throw new Error("Insufficient permissions to revise an event.")
      }
      const revision = await EventRevision.findOne(req.input.revisionId)
      const revisionAuthor = await revision.author
      if ((await context.user).id !== revisionAuthor.id) {
        throw new Error(
          `You can only submit your own revision, this revision belongs to ${revisionAuthor.name}.`
        )
      }
      if (!req.input.conclusion) {
        throw new Error(
          "Revision must have a conclusion"
        )
      }
      revision.conclusion = req.input.conclusion as EventRevisionConclusion
      revision.submittedAt = new Date()
      await revision.save()

      const event = await revision.event
      const nullifyOccurrences = async () => {
        const existingOccurrences = await event.occurrences
        if (existingOccurrences?.length) {
          event.occurrences = Promise.resolve([])
        }
      }
      switch(revision.conclusion) {
        case EventRevisionConclusion.ACCEPT: {
          event.revisionState = EventRevisionState.ACCEPTED
          event.occurrences = Promise.resolve(event.getOccurrences())
          break
        }
        case EventRevisionConclusion.REJECT: {
          event.revisionState = EventRevisionState.DENIED
          break
        }
        case EventRevisionConclusion.REQUEST_CHANGES: {
          await nullifyOccurrences()
          event.revisionState = EventRevisionState.CHANGES_REQUIRED
          break
        }
        case EventRevisionConclusion.SPAM: {
          await nullifyOccurrences()
          event.revisionState = EventRevisionState.CHANGES_REQUIRED
          break
        }
        default: {
          throw new Error(`Conclusion type ${revision.conclusion} is not supported`)
        }
      }
      await event.save()
      return event
    },
    requestEventRevision: async (
      _,
      req: GQL.IRequestEventRevisionOnMutationArguments,
      context,
      info
    ) => {
      const event = await Event.findOne(req.input.eventId)
      const isOwner = (await event.owner).id === (await context.user).id

      if (!((await hasHigherRole(context)) || isOwner)) {
        throw new Error("Only owner, embassador or admin can request revision")
      }
      if (event.revisionState !== EventRevisionState.CHANGES_REQUIRED) {
        throw new Error(
          `No changes were required, current event state is ${event.revisionState}`
        )
      }

      event.revisionState = EventRevisionState.PENDING_MANDATORY_REVISION
      return event.save()
    },
    dismissOpenEventRevision: async (
      _,
      req: GQL.IDismissOpenEventRevisionOnMutationArguments,
      context: Context
    ) => {
      const userHasHigherRole = await hasHigherRole(context)
      if (!userHasHigherRole) {
        throw new Error("Insufficient permissions to dismiss a revision")
      }
      const revision = await EventRevision.findOne(req.input.revisionId)
      if (!(await revision.isActive())) {
        throw new Error("Revision is not active and so cannot be dismissed")
      }
      revision.dismissedBy = Promise.resolve(context.user)
      await revision.save()
      return revision.event
    },
  },
  Query: {
    revisions: async (_, req: GQL.IRevisionsOnQueryArguments, context: Context) => {
      const userHasHigherRole = await hasHigherRole(context)
      if (!userHasHigherRole) {
        throw new Error("Insufficient permissions to dismiss a revision")
      }
      return EventRevision.find({
        order: {
          lastChangedAt: "DESC",
        },
        take: req.filter.limit || 20
      })
    }
  },
  EventRevision: {},
}

export default revisionResolvers
