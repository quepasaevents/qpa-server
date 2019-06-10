import * as React from "react"
import { Formik, Form, Field } from "formik"
import styled from "styled-components"
import { EventStatus } from "../../@types"
import DateTime from "./DateTime";

interface Props {
  values?: EventFormData
  onSubmit: (values: EventFormData) => void
  loading: boolean
}

export interface EventFormData {
  time: {
    timeZone: string;
    start: string;
    end: string;
    recurrence?: string;
  }
  info: Array<{
    language: string;
    title: string;
    description: string;
  }>
  location: {
    address?: string;
    name: string;
  }
  status: EventStatus
  meta: {
    tags: string[];
  }
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
              meta: {
                tags: []
              },
              status: "confirmed"
            }
      }
      validate={values => {
        const errors: any = {}
      }}
    >
      {({ isValid, setFieldValue }) => (
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
          <Field name="time.start">
            {
              ({ field }) => <DateTime {...field} onChange={(newStartValue) => setFieldValue('time.start', newStartValue)} />
            }
          </Field>
          <Field name="time.end">
            {
              ({ field }) => <DateTime {...field} onChange={(newEndValue) => setFieldValue('time.end', newEndValue)} />
            }
          </Field>
          <Field name="location.name">
            {({ field }) => <input {...field} placeholder="Location's name" />}
          </Field>
          <Field name="location.address">
            {({ field }) => <input {...field} placeholder="Address" />}
          </Field>

          <button type="submit">{isEdit ? "Edit" : "Create"}</button>
        </StyledForm>
      )}
    </EventFormik>
  )
}
const StyledForm = styled(Form)``
export default EventForm
