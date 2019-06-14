import * as React from 'react'
import styled from '@emotion/styled'

const Login = () => {
  return (
    <Root>
      <label htmlFor="email">Please enter your email to log in</label>
      <Input id="email" type="email" />
      <Button>Login</Button>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  font-size: 24px;
  color: rgba(0,0,0,.6);
  flex-direction: column;
  width: 320px;
`

const Input = styled.input`
  height: 38px;
  font-size: 24px;
  text-align: center;
  color: rgba(0,0,0,.7);
`
const Button = styled.button`
  height: 38px;
  width: 68px;
  align-self: center;
  margin-top: 8px;
`
export default Login
