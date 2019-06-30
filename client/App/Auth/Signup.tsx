import * as React from "react"
import styled from "@emotion/styled"
import {FormEvent} from "react"

const Signup = () => {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [emailTaken, setEmailTaken] = React.useState(false)

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)

        fetch("/api/signup", {
          method: "post",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email")
          })
        }).then((res) => {
          if (res.status === 200) {
            setSuccess(true)
            return
          } else {
            setError(true)
            setSuccess(false)
          }

          if (res.status === 409) {
            setEmailTaken(true)
          }
        }).catch(() => {
          setError(true)
        })

      }}
    >
      <Input name="name" placeholder="Your name"/>
      <Input name="username" placeholder="Choose a username"/>
      <Input name="email" type="email" placeholder="Your email"/>
      <Button type="submit">Sign Up</Button>
      {
        emailTaken ? (
          <p>This email is already registered. Please log in.</p>
        ) : null
      }
      {
        error ? <p>We have encountered an error. Please try again.</p> : null
      }
    </form>
  )
}

const Root = styled.form``

const Input = styled.input``

const Button = styled.button``
export default Signup
