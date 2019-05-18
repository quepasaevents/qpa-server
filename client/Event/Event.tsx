import * as React from "react"
import { EventData } from "./EventsQuery"

interface Props {
  event: EventData
  language?: string
}

const Event = (props: Props) => {
  // Get desired language or fallback to first language
  const localInfo = props.language
    ? props.event.info.find(info => info.language === props.language)
    : props.event.info[0]
  return (
    <div>
      <h1> {localInfo.title} </h1>
      <p> {localInfo.description} </p>
    </div>
  )
}
export default Event
