import { values as _values } from 'lodash';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navigation.css'
import routes from '../../config/routes';

const links = _values(routes);

const Navigation = () => (
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
)

export default Navigation;
