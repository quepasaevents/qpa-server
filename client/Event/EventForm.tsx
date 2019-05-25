import * as React from "react"
import { Formik, Form, Field } from "formik"

interface Props {
  values?: EventFormData
  onSubmit: (values: EventFormData) => void
}

export interface EventFormData {
  time: {
    timeZone: string;
    start: string;
    end: string;
    recurrence?: string;
  }
  info?: Array<{
    language?: string;
    title: string;
    description: string;
  }>
  location?: {
    address?: string;
    name: string;
    coordinate?: {
      lat: number;
      lng: number;
    };
  }
  contact?: {
    name: string;
    languages?: string[];
    contact: {
      email?: string;
      phone?: string;
    };
  }
}

class EventFormik extends Formik<EventFormData> {}

const nextWeekTenAM = new Date()
nextWeekTenAM.setDate(nextWeekTenAM.getDate() + 7)
nextWeekTenAM.setHours(10, 0)

const nextWeekMidday = new Date(nextWeekTenAM)
nextWeekMidday.setHours(12)

const EventForm = (props: Props) => (
  <EventFormik
    onSubmit={props.onSubmit}
    initialValues={
      props.values
        ? props.values
        : {
            time: {
              timeZone: "Europe/Madrid",
              start: nextWeekTenAM.toDateString(),
              end: nextWeekMidday.toDateString(),
              recurrence: ""
            },
            info: [
              {
                title: "",
                description: ""
              }
            ],
            location: {
              name: ""
            },
            contact: {
              name: "",
              contact: {
                email: "",
                phone: ""
              }
            }
          }
    }
    validate={(values) => {
      const errors: any = {}
      values.info
    }}
  >
    {
      ({ isValid }) => (
        <Form>
          <Field name="info.title">
            {
              ({field}) => (<input {...field} placeholder="Name your event" />)
            }
          </Field>
          <Field name="info.description">
            {
              ({field}) => <textarea {...field} placeholder="Write a few words about your event"/>
            }
          </Field>
          <Field name="location.name">
            {
              ({field}) => <input {...field} placeholder="Location's name"/>
            }
          </Field>
          <Field name="location.address">
            {
              ({field}) => <input {...field} placeholder="Address"/>
            }
          </Field>
          <Field name="contact.name">
            {
              ({field}) => <input {...field} placeholder="Name of contact person"/>
            }
          </Field>
          <Field name="contact.phone">
            {
              ({field}) => <input {...field} placeholder="Phone number to contact"/>
            }
          </Field>
          <Field name="contact.email">
            {
              ({field}) => <input {...field} placeholder="Email to contact"/>
            }
          </Field>
        </Form>
      )
    }
  </EventFormik>
)

export default EventForm
