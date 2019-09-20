import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import config from 'config';
import { apiClient } from 'helpers/api';
import { API_LOGOUT_PATH } from 'constants';

import {
  FaAngleDown,
  FaUnlockAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import UserCircleO from 'components/common/icons/user-circle-o';

import {
  profilePath,
  changePasswordPath,
} from 'components/layout/layout.paths';

import styles from './user-menu.styles.pcss';

const linksList = [
  {
    label: 'Profile',
    to: profilePath(),
    icon: UserCircleO,
    routerLink: true,
  },
  {
    label: 'Change Password',
    to: changePasswordPath(),
    icon: FaUnlockAlt,
    routerLink: true,
  },
];

const getLinkContent = link => (
  <>
    <link.icon size={16} />
    <span>
      {link.label}
    </span>
  </>
);


class UserMenu extends Component {
  static links() {
    return linksList.map(link => (
      <li key={link.label}>
        <Link to={link.to} className={styles.link}>
          {getLinkContent(link)}
        </Link>
      </li>
    ));
  }

  state = {
    menuOpen: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onToggleMenu = () => {
    const { menuOpen } = this.state;

    this.setState({ menuOpen: !menuOpen });
  };

  onDocumentClick = (e) => {
    const el = e.target;
    if (!(this.menu && el instanceof Node && this.menu.contains(el))) {
      this.setState({ menuOpen: false });
    }
  };

  onEnterDown = (e) => {
    if (e.keyCode === 13) {
      this.closeMenu();
    }
  };

  logout = async () => {
    await apiClient.post(API_LOGOUT_PATH);
    window.location.href = config.landingLoginUrl;
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { menuOpen } = this.state;

    return (
      <span className={styles.user}>
        <span
          className={styles.userBtn}
          role="button"
          tabIndex="0"
          onClick={this.onToggleMenu}
          onKeyDown={this.onEnterDown}
          ref={(menu) => {
            this.menu = menu;
          }}
        >
          <UserCircleO size={30} />
          <FaAngleDown
            size={20}
            className={classnames(styles.angle, { [styles.open]: menuOpen })}
          />
        </span>

        <div
          className={classnames(styles.menu, {
            [styles.open]: menuOpen,
          })}
        >
          <ul className={styles.list}>
            {UserMenu.links()}
            <li>
              <a href="#0" className={styles.link} onClick={this.logout}>
                {getLinkContent({ label: 'Log Out', icon: FaSignOutAlt })}
              </a>
            </li>
          </ul>
        </div>
      </span>
    );
  }
}

export default UserMenu;
