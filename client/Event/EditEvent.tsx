import * as React from 'react'
import GetEventQuery from "./GetEventQuery"
import EventForm from "./EventForm"
import EditEventMutation from "./EditEventMutation"

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
                    meta: data.event.meta,
                    time: data.event.time,
                    location: data.event.location,
                    info: data.event.info,
                    status: data.event.status
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
