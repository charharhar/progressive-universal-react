import React from 'react';
import { Switch } from 'react-router';
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
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  </div>
)

export default App;
