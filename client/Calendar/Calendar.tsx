import * as React from "react"
import EventsQuery from "../Event/EventsQuery"
import Event from "../Event/Event"
interface Props {
  from: Date
  type: "list" | "board"
}

const today = new Date().toISOString().split("T")[0]

const Calendar = () => (
  <EventsQuery
    variables={{
      filter: {
        from: today
      }
    }}
  >
    {({ data, error, loading }) => {
      if (loading) {
        return "I am a Spinner"
      }
      if (error) {
        return error.message
      }

      return data.events.map(event => <Event event={event} />)
    }}
  </EventsQuery>
)
