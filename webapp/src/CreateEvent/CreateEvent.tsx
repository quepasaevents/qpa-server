import axios from 'axios';
import * as addHours from 'date-fns/add_hours';
import * as fnsFormat from 'date-fns/format';
import * as startOfTomorrow from 'date-fns/start_of_tomorrow';
import {Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import * as React from 'react';
import styled from 'styled-components';
import {CalendarEventRequest} from "../../../functions/src/types";

const nextWeekNoon = addHours(startOfTomorrow(), 24 * 7 + 12)
const format = (date: Date) => fnsFormat(date, 'YYYY-MM-DD')
const InitialValues: CalendarEventRequest = {
  title: '',
  description: '',
  tags: [],
  timing: {
    end: {
      date: format(addHours(nextWeekNoon, 2)),
      dateTime: '',
    },
    start: {
      date: format(nextWeekNoon),
      dateTime: '',
    },
    recurrence: [],
    status: 'tentative',
  },
  timeZone: '',
  contactPhone: '',
  contactEmail: '',
  locationAddress: '',
  location: '',
  locationCoordinate: [0, 0],
  imageUrl: '',
}

export default class CreateEvent extends React.Component {

  componentDidMount(){
    axios.get('/api/events').then(events => console.log('boludo', events))
  }
  submitEvent(event: CalendarEventRequest) {
    axios.post('/api/events', event, {
      headers: {
        Accept: '*/*'
      }
    })
  }

  render() {
    return <Root>
      <Title>Post your own event</Title>
      <Formik onSubmit={this.submitEvent} initialValues={InitialValues}>
        {
          ({ values }: FormikProps<CalendarEventRequest>) => (<Form>
            <Field name="title">
              {
                ({field}: FieldProps) => <input {...field} />
              }
            </Field>
            <button type="submit">Submit</button>
          </Form>)
        }
      </Formik>
    </Root>
  }
}


const Root = styled.div`
  display: flex;
  flex-direction: column;
`
const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
`
