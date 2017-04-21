import React from 'react';
import styles from './image.css';

export default class Image extends React.Component {
  render() {
    const { src } = this.props;

    return (
      <figure>
        <img src={src} />
      </figure>
    )
  }
}
