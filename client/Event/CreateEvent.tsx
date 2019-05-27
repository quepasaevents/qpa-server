import * as React from 'react'
import CreateEventMutation from './CreateEventMutation'
import EventForm, {EventFormData} from "./EventForm"

const CreateEvent = () => {
  return <CreateEventMutation>
    {
      (createEvent) => (
        <EventForm onSubmit={(values: EventFormData) => {
          createEvent({
            variables: {
              input: {
                info: values.info,
                location: {
                  name: values.location.name,
                  address: values.location.address,
                },
                time: {
                  end: values.time.end,
                  start: values.time.start,
                  timeZone: 'Europe/Madrid',
                  recurrence: values.time.recurrence
                },
                status: 'confirmed',
                contact: [
                  {
                    name: values.contact.name,
                    languages: values.contact.languages,
                  }
                ]
              }
            }
          })
        }} />
      )}
  </CreateEventMutation>
}

export default CreateEvent
