import {
  Event,
  EventInformation,
  EventOccurrence
} from "../Calendar/Event.entity"
import { EventTag } from "../Calendar/EventTag.entity";

export const getTags = async (tagNames: string[]): Promise<EventTag[]> => {
  const tagPromises = tagNames.map(tagName =>
    EventTag.findOne({
      where: {
        name: tagName,
      },
    })
  )
  const tags = await Promise.all(tagPromises)
  return tags
}
