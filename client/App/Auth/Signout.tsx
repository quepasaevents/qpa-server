import * as React from 'react'
import {RouteComponentProps, withRouter} from "react-router"

interface Props extends RouteComponentProps {

}

const Signout = (props: Props) => {
  React.useEffect(() => {
    fetch('/api/signout')
      .then(() => {
        props.history.push('/')
      }).finally(() => {
      props.history.push('/')

    })
  })
  return <p>You will be logged out now</p>
}

export default withRouter(Signout)
