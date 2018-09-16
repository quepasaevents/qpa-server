import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import CreateEvent from './CreateEvent';
import Login from './Login'
import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <div className="App-intro">
            <Route path="/login" component={Login}/>
            <Route path="/post" component={CreateEvent}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
