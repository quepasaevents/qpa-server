import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import CreateEvent from './CreateEvent';
import RequestMagicLink from './RequestMagicLink'

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div>
          <Route path="/login" component={RequestMagicLink}/>
          <Route path="/post" component={CreateEvent}/>
        </div>
      </Router>
    );
  }
}

export default App;
