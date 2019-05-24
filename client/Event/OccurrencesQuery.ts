import {Query} from 'react-apollo'
import gql from 'graphql-tag'

const query = gql`
  query EventsQuery($filter: OccurrencesQueryFilter!) {
    occurrences(filter: $filter) {
      id
      utcStart
      utcEnd
      start
      end
      timeZone
      event {
        id
        info {
          language
          title
        }
      }
    }
  }
`

interface Variables {
  filter: GQL.IOccurrencesQueryFilter
}

export interface InfoData {
  language: string
  title: string
}

export interface OccurrenceData {
  id: string
  utcStart: string
  utcEnd: string
  start: string
  end: string
  timeZone: string
  event: {
    id: string
    info: InfoData[]
  }
}

interface Data {
  occurrences: OccurrenceData[]
}

export default class OccurrencesQuery extends Query<Data, Variables> {
  static defaultProps = {
    query
  }
}
