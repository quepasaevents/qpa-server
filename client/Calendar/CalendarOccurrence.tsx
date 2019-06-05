import * as React from 'react'
import {OccurrenceData} from "../Event/OccurrencesQuery"

interface Props {
  occurrence: OccurrenceData
  language?: string
}

const CalendarOccurrence = (props: Props) => {
  const event = props.occurrence.event
  const localInfo = props.language
    ? event.info.find(info => info.language === props.language)
    : event.info[0]
  return (<div>
    {event.info[0].title}
</div>)

}

export default CalendarOccurrence
