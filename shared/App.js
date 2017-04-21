import styles from './global.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './config/routes';

import {
  Navigation,
} from './components';

import {
  Home,
  About,
  ErrorPage
} from './routes';

const App = () => (
  <div className={styles.wrapper}>
    <Navigation />
    <hr />
    <Switch>
      <Route exact path={routes.home.path} component={Home} />
      <Route path={routes.about.path} component={About} />
      <Route component={ErrorPage} />
    </Switch>
  </div>
)

export default App;
