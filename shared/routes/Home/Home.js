import styles from './home.css'
import React from 'react';
import images from '../../config/images';

const Home = () => (
  <div className={styles.homeWrapper}>
    <h1 className={styles.homeHeading}>Home</h1>
    <img src={images.logoSvg} />
  </div>
)

export default Home;
