import React from 'react';
import styles from './home.css'
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';

import Image from '../../components/Image';

export default class Home extends React.Component {
  render() {
    return (
      <div className={styles.homeWrapper}>
        <Container>
          <h1 className={styles.homeHeading}>Home</h1>
          <p>A production ready starterkit for a Progressive Web Application</p>
          <Button color="primary">MUI button</Button>
        </Container>
      </div>
    );
  }
}
