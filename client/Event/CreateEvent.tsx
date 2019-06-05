import * as React from 'react'
import CreateEventMutation from './CreateEventMutation'
import EventForm, {EventFormData} from "./EventForm"

const CreateEvent = () => {
  return <CreateEventMutation>
    {
      (createEvent, { loading }) => (
        <EventForm
          loading={loading}
          onSubmit={(values: EventFormData) => {
          createEvent({
            variables: {
              input: {
                info: values.info,
                location: values.location,
                time: {
                  ...values.time,
                  timeZone: 'Europe/Madrid',
                },
                status: 'confirmed',
                meta: values.meta
              }
            }
          })
        }} />
      )}
  </CreateEventMutation>
}

export default CreateEvent
