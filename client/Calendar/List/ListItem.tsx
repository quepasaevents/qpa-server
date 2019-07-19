import * as React from "react"
import { OccurrenceData } from "../../Event/OccurrencesQuery"
import { AppContext } from "../../App/Context/AppContext"
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

interface Props {
  occurrence: OccurrenceData
}

const sanitizeEventName = (name: string) => {
  return encodeURIComponent(name.trim().toLocaleLowerCase()
    .replace(/\s+/g,'-'))

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
          <Link to={`/o/${sanitizeEventName(event.info[0].title)}/${occurrence.id}`}>
            {info.title}
          </Link>
          {
            me && me.events.find(myEvent => myEvent.id ===  event.id) ? (
              <EditLink to={`/event/${event.id}/edit`}>Edit</EditLink>
            ) : null
          }
        </div>
      )}
    </AppContext>
  )
}

const EditLink = styled(Link)`
  margin-left: 8px;
  font-size: 0.6em;
`

export default ListItem
