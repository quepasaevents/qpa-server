import * as React from 'react';
import {CalendarEvent} from "../../../functions/src/types";

interface IProps {
  event: CalendarEvent
}

export default class EventItem extends React.Component<IProps> {
  public render(){
    return <div>
      event item
    </div>
  }
}
