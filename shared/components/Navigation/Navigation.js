import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navigation.css'

export default class Navigation extends React.Component {

  render() {
    const { links } = this.props;

    return (
      <nav>
        <ul className={styles.navlist}>
          {
            links.map(link => (
              <li key={link.path}>
                <NavLink
                  exact
                  to={link.path}
                  activeClassName={styles.activeLink}
                >
                  {link.label}
                </NavLink>
              </li>
            ))
          }
        </ul>
      </nav>
    );
  }
}
