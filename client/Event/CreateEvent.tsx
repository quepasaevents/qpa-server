import * as React from 'react'
import CreateEventMutation from './CreateEventMutation'
import EventForm from "./EventForm";

const CreateEvent = () => {
  <CreateEventMutation>
    {
      (createEvent) => (
        <EventForm onSubmit={createEvent({
          variables: {
            input: {

            }
          }
        })}>

        </EventForm>
      )    }
  </CreateEventMutation>
}
