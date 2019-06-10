import * as React from 'react'
import {OccurrenceData} from "../../Event/OccurrencesQuery"

interface Props {
  occurrence: OccurrenceData
}

const ListItem = (props: Props) => {
  const { occurrence } = props
  const { event } = occurrence
  const info = event.info[0]
  const startTime = occurrence.start.split(' ')[1].substring(0, 5)
  return (
    <div>
      {
        startTime
      }
      &nbsp;
      {
        info.title
      }
    </div>
  )
}

export default ListItem
