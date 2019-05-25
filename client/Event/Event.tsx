import * as React from "react"
import { EventData } from "./EventsQuery"
import {OccurrenceData} from "./OccurrencesQuery";

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
      {
        localInfo ? (
          <React.Fragment>
            <h1> {localInfo.title} </h1>
            <p> {localInfo.description} </p>
          </React.Fragment>
        ) : 'Info not available'
      }

    </div>
  )
}
export default Event
