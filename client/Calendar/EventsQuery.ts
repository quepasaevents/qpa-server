import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const query = gql`
  query EventsQuery($filter: EventsQueryFilter!) {
      events(filter: $filter) {
          id
          status
          info {
              title
              description
          }
      }
  }
`

interface Variables {
  filter: {
    limit?: number
    owner?: number
    from?: string
    to?: string
    categories?: string[]
  }
}
