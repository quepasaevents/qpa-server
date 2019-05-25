import * as React from "react"
import OccurrencesQuery from "../Event/OccurrencesQuery"
import CalendarOccurrence from "./CalendarOccurrence"

interface Props {
}

const beginningOfThisMonth = (() => {
    const dt = new Date()
    dt.setDate(1)
    return dt
  }
)()

const endOfThisMonth = (
  () => {
    const dt = new Date()
    dt.setMonth(dt.getMonth() + 1)
    dt.setDate(0)
    return dt
  }
)()


const Calendar = (props: Props) => (
  <OccurrencesQuery
    variables={{
      filter: {
        from: beginningOfThisMonth,
        to: endOfThisMonth
      }
    }}
  >
    {({data, error, loading}) => {
      if (loading) {
        return "I am a Spinner"
      }
      if (error) {
        return error.message
      }

      if (!data.occurrences.length) {
        return <p>No occurrences</p>
      }
      return data.occurrences.map(occ => <CalendarOccurrence key={occ.id} occurrence={occ}/>)
    }}
  </OccurrencesQuery>
)

export default Calendar
