import * as React from "react"
import OccurrencesQuery from "../Event/OccurrencesQuery"
import List from "./List"

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


const Calendar = (props: Props) => {
  return (
    <OccurrencesQuery
      variables={{
        filter: {
          from: "2019-06-01",
          to: "2019-06-30"
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
        return <List occurrences={data.occurrences}/>
      }}
    </OccurrencesQuery>
  )

}

export default Calendar
