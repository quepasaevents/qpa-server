import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {EventStatus} from "../../@types";

export const EventFragment = gql`
  fragment EventData on CalendarEvent {
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
    time {
      start
      end
      timeZone
      recurrence
    }
    status
  }
`

export interface EventTimeData {
  start: string
  end: string
  timeZone: string
  recurrence: string
}

export interface EventInfoData {
  description: string
  language: string
  title: string
}

export interface ContactData {
  contact: {
    email: string
    phone: string
  }
  languages: string[]
  name: string
}

export interface EventData {
  id: string
  info: EventInfoData[]
  contact: ContactData[]
  location: {
    address: string
    coordinate: {
      lat: number
      lng: number
    }
    name: string
  }
  time: EventTimeData
  status: EventStatus
}

interface Data {
  event: EventData
}

const query = gql`
  ${EventFragment}
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventData
    }
  }
`

interface Variables {
  id: number
}

export default class GetEventQuery extends Query<Data, Variables> {
  static defaultProps = { query }
}

