import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import CreateEvent from './CreateEvent';
import Events from './events/Events'
import InitiateSession from './InitiateSession'
import RequestMagicLink from './RequestMagicLink'
import Root from './Root'

class App extends React.Component {
  public render() {
    return (
      <Router>
          <Switch>
            <Route path="/login/:hash" component={InitiateSession}/>
            <Route path="/login" component={RequestMagicLink}/>
            <Route path="/events/create" component={CreateEvent}/>
            <Route path="/events" component={Events}/>
            <Route path="/" component={Root}/>
          </Switch>
      </Router>
    );
  }
}

export default App;
