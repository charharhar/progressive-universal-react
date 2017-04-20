import styles from './home.css'
import React from 'react';

const Home = () => (
  <div className={styles.homeWrapper}>
    <h1 className={styles.homeHeading}>Home</h1>
    <img src="react-logo.svg" />
  </div>
)

export default Home;
