import React from 'react';
import styles from './home.css'

import Image from '../../components/Image';

export default class Home extends React.Component {
  render() {
    return (
      <div className={styles.homeWrapper}>
        <div className={`container`}>
          <h1 className={styles.homeHeading}>Home</h1>
          <p>A production ready starterkit for a Progressive Web Application</p>
        </div>
      </div>
    );
  }
}
