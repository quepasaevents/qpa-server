import * as React from "react"
import styled from "@emotion/styled"

const sendLogin = (email: string) => {
  return fetch("/api/login", {
    method: "post",
    body: JSON.stringify({email}),
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

const Login = () => {
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const isValid = /\w@\w.\w/.test(email)
  const [error, setError] = React.useState(false)

  return (
    <Root onSubmit={(e) => {
      e.preventDefault()
      setError(false)
      setLoading(true)
      sendLogin(email)
        .then((res) => {
          if (res.status === 200) {
            setSuccess(true)
          } else {
            setError(true)
          }
        })
        .catch(() => {
          setError(true)
        })
    }}>
      {
        error ? (
          <p>
            Could not find a user with the mentioned email. Please sign up first.
          </p>
        ) : (
          success ? (
            <>
              <p>Invitation was sent to your email: {email}</p>
              <p>Please check your email and click on the link provided in the invitation</p>
            </>
          ) : (
            <>
              <label htmlFor="email">Please enter your email to log in</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                }}
                disabled={loading || success}
              />
              <Button
                disabled={!isValid || success}
              >
                Login
              </Button>
            </>
          )

        )
      }
    </Root>
  )
}

const Root = styled.form`
  display: flex;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.6);
  flex-direction: column;
  width: 320px;
`

const Input = styled.input`
  height: 38px;
  font-size: 24px;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 18px;
`
const Button = styled.button`
  height: 38px;
  width: 68px;
  align-self: center;
  margin-top: 48px;
`
export default Login
