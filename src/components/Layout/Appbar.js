import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Menu } from 'semantic-ui-react';

import Link from '../Link';
import s from './Layout.css';

class Appbar extends React.Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const { logout } = this.props;
    const userLink = (
      <Menu.Item position="right" name="user">
        <Link to="/login" onClick={() => logout()}>Log Out</Link>
      </Menu.Item>
    );
    const guestLink = (
      <Menu.Item position="right" name="user">
        <Link to="/login">Log In</Link>
      </Menu.Item>
    );

    return (
      <Menu fixed="top" inverted borderless style={this.props.style}>
        <Menu.Item>
          <Menu.Header as={Link} to="/">
            <span style={{ fontSize: 18 }}>
              DRC
              <span style={{ color: 'red' }}>VIGILANTE</span>
            </span>
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
