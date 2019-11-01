import React, { Component }  from 'react';
import { BrowserRouter } from 'react-router-dom'
import Router from './components/Routes/Router'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foof: ''
    }
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Router/>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;