import axios from 'axios';
import * as React from 'react';

interface Props {

}

interface State {
  events: any[]
}

export default class Events extends React.Component<Props, State> {
  public async componentDidMount(){
    this.setState({
      events: await axios.get('https://staging.quepasaalpujarra.com/api/events')
    });
  }
}
