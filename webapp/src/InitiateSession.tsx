import axios from 'axios';
import * as React from 'react';
import {match} from "react-router-dom";
interface Props {
  match: match<{hash: string, email: string}>
}


class InitiateSession extends React.Component<Props> {
  componentDidMount() {
    const { email, hash } = this.props.match.params
    const response = axios.post('/api/signin', {
      email, hash,
    })
    console.log('response', response)
  }

  render() {
    return <h1>Will submit your hash for intiation. Please wait... {this.props.match.params.hash} - {this.props.match.params.email}</h1>
  }
}


export default InitiateSession
