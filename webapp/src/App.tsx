import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import CreateEvent from './CreateEvent';
import InitiateSession from './InitiateSession'
import RequestMagicLink from './RequestMagicLink'

class App extends React.Component {
  public render() {
    return (
      <Router>
          <Switch>
            <Route path="/login/:hash" component={InitiateSession}/>
            <Route path="/login" component={RequestMagicLink}/>
            <Route path="/post" component={CreateEvent}/>
          </Switch>
      </Router>
    );
  }
}

export default App;
