import { Context } from "../@types/graphql-utils";
import ImageBucketService from "./ImageBucketService";
import { Event } from "../Calendar/Event.entity";
import { User } from "../Auth/User.entity";
import { FileUpload } from "graphql-upload";
import { EventImage, ImageType } from "./EventImage.entity";

const canChangeEvent = async (event: Event, user: User) => {
  const roles = (await user.roles).map(role => role.type)
  if (roles.includes("admin") || roles.includes("embassador")) {
    return true
  }
  return (await event.owner).id === user.id
}

export const EventImageResolvers = (
  imageBucketService: ImageBucketService
) => ({
  Mutation: {
    setEventCoverImage: async (
      _,
      req: GQL.ISetEventCoverImageOnMutationArguments,
      context: Context,
      info
    ) => {
      const event = await Event.findOne(req.input.id)
      if (!event) {
        throw new Error(`Event with id ${req.input.id} not found`)
      }
      if (!(await canChangeEvent(event, context.user))) {
        throw new Error(
          `Only owner, embassador or admin can manipulate the event`
        )
      }

      const fileUpload: FileUpload = await req.input.file
      fileUpload.filename
      const coverImageURL = await imageBucketService.uploadToBucket(
        fileUpload,
        {
          fileMeta: {
            filename: fileUpload.filename,
            mimetype: fileUpload.mimetype,
            encoding: fileUpload.encoding,
          },
          imageType: ImageType.Cover,
          eventId: req.input.id,
        }
      )
      const imageEntity = new EventImage()
      imageEntity.type = ImageType.Cover
      imageEntity.event = Promise.resolve(event)
      imageEntity.url = coverImageURL
      await imageEntity.save()
      return event
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
    ) => {},
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
    ) => {},
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
