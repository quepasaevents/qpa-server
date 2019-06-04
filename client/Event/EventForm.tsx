import * as React from "react"
import { Formik, Form, Field } from "formik"
import styled from "styled-components"
import {EventStatus} from "../../@types"

interface Props {
  values?: EventFormData
  onSubmit: (values: EventFormData) => void
  loading: boolean
}

export interface EventFormData {
  time: {
    timeZone: string
    start: string
    end: string
    recurrence?: string
  }
  info: Array<{
    language: string
    title: string
    description: string
  }>
  location: {
    address?: string
    name: string
    coordinate?: {
      lat: number
      lng: number
    }
  }
  contact: Array<{
    name: string
    languages?: string[]
    contact: {
      email?: string
      phone?: string
    }
  }>
  status: EventStatus
}

class EventFormik extends Formik<EventFormData> {}

const nextWeekTenAM = new Date()
nextWeekTenAM.setUTCDate(nextWeekTenAM.getDate() + 7)
nextWeekTenAM.setUTCHours(10, 0)

const nextWeekMidday = new Date(nextWeekTenAM)
nextWeekMidday.setUTCHours(12)

const EventForm = (props: Props) => {
  const isEdit = !!props.values
  return (
    <EventFormik
      onSubmit={props.onSubmit}
      initialValues={
        props.values
          ? props.values
          : {
            time: {
              timeZone: "Europe/Madrid",
              start: nextWeekTenAM.toISOString().substring(0, 16),
              end: nextWeekMidday.toISOString().substring(0, 16)
            },
            info: [
              {
                language: "en",
                title: "",
                description: ""
              }
            ],
            location: {
              name: ""
            },
            contact: [
              {
                name: "",
                contact: {
                  email: "",
                  phone: ""
                }
              }
            ],
          status: 'confirmed'
          }
      }
      validate={values => {
        const errors: any = {}
        console.log(values.info)
      }}
    >
      {({ isValid }) => (
        <StyledForm>
          <Field name="info[0].title">
            {({ field }) => <input {...field} placeholder="Name your event" />}
          </Field>
          <Field name="info[0].description">
            {({ field }) => (
              <textarea
                {...field}
                placeholder="Write a few words about your event"
              />
            )}
          </Field>
          <Field name="location.name">
            {({ field }) => <input {...field} placeholder="Location's name" />}
          </Field>
          <Field name="location.address">
            {({ field }) => <input {...field} placeholder="Address" />}
          </Field>
          <Field name="contact[0].name">
            {({ field }) => (
              <input {...field} placeholder="Name of contact person" />
            )}
          </Field>
          <Field name="contact[0].phone">
            {({ field }) => (
              <input {...field} placeholder="Phone number to contact" />
            )}
          </Field>
          <Field name="contact[0].email">
            {({ field }) => <input {...field} placeholder="Email to contact" />}
          </Field>
          <button type="submit">
            {
              isEdit ? 'Edit' : 'Create'
            }
          </button>
        </StyledForm>
      )}
    </EventFormik>
  )

}
const StyledForm = styled(Form)``
export default EventForm
