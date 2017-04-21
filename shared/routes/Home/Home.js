import React from 'react';
import styles from './home.css'
import images from '../../config/images';

import Image from '../../components/Image';

export default class Home extends React.Component {
  render() {
    return (
      <div className={styles.homeWrapper}>
        <h1 className={styles.homeHeading}>Home</h1>
        <Image src={images.logoSvg} />
      </div>
    );
  }
}
