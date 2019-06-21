import * as React from "react"
import { OccurrenceData } from "../../Event/OccurrencesQuery"
import ListItem from "./ListItem"

interface Props {
  occurrences: OccurrenceData[]
}

const List = (props: Props) => {
  const sorted = [...props.occurrences]
  sorted.sort((occA, occB) => {
    if (occA.start > occB.start) {
      return 1
    }
    if (occA.start < occB.start) {
      return -1
    }
    return 0
  })
  const days: { [day: string]: OccurrenceData[] } = {}
  sorted.forEach(occ => {
    const day = occ.start.substring(0, 10)
    if (!days[day]) {
      days[day] = []
    }
    days[day].push(occ)
  })
  const dayNames = Object.keys(days)
  return (
    <div>
      <h3>Events for the dates between {dayNames[0]} and {dayNames[dayNames.length-1]}</h3>
      {dayNames.map(dayName => (
        <ul key={dayName}>
          <li>{dayName}</li>
          {days[dayName].map(occ => (
            <ListItem key={occ.id} occurrence={occ} />
          ))}
        </ul>
      ))}
    </div>
  )
}

export default List
