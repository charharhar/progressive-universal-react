import React from 'react';
import { values as _values } from 'lodash';
import styles from './global.css';
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

export default class App extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <Navigation links={_values(routes)} />
        <Switch>
          <Route exact path={routes.home.path} component={Home} />
          <Route path={routes.about.path} component={About} />
          <Route component={ErrorPage} />
        </Switch>
      </div>
    )
  }
}
