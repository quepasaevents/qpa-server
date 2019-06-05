import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {EventStatus} from "../../@types"

export const EventFragment = gql`
  fragment EventData on CalendarEvent {
    id
    info {
      description
      language
      title
    }
    location {
      address
      name
    }
    time {
      start
      end
      timeZone
      recurrence
    }
    status
    meta {
      tags
    }
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
export interface EventMetaData {
  tags: string[]
}

export interface EventData {
  id: string
  info: EventInfoData[]
  contact: ContactData[]
  location: {
    address: string
    name: string
  }
  time: EventTimeData
  status: EventStatus
  meta: EventMetaData
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
  id: string
}

export default class GetEventQuery extends Query<Data, Variables> {
  static defaultProps = { query }
}

