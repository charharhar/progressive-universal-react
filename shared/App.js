import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
  Navigation,
  Home,
  About,
  ErrorPage
} from './components';

const App = () => (
  <div>
    <Navigation />
    <hr />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route component={ErrorPage} />
    </Switch>
  </div>
)

export default App;
