import React from 'react';
import { Route } from 'react-router-dom';

import {
  Navigation,
  Home,
  About,
} from './components';

const App = () => (
  <div>
    <Navigation />
    <hr />
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
  </div>
)

export default App;
