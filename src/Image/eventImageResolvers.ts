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
  const event = await Event.findOne(input.eventId)
  if (!event) {
    throw new Error(`Event with id ${input.eventId} not found`)
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
    eventId: input.eventId,
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
    setEventImage: async (
      _,
      req: GQL.ISetEventImageOnMutationArguments,
      context: Context,
      info
    ) => {
      return setEventImageTypeResolver(
        req.input,
        context,
        req.input.imageType,
        imageBucketService
      )
    },
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
