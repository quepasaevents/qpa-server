import axios from 'axios';
import Input from 'cc-components/Input';
import * as addHours from 'date-fns/add_hours';
import * as fnsFormat from 'date-fns/format';
import * as startOfTomorrow from 'date-fns/start_of_tomorrow';
import {Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import * as React from 'react';
import {ChangeEvent} from "react";
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

interface Props {
}

interface State {
  wholeDayEvent: boolean
}

export default class CreateEvent extends React.Component<Props, State> {

  state = {
    wholeDayEvent: false
  }

  componentDidMount() {
    axios.get('/api/events').then(events => console.log('boludo', events))
  }

  submitEvent(event: CalendarEventRequest) {
    event.timeZone = 'Europe/Madrid'
    axios.post('/api/events', event, {
      headers: {
        Accept: '*/*'
      }
    })
  }

  handleWholeDayEventChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({wholeDayEvent: e.target.checked})
  }

  render() {
    return <Root>
      <Title>Post your own event</Title>
      <Formik onSubmit={this.submitEvent} initialValues={InitialValues}>
        {
          ({values}: FormikProps<CalendarEventRequest>) => (<Form>
            <label>Title
              <Field name="title">
                {
                  ({field}: FieldProps) => <Input {...field} />
                }
              </Field>
            </label>
            <label>Location
              <Field name="location">
                {
                  ({field}: FieldProps) => <Input {...field} />
                }
              </Field>
              <label>Contact phone number
                <Field name="contactPhone">
                  {
                    ({field}: FieldProps) => <Input type="phone" {...field} />
                  }
                </Field>
              </label>
              <label>Contact email
                <Field name="contactEmail">
                  {
                    ({field}: FieldProps) => <Input type="email" {...field} />
                  }
                </Field>
              </label>
            </label>
            <label>
              Start date
              <Field name="timing.start.date">
                {
                  ({field}: FieldProps) => <Input type="date" {...field} />
                }
              </Field>
            </label>
            <label>
              This is a whole day event
              <Input type="checkbox" checked={this.state.wholeDayEvent} onChange={this.handleWholeDayEventChange}/>
            </label>

            <label>
              Start date
              <Field name="timing.start.date">
                {
                  ({field}: FieldProps) => <Input type="date" {...field} />
                }
              </Field>
            </label>

            <label>
              Start time
              <Field name="timing.start.date">
                {
                  ({field}: FieldProps) => <Input disabled={this.state.wholeDayEvent} type="time" {...field} />
                }
              </Field>
            </label>
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
