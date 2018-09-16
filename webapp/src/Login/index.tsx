import axios from 'axios'
import {Field, FieldProps, Form, Formik} from 'formik';
import * as React from 'react';

const submitLogin = (loginRequest: LoginRequest) => {
  axios.post('/api/session', loginRequest)
}

interface LoginRequest {
  email: string;
}

const Login = () => (
  <div>
    <h1>Login</h1>
    <div>
      Please enter your email
    </div>
    <Formik onSubmit={submitLogin} initialValues={{email: ''}}>
      {
        () => (
          <Form>
            <Field name="email">
              {
                ({ field }: FieldProps<string>) => <input {...field} />
              }
            </Field>
          </Form>
        )
      }
    </Formik>
  </div>
)
export default Login
