import axios from 'axios'
import {Field, FieldProps, Form, Formik, FormikErrors, FormikProps} from 'formik';
import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import styled from 'styled-components';

const submitRequestToken = (loginRequest: SessionRequest) => {
  axios.post('/api/session', loginRequest)
}

interface SessionRequest {
  email: string;
}

interface Props extends RouteComponentProps {
}

class RequestMagicLink extends React.Component<Props, {}> {

  handleValidate(values: SessionRequest): FormikErrors<SessionRequest> {
      const errors: FormikErrors<SessionRequest> = {};
      // get a proper validator for this
      if (!(values && values.email && values.email.includes('@'))){
      errors.email = 'Must include valid email address'
    }
    return errors
  }

  handleSubmit = async (values: SessionRequest) => {
    this.setState({
      loading: true,
    })
    let response
    try {
      response = await axios.post('/api/signin', values)
    } catch (e) {
      this.setState({
        error: e
      })
      return
    } finally {
      this.setState({
        loading: false
      })
    }

    if (response.status === 200) {
      this.setState({
        error: null,
        invitationSent: true,
      })
    }

  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <MessageContainer>
          In order to just view the calendar you don't need to log in, you can simply go back to the calendar and browse
          the events. You only need a login if you have an event you would like to publish or manage. If you already have
          registered, simply enter your email below and you will get a magic link per email. Following the magic link will
          log you into this page. No password necessary.
        </MessageContainer>
        <Formik onSubmit={submitRequestToken} initialValues={{email: ''}} validateOnBlur={true} validate={this.handleValidate}>
          {
            (formikProps: FormikProps<SessionRequest>) => (
              <Form>
                <Field name="email">
                  {
                    ({ field }: FieldProps<string>) => <input type="email" {...field} />
                  }
                </Field>
                <Button disabled={!formikProps.isValid} type="submit">Request magic link</Button>
              </Form>
            )
          }
        </Formik>
      </div>
    )
  }
}

const MessageContainer = styled.div`
  max-width: 600px;
  margin-bottom: 24px;
`
const Button = styled.button`
  &[disabled] {
    cursor: not-allowed;
  }
`

export default withRouter(RequestMagicLink)
