import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navigation.scss'

const routes = [
  { route: '/', label: 'Home' },
  { route: '/about', label: 'About' },
]

const Navigation = () => (
  <nav>
    <ul className={styles.navlist}>
      {
        routes.map(link => (
          <li key={link.route}>
            <NavLink
              exact
              to={link.route}
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
