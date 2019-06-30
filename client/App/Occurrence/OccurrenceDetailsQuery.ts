import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const query = gql`
    query GetOccurrenceDetails($occurrenceId: ID!) {
      occurrence(id: $occurrenceId) {
        id
        start
        end
        timeZone
        event {
          id
          owner {
            id
            name
          }
          info {
            description
            language
            title
          }
        }
      }
    }
`

export interface OccurrenceDetailsData {
  occurrence: {
    id: string
    start: string
    end: string
    timeZone: string
    event: {
      owner: {
        id: string
        name: string
      }
      info: {
        description
        language
        title
      }
    }
  }
}

interface Variables {
  occurrenceId: string
}

export default class OccurrenceDetailsQuery extends Query<OccurrenceDetailsData, Variables> {
  static defaultProps = {
    query
  }
}
