import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import {GQL} from "../../@types";

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
              coordinate {
                  lat
                  lng
              }
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

interface ContactData {
    contact: {
        email: string
        phone: string
    }
    languages: string[]
    name: string
}

interface InfoData {
    desciption: string
    language: string
    title: string
}

interface OccurrenceData {
    id: string
    start: string
    end: string
}
interface Data {
    id: string
    info: InfoData[]
    contact: ContactData[]
    location: {
        address: string
        coordinate: {
            lat: number
            lng: number
        }
        name: string

    }
    occurrences: OccurrenceData[]
}

export default class CreateEventMutation extends Mutation<Data, Variables> {
    static defaultProps = {
        mutation
    }
}
