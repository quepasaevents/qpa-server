import * as React from "react"
import { OccurrenceData } from "../../Event/OccurrencesQuery"
import { AppContext } from "../../App/Context/AppContext"
import { Link } from 'react-router-dom'

interface Props {
  occurrence: OccurrenceData
}

const ListItem = (props: Props) => {
  const { occurrence } = props
  const { event } = occurrence
  const info = event.info[0]
  const startTime = occurrence.start.split(" ")[1].substring(0, 5)
  return (
    <AppContext>
      {({ me }) => (
        <div>
          {startTime}
          &nbsp;
          {info.title}
          {
            me && me.events.find(myEvent => myEvent.id ===  event.id) ? (
              <Link to={`/event/${event.id}/edit`}>Edit</Link>
            ) : null
          }
        </div>
      )}
    </AppContext>
  )
}

export default ListItem
