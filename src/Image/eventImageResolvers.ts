import { Context } from "../@types/graphql-utils"
import ImageBucketService from "./ImageBucketService"
import { Event } from "../Calendar/Event.entity"
import { User } from "../Auth/User.entity"
import { FileUpload } from "graphql-upload"
import { EventImage, ImageType } from "./EventImage.entity"

const canChangeEvent = async (event: Event, user?: User) => {
  if (!user) {
    return false
  }
  const roles = (await user.roles).map(role => role.type)
  if (roles.includes("admin") || roles.includes("embassador")) {
    return true
  }
  return (await event.owner).id === user.id
}

const setEventImageTypeResolver = async (
  input: GQL.IEventImageUploadInput,
  context: Context,
  imageType: ImageType,
  imageBucketService: ImageBucketService
) => {
  console.log("Mutation resolver: setEventCoverImage")
  const event = await Event.findOne(input.id)
  if (!event) {
    throw new Error(`Event with id ${input.id} not found`)
  }
  if (!(await canChangeEvent(event, context.user))) {
    throw new Error(`Only owner, embassador or admin can manipulate the event`)
  }
  const fileUpload: FileUpload = await input.file
  const coverImageURL = await imageBucketService.uploadToBucket(fileUpload, {
    fileMeta: {
      filename: fileUpload.filename,
      mimetype: fileUpload.mimetype,
    },
    imageType,
    eventId: input.id,
  })
  const imageEntity = new EventImage()
  imageEntity.type = imageType
  imageEntity.event = Promise.resolve(event)
  imageEntity.url = coverImageURL
  await imageEntity.save()
  return event
}

export const EventImageResolvers = (
  imageBucketService: ImageBucketService
) => ({
  Query: {},
  Mutation: {
    setEventCoverImage: async (
      _,
      req: GQL.ISetEventCoverImageOnMutationArguments,
      context: Context,
      info
    ) => {
      return setEventImageTypeResolver(
        req.input,
        context,
        ImageType.Cover,
        imageBucketService
      )
    },
    unsetEventCoverImage: async (
      _,
      req: GQL.IUnsetEventCoverImageOnMutationArguments,
      context: Context,
      info
    ) => {

    },
    setEventPosterImage: async (
      _,
      req: GQL.ISetEventPosterImageOnMutationArguments,
      context: Context,
      info
    ) => {
      return setEventImageTypeResolver(
        req.input,
        context,
        ImageType.Poster,
        imageBucketService
      )

    },
    unsetEventPosterImage: async (
      _,
      req: GQL.IUnsetEventPosterImageOnMutationArguments,
      context: Context,
      info
    ) => {},
    setEventThumbnailImage: async (
      _,
      req: GQL.ISetEventThumbnailImageOnMutationArguments,
      context: Context,
      info
    ) => {
      return setEventImageTypeResolver(
        req.input,
        context,
        ImageType.Thumbnail,
        imageBucketService
      )

    },
    unsetEventThumbnailImage: async (
      _,
      req: GQL.IUnsetEventThumbnailImageOnMutationArguments,
      context: Context,
      info
    ) => {},
    addEventGalleryImages: async (
      _,
      req: GQL.IAddEventGalleryImagesOnMutationArguments,
      context: Context,
      info
    ) => {},
    removeEventGalleryImages: async (
      _,
      req: GQL.IRemoveEventGalleryImagesOnMutationArguments,
      context: Context,
      info
    ) => {},
  },
})
