import React, { Component } from 'react';
import { render } from 'react-dom';

const rootEl = document.querySelector('#app');

class App extends Component{
  render() {
    return (
      <div>
        Hello
      </div>
    )
  }
}

render(<App />, rootEl);
