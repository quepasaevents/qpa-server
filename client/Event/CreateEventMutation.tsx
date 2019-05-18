import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const mutation = gql`
  mutation CreateEvent($input: CreateEventInput!) {
      createEvent(input: $input) {
          id
          info {
              description
              language
              title
          }
          contact {
              contact {
                  email
                  phone
              }
              languages
              name
          }
          location {
              address 
              coordinate
              name
          }
          occurrences {
              id
              start
              end
          }
      }
  }
`

interface Variables {
  input: GQL.ICreateEventInput
}
