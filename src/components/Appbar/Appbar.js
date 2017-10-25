import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Menu } from 'semantic-ui-react';

import Link from '../Link';
import s from './Appbar.css';

const button = {
  background: 'none!important',
  color: 'inherit',
  border: 'none',
  padding: '0!important',
  font: 'inherit',
  borderBottom: '0px solid #444',
  cursor: 'pointer',
};

class Appbar extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const userLink = (
      <Menu.Item position="right" name="user">
        <form method="post" action="/logout">
          <button style={button} type="submit">
            Log out
          </button>
        </form>
      </Menu.Item>
    );
    const guestLink = (
      <Menu.Item position="right" name="user">
        <Link to="/login">Log In</Link>
      </Menu.Item>
    );

    return (
      <Menu fixed="top" inverted borderless className={s.appbar}>
        <Menu.Item>
          <Menu.Header as={Link} to="/">
            <strong>
              <span className={s.size}>
                DRC
                <span className={s.red}>VIGILANTE</span>
              </span>
            </strong>
          </Menu.Header>
        </Menu.Item>
        {this.props.user &&
          <Menu.Item name="user">
            <Link to="/profile">
              {this.props.user.name}
            </Link>
          </Menu.Item>}
        {this.props.user ? userLink : guestLink}
      </Menu>
    );
  }
}

export default withStyles(s)(Appbar);
