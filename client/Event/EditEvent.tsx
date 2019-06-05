import * as React from 'react'
import GetEventQuery from "./GetEventQuery"
import EventForm from "./EventForm"
import EditEventMutation from "./EditEventMutation"
import removeTypename from "../App/remove-typename";

interface Props {
  eventId: string
}

const EditEvent = (props: Props) => (
  <EditEventMutation>
    {
      (editEvent, { loading: editLoading }) => (
        <GetEventQuery skip={!props.eventId} variables={{id: props.eventId}}>
          {
            ({data, error, loading}) => {
              if (loading) {
                return 'Loading...'
              }
              if (error) {
                return error.message
              }
              const event = removeTypename(data.event)

              return (
                <EventForm
                  loading={loading}
                  onSubmit={values => {
                    editEvent({
                      variables: {
                        input: {
                          id: props.eventId,
                          ...values
                        }
                      }
                    })
                  }}
                  values={{
                    meta: {
                      tags: event.meta.tags
                    },
                    time: event.time,
                    location: event.location,
                    info: event.info,
                    status: event.status
                  }}/>
              )
            }
          }
        </GetEventQuery>
      )
    }
  </EditEventMutation>
)
export default EditEvent
