import axios from 'axios';
import * as React from 'react';
import {Link, match} from "react-router-dom";

interface Props {
  match: match<{hash: string, email: string}>
}

interface State {
  loginStatus: 'success' | 'error' | 'failure' | 'loading'
}

const responseCodeToLoginStatus = {
  200: 'success',
  403: 'failure',
  500: 'error'
}
class InitiateSession extends React.Component<Props, State> {
  async componentDidMount() {
    const { hash } = this.props.match.params
    this.setState({loginStatus: 'loading'})
    const response = await axios.post('/api/signin', {
      hash,
    })
    const loginStatus = responseCodeToLoginStatus[response.status] || 'error';
    this.setState({loginStatus})
  }

  render() {
    return <div>
      <h1>Thanks for coming back, we will log you in now.</h1>
      {
        this.state.loginStatus === 'loading' && <div>Please wait ...</div>
      }
      {
        this.state.loginStatus === 'success' && <div>You are now logged in. <Link to="/events/create">Create your event</Link></div>
      }
      {
        this.state.loginStatus === 'failure' && <div>Could not log you in</div>
      }
      <h1>Thanks for coming back, we will log you in now.</h1>
    </div>
  }
}


export default InitiateSession
