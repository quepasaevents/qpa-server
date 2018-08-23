import axios from 'axios';
import * as React from 'react';
import {CalendarEvent} from "../../../functions/src/types";
import EventItem from './EventItem'

interface IProps {
  className?: string
}

interface IState {
  events: CalendarEvent[],
  loadingState: 'loading' | 'error' | null
}

export default class Events extends React.Component<IProps, IState> {
  public state = {
    events: [],
    loadingState: null,
  }

  public async componentDidMount() {
    try {
      this.setState({
        loadingState: 'loading'
      })
      const eventsResponse = await axios.get('/api/events');
      this.setState({
        events: eventsResponse.data as CalendarEvent[]
      });
    } catch (e) {
      this.setState({
        loadingState: 'error'
      })
    }
  }

  public render() {
    return <div className={this.props.className}>
      {
        this.state.loadingState === 'loading' && <h4>loading ...</h4>
      }
      {
        this.state.loadingState === 'error' && <h4>Error occured while loading</h4>
      }
      {
        this.state.events && this.state.events.map((event: CalendarEvent) => <EventItem key={event.id} event={event}/>)
      }
    </div>
  }
}
