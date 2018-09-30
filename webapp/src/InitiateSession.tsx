import axios from 'axios';
import * as React from 'react';
import {Link, match} from "react-router-dom";

interface Props {
  match: match<{hash: string, email: string}>
}
type LoginStatus = 'success' | 'error' | 'failure' | 'loading'
interface State {
  loginStatus: LoginStatus
}

class InitiateSession extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {loginStatus: 'loading'}
  }

  async componentDidMount() {
    const { hash } = this.props.match.params
    let loginStatus: LoginStatus = 'loading';
    this.setState({loginStatus})

    try {
      const response = await axios.post('/api/signin', {
        hash,
      })
      if (response.status === 200) {
        loginStatus = 'success'
      } else if (response.status === 403) {
        loginStatus = 'failure'
      } else if (response.status === 401) {
        loginStatus = 'failure';
      }
    } catch (e) {
        loginStatus = 'error';
    }
    if (loginStatus === undefined) {
      throw new Error('Could not determine login statue')
    }
    this.setState({loginStatus})
  }

  render() {
    return <div>
      <h1>Thanks for coming back, we will log you in now.</h1>
      {
        this.state.loginStatus === 'loading' && <div>Please wait ...</div>
      }
      {
        this.state.loginStatus === 'success' && <div>You are now logged in. <Link to="/events/create">Create an event</Link></div>
      }
      {
        this.state.loginStatus === 'failure' && <div>Could not log you in</div>
      }
      <h1>Thanks for coming back, we will log you in now.</h1>
    </div>
  }
}


export default InitiateSession
